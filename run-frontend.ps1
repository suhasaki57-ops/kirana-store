# Fix PATH for current session
$env:PATH = "C:\Program Files\nodejs\" + ";" + $env:PATH

Set-Location "c:\Users\admin\OneDrive\Desktop\New folder (2)\frontend"

Write-Host "=== Starting Frontend Server ===" -ForegroundColor Cyan
Write-Host "Website will run at http://localhost:3000" -ForegroundColor Green
npm run dev
