# Fix PATH for current session
$env:PATH = "C:\Program Files\nodejs\" + ";" + $env:PATH

Set-Location "c:\Users\admin\OneDrive\Desktop\New folder (2)"

Write-Host "=== Node version ===" -ForegroundColor Cyan
node --version

Write-Host "=== npm version ===" -ForegroundColor Cyan
npm --version

Write-Host "`n=== Installing root dependencies ===" -ForegroundColor Yellow
npm install

Write-Host "`n=== Installing backend dependencies ===" -ForegroundColor Yellow
Set-Location backend
npm install

Write-Host "`n=== Installing frontend dependencies ===" -ForegroundColor Yellow
Set-Location "..\frontend"
npm install

Write-Host "`n=== All dependencies installed! ===" -ForegroundColor Green
Set-Location ".."
