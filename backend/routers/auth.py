from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from core.config import settings
from core.database import SessionLocal
from core.security import encrypt_token
import os
import sqlalchemy
import requests
import urllib.parse

router = APIRouter()

SCOPES = " ".join([
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/gmail.modify",
])

@router.get("/google")
def google_login(user_id: str = Query(...)):
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPES,
        "access_type": "offline",
        "prompt": "consent",
        "state": user_id,
    }
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode(params)
    return RedirectResponse(auth_url)

@router.get("/google/callback")
def google_callback(code: str, state: str):
    try:
        token_resp = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": settings.GOOGLE_REDIRECT_URI,
                "grant_type": "authorization_code",
            }
        )
        tokens = token_resp.json()

        if "error" in tokens:
            raise HTTPException(400, f"Token error: {tokens['error']}")

        access_token = tokens["access_token"]
        refresh_token = tokens.get("refresh_token")

        db = SessionLocal()
        db.execute(
            sqlalchemy.text("""
                INSERT INTO connected_accounts (user_id, platform, access_token, refresh_token)
                VALUES (:user_id, 'google', :access_token, :refresh_token)
                ON CONFLICT (user_id, platform) DO UPDATE
                SET access_token = :access_token, refresh_token = :refresh_token
            """),
            {
                "user_id": state,
                "access_token": encrypt_token(access_token),
                "refresh_token": encrypt_token(refresh_token) if refresh_token else None,
            }
        )
        db.commit()
        db.close()

        return RedirectResponse(f"{settings.FRONTEND_URL}/dashboard?connected=google")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(400, f"OAuth failed: {str(e)}")