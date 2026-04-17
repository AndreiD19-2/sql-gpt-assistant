from fastapi import APIRouter
import pyodbc
from config import SQLSERVER_CONN_STR

router = APIRouter()

@router.get("/history")
def get_all_history():
    conn = pyodbc.connect(SQLSERVER_CONN_STR)
    cursor = conn.cursor()
    cursor.execute("""
        SELECT TOP 50
            id,
            user_input,
            generated_sql,
            message,
            status,
            created_at
        FROM dbo.query_history
        ORDER BY created_at DESC
    """)
    rows = cursor.fetchall()
    conn.close()

    return [
        {
            "id": row[0],
            "question": row[1],
            "sql": row[2],
            "message": row[3],
            "status": row[4],
            "time": row[5].isoformat()
        }
        for row in rows
    ]
