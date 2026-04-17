# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import ask, ddl, explain, history
from routes import data
from routes import insert_gpt
from routes import insert_smart, procedure_router, trigger_router, dictionary_routes
from routes import update_smart, delete_smart, execute_sql, orchestrator_router
from routes import transaction_router, advanced_router
from routes import auth_router, register_router



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Înregistrăm rutele principale
app.include_router(ask.router)
app.include_router(ddl.router)
app.include_router(explain.router)
app.include_router(history.router)
app.include_router(data.router)
app.include_router(insert_gpt.router)
app.include_router(insert_smart.router)
app.include_router(update_smart.router)
app.include_router(delete_smart.router)
app.include_router(execute_sql.router)
app.include_router(orchestrator_router.router)
app.include_router(procedure_router.router)
app.include_router(trigger_router.router)
app.include_router(dictionary_routes.router)
app.include_router(transaction_router.router)
app.include_router(advanced_router.router)
app.include_router(auth_router.router)
app.include_router(register_router.router)




@app.get("/")
def root():
    return {"message": "SQL Assistant GPT API is running"}