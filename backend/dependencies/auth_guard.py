# 📁 backend/dependencies/auth_guard.py

from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

SECRET_KEY = "very-secret-key"  # folosit și la login
ALGORITHM = "HS256"

security = HTTPBearer()

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload  # conține `uid` și `sub`
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expirat")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalid")

def requires_auth(credentials: HTTPAuthorizationCredentials = Depends(security)):
    return verify_token(credentials.credentials)  # poate fi injectat ca `user = Depends(requires_auth)`
