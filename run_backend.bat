@echo off
echo Starting Backend...
REM We stay in the root directory so 'backend' is treated as a package
REM This fixes the "attempted relative import" error
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
pause
