# 📁 backend/routes/auth_router.py

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from passlib.context import CryptContext
import pyodbc
from config import SQLSERVER_CONN_STR_APP
import jwt, datetime
from fastapi import Depends
from dependencies.auth_guard import requires_auth  # dacă nu e deja importat


router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "very-secret-key"
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

@router.post("/auth/login", response_model=TokenResponse)
def login(req: LoginRequest, request: Request):
    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR_APP)
        cursor = conn.cursor()
        cursor.execute("SELECT id, password_hash FROM app_user.users WHERE email = ?", req.email)
        row = cursor.fetchone()

        if not row:
            log_auth_action(cursor, None, "fail", False, request)
            conn.commit()
            conn.close()
            raise HTTPException(status_code=401, detail="Email inexistent")

        user_id, password_hash = row
        if not pwd_context.verify(req.password, password_hash):
            log_auth_action(cursor, user_id, "fail", False, request)
            conn.commit()
            conn.close()
            raise HTTPException(status_code=401, detail="Parolă incorectă")

        # JWT
        payload = {
            "sub": req.email,
            "uid": user_id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

        log_auth_action(cursor, user_id, "login", True, request)

        conn.commit()
        conn.close()
        return TokenResponse(access_token=token)

    except Exception as e:
        print("EROARE LOGIN:", str(e))  # 👈 logează excepția în consolă
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/auth/logout")
def logout(request: Request, user_data=Depends(requires_auth)):
    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR_APP)
        cursor = conn.cursor()

        user_id = user_data.get("uid")
        log_auth_action(cursor, user_id, "logout", True, request)

        conn.commit()
        conn.close()
        return {"message": "Logout reușit."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def log_auth_action(cursor, user_id, action, success, request):
    ip = request.client.host
    agent = request.headers.get("user-agent", "")
    cursor.execute("""
        INSERT INTO logs.auth_logs (user_id, action, success, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, action, int(success), ip, agent))
