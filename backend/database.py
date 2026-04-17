
import pyodbc
from config import SQLSERVER_CONN_STR
from contextlib import contextmanager

@contextmanager
def get_db_cursor():
    """
    Context manager pentru cursor de SQL Server (auto-close connection).
    """
    conn = pyodbc.connect(SQLSERVER_CONN_STR)
    try:
        cursor = conn.cursor()
        yield cursor
        conn.commit()
    finally:
        conn.close()
