from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import subprocess
import ollama
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS so the UI can call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Auto-detect installed models
# -------------------------------
@app.get("/models")
def list_models():
    try:
        result = subprocess.run(
            ["ollama", "list"],
            capture_output=True,
            text=True
        )

        lines = result.stdout.strip().split("\n")[1:]  # skip header

        models = []
        for line in lines:
            parts = line.split()
            if len(parts) >= 1:
                models.append(parts[0])

        return {"models": models}

    except Exception as e:
        return {"error": str(e)}

# -------------------------------
# Chat endpoint (streaming + memory)
# -------------------------------
@app.post("/chat")
async def chat(request: Request):
    body = await request.json()

    messages = body.get("messages", [])
    model = body.get("model", "")

    def stream():
        for chunk in ollama.chat(
            model=model,
            messages=messages,
            stream=True
        ):
            yield chunk["message"]["content"]

    return StreamingResponse(stream(), media_type="text/plain")
