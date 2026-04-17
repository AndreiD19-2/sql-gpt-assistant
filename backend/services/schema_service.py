# services/schema_service.py

import pyodbc
from config import SQLSERVER_CONN_STR

def build_schema_text(schema_name: str = "dbo") -> str:
    """
    Generează un rezumat text al structurii bazei de date SQL Server
    Formatat ca: 
      - tabel(coloana1 (tip), coloana2 (tip), ...)
    """
    conn = pyodbc.connect(SQLSERVER_CONN_STR)
    cursor = conn.cursor()

    # Interogare pentru tabele și coloane
    cursor.execute(f"""
        SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = ?
        ORDER BY TABLE_NAME, ORDINAL_POSITION
    """, schema_name)

    rows = cursor.fetchall()
    conn.close()

    # Grupăm coloanele pe tabel
    schema = {}
    for table_name, column_name, data_type in rows:
        column_info = f"{column_name} ({data_type})"
        schema.setdefault(table_name, []).append(column_info)

    # Transformăm într-un text simplu pentru GPT
    schema_lines = [f"- {table}({', '.join(cols)})" for table, cols in schema.items()]
    return "Schema:\n" + "\n".join(schema_lines)
