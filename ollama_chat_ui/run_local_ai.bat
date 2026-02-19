@echo off
title Local AI Chat (Ollama + FastAPI)

echo ============================================
echo   Starting Local AI Chat Environment...
echo   Folder: D:\llama\ollama_chat_ui\
echo ============================================
echo.

echo Changing directory to project folder...
cd /d D:\github\meiling58\localaichatdemo\ollama_chat_ui\
echo Starting Ollama service...
start "" ollama serve

echo Waiting for Ollama to initialize...
timeout /t 3 >nul

echo Starting FastAPI backend...
start "" python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

echo Waiting for backend to start...
timeout /t 2 >nul

echo Opening Chat UI in browser...
start "" http://127.0.0.1:8000

echo.
echo ============================================
echo   Everything is running. Enjoy your AI!
echo   Close this window to stop all services.
echo ============================================
echo.

pause
