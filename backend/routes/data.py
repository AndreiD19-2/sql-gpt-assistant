from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any
from config import SQLSERVER_CONN_STR
import pyodbc

router = APIRouter()

class InsertPayload(BaseModel):
    values: dict[str, Any]

@router.post("/table/{table_name}/insert")
def insert_row(table_name: str, payload: InsertPayload):
    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR)
        cursor = conn.cursor()

        columns = ', '.join(payload.values.keys())
        placeholders = ', '.join(['?' for _ in payload.values])
        values = list(payload.values.values())

        sql = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        cursor.execute(sql, values)
        conn.commit()
        conn.close()
        return {"message": "Row inserted successfully."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
