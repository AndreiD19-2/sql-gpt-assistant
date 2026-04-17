# config.py
import os
from dotenv import load_dotenv

# Încarcă variabilele din fișierul .env
load_dotenv()

# Cheia OpenAI și conexiunea la SQL Server
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SQLSERVER_CONN_STR = os.getenv("SQLSERVER_CONN_STR")
SQLSERVER_CONN_STR_APP = os.getenv("SQLSERVER_CONN_STR_APP")