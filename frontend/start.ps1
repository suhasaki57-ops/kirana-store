$env:PATH = 'C:\Program Files\nodejs\;' + $env:PATH
Set-Location 'c:\Users\admin\OneDrive\Desktop\New folder (2)\frontend'
Write-Host '>>> Starting frontend...' -ForegroundColor Cyan
Write-Host '    Website  → http://localhost:3000' -ForegroundColor Green
Write-Host '    Admin    → http://localhost:3000/admin' -ForegroundColor Green
& '.\node_modules\.bin\next.cmd' dev
