# Fix PATH for current session
$env:PATH = "C:\Program Files\nodejs\" + ";" + $env:PATH

Set-Location "c:\Users\admin\OneDrive\Desktop\New folder (2)\backend"

Write-Host "=== Seeding Database ===" -ForegroundColor Yellow
npm run seed

Write-Host "`n=== Done! ===" -ForegroundColor Green
Set-Location ".."
