$env:PATH = 'C:\Program Files\nodejs\;' + $env:PATH
$routesDir = 'c:\Users\admin\OneDrive\Desktop\New folder (2)\backend\src\routes'
$files = Get-ChildItem "$routesDir\*.ts"
foreach ($f in $files) {
    $txt = [System.IO.File]::ReadAllText($f.FullName)
    $txt = $txt -replace 'const router = Router\(\);', 'const router: Router = Router();'
    [System.IO.File]::WriteAllText($f.FullName, $txt)
    Write-Host "Fixed: $($f.Name)"
}
Write-Host "All routes fixed"
