# E-Commerce Platform - Automated Setup Script
# Run this AFTER installing Node.js
# Usage: Right-click -> "Run with PowerShell"
#        OR in PowerShell: .\setup.ps1

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  E-Commerce Platform Setup" -ForegroundColor Cyan  
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# ─── Check Node.js ───────────────────────────────────────────────────────────
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install from: https://nodejs.org/dist/v20.20.0/node-v20.20.0-x64.msi" -ForegroundColor Yellow
    Write-Host "   Then restart PowerShell and run this script again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# ─── Check npm ───────────────────────────────────────────────────────────────
try {
    $npmVersion = npm --version 2>&1
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found! Reinstall Node.js." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# ─── Check .env file ─────────────────────────────────────────────────────────
$envFile = ".\backend\.env"
if (!(Test-Path $envFile)) {
    Write-Host "❌ backend\.env not found!" -ForegroundColor Red
    Write-Host "   Create it from .env.example" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if MONGODB_URI is set to a placeholder
$envContent = Get-Content $envFile -Raw
if ($envContent -match "cluster0\.xxxxx") {
    Write-Host ""
    Write-Host "⚠️  WARNING: MONGODB_URI still has placeholder value!" -ForegroundColor Yellow
    Write-Host "   Open backend\.env and replace MONGODB_URI with your MongoDB Atlas connection string." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/N)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        exit 1
    }
}

Write-Host "✅ .env file found" -ForegroundColor Green
Write-Host ""

# ─── Install root dependencies ────────────────────────────────────────────────
Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Root npm install failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Root dependencies installed" -ForegroundColor Green
Write-Host ""

# ─── Install backend dependencies ─────────────────────────────────────────────
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend npm install failed!" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Write-Host ""

# ─── Install frontend dependencies ────────────────────────────────────────────
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ..\frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend npm install failed!" -ForegroundColor Red
    Set-Location ..
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Write-Host ""

Set-Location ..

# ─── Ask to seed database ─────────────────────────────────────────────────────
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Database Seeding" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This will create:" -ForegroundColor White
Write-Host "  - Admin user (admin@ecommerce.com / Admin@123456)" -ForegroundColor White
Write-Host "  - Test user (user@test.com / User@123456)" -ForegroundColor White
Write-Host "  - 3 Categories (Electronics, Fashion, Home)" -ForegroundColor White
Write-Host "  - 6 Sample Products with images" -ForegroundColor White
Write-Host ""

$seedDb = Read-Host "Seed the database now? (Y/n)"
if ($seedDb -ne "n" -and $seedDb -ne "N") {
    Write-Host ""
    Write-Host "Seeding database..." -ForegroundColor Yellow
    Set-Location backend
    npm run seed
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database seeded successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "❌ Seeding failed - check MONGODB_URI in backend\.env" -ForegroundColor Red
        Write-Host "   You can run it later with: cd backend && npm run seed" -ForegroundColor Yellow
    }
    Set-Location ..
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application, run:" -ForegroundColor White
Write-Host ""
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then open:" -ForegroundColor White
Write-Host "   Frontend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "   Admin:     http://localhost:3000/admin" -ForegroundColor Cyan
Write-Host "   API:       http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Admin Login:" -ForegroundColor White
Write-Host "   Email:    admin@ecommerce.com" -ForegroundColor Cyan
Write-Host "   Password: Admin@123456" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test User Login:" -ForegroundColor White
Write-Host "   Email:    user@test.com" -ForegroundColor Cyan
Write-Host "   Password: User@123456" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
