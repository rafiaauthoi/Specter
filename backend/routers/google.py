from fastapi import APIRouter, Query, HTTPException
from services.google_service import scan_gmail, delete_sender_emails

router = APIRouter()

@router.get("/scan")
def scan(user_id: str = Query(...)):
    try:
        return scan_gmail(user_id)
    except Exception as e:
        raise HTTPException(400, str(e))

@router.delete("/delete-sender")
def delete_sender(user_id: str = Query(...), sender_email: str = Query(...)):
    try:
        return delete_sender_emails(user_id, sender_email)
    except Exception as e:
        raise HTTPException(400, str(e))