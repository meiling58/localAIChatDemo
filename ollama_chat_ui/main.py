from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import subprocess
import ollama
import os

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Serve static files
app.mount("/static", StaticFiles(directory=BASE_DIR), name="static")

# ================================
# Personality Definitions
# ================================
PERSONALITIES = {
    "junior": (
        "You are a junior automation tester. You write simple scripts, ask clarifying questions, "
        "and focus on learning best practices. You explain concepts in a beginner-friendly way."
    ),
    "mid": (
        "You are a mid-level QA engineer. You can design test cases, write stable automation scripts, "
        "and troubleshoot common issues. You follow established patterns and explain your reasoning."
    ),
    "senior": (
        "You are a senior automation engineer with deep experience in Python, Robot Framework, API testing, "
        "and web UI automation. You write clean, scalable code and provide best practices."
    ),
    "architect": (
        "You are a test automation architect. You design large-scale automation frameworks, CI/CD pipelines, "
        "cloud execution strategies, and maintainable test architectures."
    ),
    "api": (
        "You are an API testing expert specializing in Python, Postman, REST, GraphQL, and automation frameworks. "
        "You provide optimized API test strategies and code examples."
    ),
    "robot": (
        "You are a Robot Framework expert. You design keyword-driven frameworks, libraries, resource files, "
        "and scalable test suites with best practices."
    ),
    "web": (
        "You are a web UI automation specialist with deep knowledge of Selenium, Playwright, POM, and handling "
        "flaky tests. You write robust, maintainable UI automation."
    ),
    "cloud": (
        "You are a cloud-based test automation architect. You design distributed test execution on AWS/Azure/GCP, "
        "containerized test runners, and scalable infrastructure."
    ),
}

# ================================
# UI Routes
# ================================
@app.get("/", response_class=HTMLResponse)
def serve_basic_ui():
    return FileResponse(os.path.join(BASE_DIR, "index.html"))

@app.get("/qa", response_class=HTMLResponse)
def serve_qa_ui():
    return FileResponse(os.path.join(BASE_DIR, "qa_index.html"))

# ================================
# List installed models
# ================================
@app.get("/models")
def list_models():
    try:
        result = subprocess.run(
            ["ollama", "list"],
            capture_output=True,
            text=True
        )

        lines = result.stdout.strip().split("\n")[1:]
        models = [line.split()[0] for line in lines if line.strip()]
        return {"models": models}

    except Exception as e:
        return {"error": str(e)}

# ================================
# Chat Endpoint (with personality)
# ================================
@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    messages = body.get("messages", [])
    model = body.get("model", "")
    personality_key = body.get("personality", "senior")

    # Get system prompt
    system_prompt = PERSONALITIES.get(personality_key, PERSONALITIES["senior"])

    # Insert system message at the beginning
    messages.insert(0, {
        "role": "system",
        "content": system_prompt
    })

    # Streaming response
    def stream():
        for chunk in ollama.chat(
            model=model,
            messages=messages,
            stream=True
        ):
            yield chunk["message"]["content"]

    return StreamingResponse(stream(), media_type="text/plain")
