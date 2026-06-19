from fastapi import APIRouter, Query, HTTPException
from services.google_service import scan_gmail

router = APIRouter()

@router.get("/scan")
def scan(user_id: str = Query(...)):
    try:
        return scan_gmail(user_id)
    except Exception as e:
        raise HTTPException(400, str(e))