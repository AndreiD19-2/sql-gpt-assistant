# 📁 backend/routes/register_router.py

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from passlib.context import CryptContext
import pyodbc
from config import SQLSERVER_CONN_STR_APP

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str = ""

@router.post("/auth/register")
def register(req: RegisterRequest, request: Request):
    hashed_password = pwd_context.hash(req.password)
    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR_APP)
        cursor = conn.cursor()

        # verificare duplicate
        cursor.execute("SELECT id FROM app_user.users WHERE email = ?", req.email)
        if cursor.fetchone():
            log_auth_action(cursor, None, "register", False, request)
            conn.commit()
            conn.close()
            raise HTTPException(status_code=400, detail="Email deja înregistrat")

        # inserare utilizator
        cursor.execute("""
            INSERT INTO app_user.users (email, password_hash, full_name)
            OUTPUT INSERTED.id
            VALUES (?, ?, ?)
        """, (req.email, hashed_password, req.full_name))

        user_id = cursor.fetchone()[0]

        # logare acțiune
        log_auth_action(cursor, user_id, "register", True, request)

        conn.commit()
        conn.close()
        return {"message": "Utilizator înregistrat cu succes."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def log_auth_action(cursor, user_id, action, success, request):
    ip = request.client.host
    agent = request.headers.get("user-agent", "")
    cursor.execute("""
        INSERT INTO logs.auth_logs (user_id, action, success, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?)
    """, (user_id, action, int(success), ip, agent))
