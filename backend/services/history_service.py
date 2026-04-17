import pyodbc
from config import SQLSERVER_CONN_STR  # conexiune spre LLM_Integration_SQL_ASSISTANT

def save_query_to_db(
    user_id: int,
    user_input: str,
    detected_mode: str,
    generated_sql: str,
    execution_result: str,
    message: str,
    status: str,
    is_favorite: bool = False
):
    conn = pyodbc.connect(SQLSERVER_CONN_STR)
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO dbo.query_history (
            user_id,
            user_input,
            detected_mode,
            generated_sql,
            execution_result,
            message,
            status,
            is_favorite
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        user_id,
        user_input,
        detected_mode,
        generated_sql,
        execution_result,
        message,
        status,
        int(is_favorite)
    ))
    conn.commit()
    conn.close()
