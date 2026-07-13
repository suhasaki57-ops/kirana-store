$env:PATH = 'C:\Program Files\nodejs\;' + $env:PATH
Set-Location 'c:\Users\admin\OneDrive\Desktop\New folder (2)\backend'
Write-Host '>>> Starting backend server...' -ForegroundColor Cyan
Write-Host '    API  → http://localhost:5000' -ForegroundColor Green
Write-Host '    Health → http://localhost:5000/health' -ForegroundColor Green
& '.\node_modules\.bin\nodemon.cmd' --exec '.\node_modules\.bin\ts-node.cmd' src/server.ts
