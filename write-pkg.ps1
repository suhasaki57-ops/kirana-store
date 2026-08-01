$pkg = @{
  name = "backend"
  version = "1.0.0"
  description = "E-commerce platform backend API"
  main = "dist/server.js"
  scripts = @{
    dev   = "nodemon --exec ts-node src/server.ts"
    build = "tsc"
    start = "node dist/server.js"
    seed  = "ts-node src/utils/seeders/index.ts"
  }
  keywords = @("ecommerce","api","express","typescript","mongodb")
  author = "E-commerce Platform Team"
  license = "MIT"
  dependencies = @{
    "bcryptjs"                 = "^2.4.3"
    "cloudinary"               = "^1.41.0"
    "compression"              = "^1.7.4"
    "cookie-parser"            = "^1.4.6"
    "cors"                     = "^2.8.5"
    "dotenv"                   = "^16.3.1"
    "express"                  = "^4.18.2"
    "express-mongo-sanitize"   = "^2.2.0"
    "express-rate-limit"       = "^7.1.5"
    "express-validator"        = "^7.0.1"
    "helmet"                   = "^7.1.0"
    "jsonwebtoken"             = "^9.0.2"
    "mongodb-memory-server"    = "^11.2.0"
    "mongoose"                 = "^8.0.3"
    "morgan"                   = "^1.10.0"
    "multer"                   = "^1.4.5-lts.1"
    "nodemailer"               = "^6.9.7"
    "razorpay"                 = "^2.9.2"
    "slugify"                  = "^1.6.6"
    "stripe"                   = "^14.9.0"
    "uuid"                     = "^9.0.1"
    "winston"                  = "^3.11.0"
    "@types/bcryptjs"          = "^2.4.6"
    "@types/compression"       = "^1.7.5"
    "@types/cookie-parser"     = "^1.4.6"
    "@types/cors"              = "^2.8.17"
    "@types/express"           = "^4.17.21"
    "@types/jsonwebtoken"      = "^9.0.5"
    "@types/morgan"            = "^1.9.9"
    "@types/multer"            = "^1.4.11"
    "@types/node"              = "^20.10.6"
    "@types/nodemailer"        = "^6.4.14"
    "@types/uuid"              = "^9.0.7"
    "nodemon"                  = "^3.0.2"
    "ts-node"                  = "^10.9.2"
    "typescript"               = "^5.3.3"
  }
  devDependencies = @{}
  engines = @{
    node = "20.x"
    npm  = ">=9.0.0"
  }
}

$json = $pkg | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText('c:\Users\admin\OneDrive\Desktop\New folder (2)\backend\package.json', $json, [System.Text.Encoding]::UTF8)
Write-Host "Done. devDependencies empty: $((Get-Content 'c:\Users\admin\OneDrive\Desktop\New folder (2)\backend\package.json' | Select-String '"devDependencies"') -ne $null)"
