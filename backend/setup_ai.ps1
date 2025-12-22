
# AI Setup Wizard for Haseeb Project

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   AI CHATBOT SETUP WIZARD (FIXED)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Installing AI Library..." -ForegroundColor Yellow
# Using python -m pip to avoid path issues
python -m pip install google-generativeai --quiet
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Python is not found or pip failed." -ForegroundColor Red
    exit
}
Write-Host "   Success! Library installed." -ForegroundColor Green
Write-Host ""

Write-Host "2. API KEY SETUP" -ForegroundColor Yellow
Write-Host "   Please get your key from: https://aistudio.google.com/app/apikey" -ForegroundColor White
Write-Host ""

$key = Read-Host "3. PASTE YOUR API KEY HERE and press Enter"

if ([string]::IsNullOrWhiteSpace($key)) {
    Write-Host "Error: No key provided." -ForegroundColor Red
    exit
}

$env:GEMINI_API_KEY = $key.Trim()
Write-Host ""
Write-Host "4. Starting Backend Server..." -ForegroundColor Green

# Using python -m uvicorn
# Fix for ModuleNotFoundError: Ensure current directory is in PYTHONPATH
$env:PYTHONPATH = "$PWD;$env:PYTHONPATH"
python -m uvicorn main:app --reload
