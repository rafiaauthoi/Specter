from cryptography.fernet import Fernet
from .config import settings
import base64, hashlib

def _get_fernet() -> Fernet:
    key = hashlib.sha256(settings.SECRET_KEY.encode()).digest()
    return Fernet(base64.urlsafe_b64encode(key))

def encrypt_token(token: str) -> str:
    return _get_fernet().encrypt(token.encode()).decode()

def decrypt_token(encrypted: str) -> str:
    return _get_fernet().decrypt(encrypted.encode()).decode()