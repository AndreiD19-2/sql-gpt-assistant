# services/query_orchestrator.py

import httpx

# Clasifică tipul de query pe baza limbajului natural
def classify_intent(user_query: str) -> str:
    query = user_query.lower()
    if any(word in query for word in ["creează", "create", "tabel", "table"]):
        return "ddl"
    if any(word in query for word in ["inserează", "insert", "adauga"]):
        return "insert-smart"
    if any(word in query for word in ["editeaza","actualizează", "update", "modifică"]):
        return "update-smart"
    if any(word in query for word in ["șterge", "delete", "elimină"]):
        return "delete-smart"
    return "ask"  # fallback la SELECT

# Trimite cererea către endpoint-ul GPT corespunzător
async def route_to_gpt_api(intent: str, user_query: str, base_url: str):
    url = f"{base_url}/{intent}"
    async with httpx.AsyncClient() as client:
        response = await client.post(url, json={"query": user_query})
        return response.json()

# Pas 2: Generare prompt + apel OpenAI GPT
async def generate_sql_from_gpt(mode: str, user_query: str) -> str:
    prompt = generate_prompt_with_schema(mode, user_query)

    openai_key = os.getenv("OPENAI_API_KEY")
    if not openai_key:
        raise ValueError("OPENAI_API_KEY missing")

    payload = {
        "model": "gpt-4.1-nano",
        "messages": [
            {"role": "system", "content": "You are a helpful SQL assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    headers = {
        "Authorization": f"Bearer {openai_key}"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
        response.raise_for_status()
        result = response.json()
        return result["choices"][0]["message"]["content"]