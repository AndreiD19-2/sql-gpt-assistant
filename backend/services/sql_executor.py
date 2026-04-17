# services/sql_executor.py

import pyodbc
from config import SQLSERVER_CONN_STR

def is_query_safe(sql: str) -> bool:
    lower_sql = sql.lower()
    if "update" in lower_sql or "delete" in lower_sql:
        if "where" not in lower_sql:
            return False
    return True

def execute_sql_query(sql: str) -> dict:
    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR)
        cursor = conn.cursor()

        # Executăm și verificăm dacă e SELECT sau altceva
        if sql.strip().lower().startswith("select"):
            cursor.execute(sql)
            columns = [col[0] for col in cursor.description]
            rows = cursor.fetchall()
            conn.close()
            return {
                "status": "success",
                "type": "select",
                "columns": columns,
                "rows": [list(row) for row in rows]
            }

        else:
            cursor.execute(sql)
            conn.commit()
            conn.close()
            return {
                "status": "success",
                "type": "write",
                "message": "Query executat cu succes"
            }

    except Exception as e:
        return {
            "status": "error",
            "error": str(e)
        }
run_sql = execute_sql_query