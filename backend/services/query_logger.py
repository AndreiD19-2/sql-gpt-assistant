def log_query(user_input, mode, sql, result, status, message=None, is_favorite=False):
    try:
        conn = pyodbc.connect(SQLSERVER_CONN_STR)
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO query_history (user_input, detected_mode, generated_sql, execution_result, status, message, is_favorite)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_input, mode, sql, result, status, message or "", int(is_favorite)))

        conn.commit()
        conn.close()
    except Exception as e:
        print("Logging failed:", e)
