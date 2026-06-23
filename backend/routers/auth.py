from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.config import settings
from core.database import SessionLocal
from core.security import encrypt_token
import requests
import urllib.parse
import sqlalchemy
from supabase import create_client

router = APIRouter()
security = HTTPBearer()

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)

# ─── Supabase email/password auth ───────────────────────────────────────────

@router.post("/signup")
def signup(email: str, password: str):
    try:
        res = supabase.auth.sign_up({"email": email, "password": password})
        if res.user is None:
            raise HTTPException(400, "Signup failed")
        return {"user_id": res.user.id, "email": res.user.email}
    except Exception as e:
        raise HTTPException(400, str(e))

@router.post("/login")
def login(email: str, password: str):
    try:
        res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        if res.session is None:
            raise HTTPException(401, "Invalid credentials")
        return {
            "access_token": res.session.access_token,
            "user_id": res.user.id,
            "email": res.user.email
        }
    except Exception as e:
        raise HTTPException(401, str(e))

@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        supabase.auth.sign_out()
        return {"ok": True}
    except Exception:
        return {"ok": True}

# ─── Token verification dependency ──────────────────────────────────────────

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        token = credentials.credentials
        user = supabase.auth.get_user(token)
        if user is None or user.user is None:
            raise HTTPException(401, "Invalid or expired token")
        return user.user.id
    except Exception:
        raise HTTPException(401, "Invalid or expired token")

# ─── Google OAuth ────────────────────────────────────────────────────────────

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