$env:PATH = 'C:\Program Files\nodejs\;' + $env:PATH
Set-Location 'c:\Users\admin\OneDrive\Desktop\New folder (2)\backend'
Write-Host '>>> Seeding database...' -ForegroundColor Yellow
& '.\node_modules\.bin\ts-node.cmd' src/utils/seeders/index.ts
Write-Host '>>> Seed complete' -ForegroundColor Green
