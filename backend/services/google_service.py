import requests
import sqlalchemy
import json
from core.database import SessionLocal
from core.security import decrypt_token, encrypt_token
from core.config import settings

def get_access_token(user_id: str) -> str:
    db = SessionLocal()
    result = db.execute(
        sqlalchemy.text("SELECT access_token, refresh_token FROM connected_accounts WHERE user_id = :uid AND platform = 'google'"),
        {"uid": user_id}
    ).fetchone()
    db.close()

    if not result:
        raise Exception("Google account not connected")

    access_token = decrypt_token(result[0])
    refresh_token = decrypt_token(result[1]) if result[1] else None

    if refresh_token:
        resp = requests.post("https://oauth2.googleapis.com/token", data={
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "refresh_token": refresh_token,
            "grant_type": "refresh_token",
        })
        if resp.status_code == 200:
            new_token = resp.json().get("access_token")
            if new_token:
                db = SessionLocal()
                db.execute(
                    sqlalchemy.text("UPDATE connected_accounts SET access_token = :token WHERE user_id = :uid AND platform = 'google'"),
                    {"token": encrypt_token(new_token), "uid": user_id}
                )
                db.commit()
                db.close()
                access_token = new_token

    return access_token

def scan_gmail(user_id: str) -> dict:
    token = get_access_token(user_id)
    headers = {"Authorization": f"Bearer {token}"}

    resp = requests.get(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages",
        headers=headers,
        params={"q": "unsubscribe", "maxResults": 50}
    )

    if resp.status_code != 200:
        raise Exception(f"Gmail API error: {resp.text}")

    messages = resp.json().get("messages", [])
    senders = {}

    for msg in messages:
        detail = requests.get(
            f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg['id']}",
            headers=headers,
            params={"format": "metadata", "metadataHeaders": ["From", "Subject"]}
        ).json()

        headers_list = detail.get("payload", {}).get("headers", [])
        header_map = {h["name"]: h["value"] for h in headers_list}
        sender = header_map.get("From", "")
        subject = header_map.get("Subject", "")

        if sender and sender not in senders:
            senders[sender] = {"from": sender, "subject": subject, "count": 1, "msg_id": msg["id"]}
        elif sender in senders:
            senders[sender]["count"] += 1

    db = SessionLocal()
    for sender, data in senders.items():
        metadata_json = json.dumps({"from": data["from"], "subject": data["subject"], "count": data["count"]})
        db.execute(
            sqlalchemy.text("""
                INSERT INTO scan_results (user_id, platform, item_type, item_id, metadata)
                VALUES (:user_id, 'google', 'newsletter', :item_id, CAST(:metadata AS jsonb))
                ON CONFLICT (user_id, item_id) DO NOTHING
            """),
            {
                "user_id": user_id,
                "item_id": data["msg_id"],
                "metadata": metadata_json
            }
        )
    db.commit()
    db.close()

    return {"newsletters_found": len(senders), "senders": list(senders.values())}