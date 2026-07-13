# Fix PATH for current session
$env:PATH = "C:\Program Files\nodejs\" + ";" + $env:PATH

Set-Location "c:\Users\admin\OneDrive\Desktop\New folder (2)\backend"

Write-Host "=== Starting Backend Server ===" -ForegroundColor Cyan
Write-Host "API will run at http://localhost:5000" -ForegroundColor Green
npm run dev
