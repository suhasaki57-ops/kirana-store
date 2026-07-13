# ─────────────────────────────────────────────────────────────
#  Kirana Store - Push to GitHub Script
#  Run this after creating your GitHub repository
# ─────────────────────────────────────────────────────────────

$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User")

Set-Location "c:\Users\admin\OneDrive\Desktop\New folder (2)"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Kirana Store - GitHub Push" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Ask for GitHub repo URL
Write-Host "Enter your GitHub repository URL." -ForegroundColor Yellow
Write-Host "Example: https://github.com/yourusername/kirana-store.git" -ForegroundColor Gray
Write-Host ""
$repoUrl = Read-Host "GitHub repo URL"

if (-not $repoUrl) {
    Write-Host "No URL provided. Exiting." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Setting up git and pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

# Remove existing remote if exists
git remote remove origin 2>$null

# Add files (exclude sensitive files)
git add .

# Check if there are changes to commit
$status = git status --porcelain
if ($status) {
    git commit -m "Kirana Store - Complete E-commerce App with Admin Dashboard"
    Write-Host "Committed changes." -ForegroundColor Green
} else {
    Write-Host "Nothing new to commit." -ForegroundColor Yellow
}

# Add remote and push
git remote add origin $repoUrl
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS! Code pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repo: $repoUrl" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Yellow
    Write-Host "  1. Deploy Backend  -> https://render.com" -ForegroundColor White
    Write-Host "  2. Deploy Frontend -> https://vercel.com" -ForegroundColor White
    Write-Host "  3. Read guide: DEPLOY_GUIDE.md" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Push failed. Check your GitHub credentials." -ForegroundColor Red
    Write-Host "Make sure you have a Personal Access Token from:" -ForegroundColor Yellow
    Write-Host "  GitHub -> Settings -> Developer settings -> Personal access tokens" -ForegroundColor White
}

Read-Host "Press Enter to exit"
