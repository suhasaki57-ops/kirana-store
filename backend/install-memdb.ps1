$env:PATH = 'C:\Program Files\nodejs\;' + $env:PATH
Set-Location 'c:\Users\admin\OneDrive\Desktop\New folder (2)\backend'
Write-Host '>>> Installing mongodb-memory-server...' -ForegroundColor Yellow
& 'C:\Program Files\nodejs\npm.cmd' install --prefix . mongodb-memory-server@latest --install-strategy=nested
Write-Host '>>> DONE' -ForegroundColor Green
