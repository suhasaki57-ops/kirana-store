# How to Deploy Kirana Store on Render
# (Both Frontend and Backend — Free Tier)

GitHub Repo: https://github.com/suhasaki57-ops/kirana-store

=======================================================
BEFORE YOU START — Set Up MongoDB Atlas (Free Database)
=======================================================

1. Go to https://mongodb.com/atlas and create a free account

2. Create a cluster:
   - Click "Build a Database"
   - Choose M0 FREE
   - Cloud: AWS | Region: Mumbai (ap-south-1)
   - Click Create

3. Create a database user:
   - Left menu → Database Access → Add New Database User
   - Username: kiranauser
   - Password: Click "Autogenerate" → COPY AND SAVE THE PASSWORD
   - Role: Atlas Admin
   - Click Add User

4. Allow all IP addresses:
   - Left menu → Network Access → Add IP Address
   - Click "Allow Access from Anywhere" → 0.0.0.0/0
   - Click Confirm

5. Get your connection string:
   - Left menu → Database → Connect
   - Choose "Connect your application"
   - Copy the URI (it looks like this):
     mongodb+srv://kiranauser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   - Add /ecommerce before the question mark:
     mongodb+srv://kiranauser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
   - SAVE THIS URI — you will paste it in Render

=======================================================
STEP 1 — Sign Up on Render
=======================================================

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up using your GitHub account
4. Authorize Render to access your repositories

=======================================================
STEP 2 — Deploy the Backend API
=======================================================

1. On Render Dashboard → Click "New +" → "Web Service"

2. Connect your GitHub repo → Select "kirana-store"

3. Fill in these exact settings:
   Name:           kirana-store-api
   Region:         Singapore
   Branch:         main
   Root Directory: backend
   Runtime:        Node
   Build Command:  npm install && npm run build
   Start Command:  npm start

4. Click "Advanced" → "Add Environment Variable"
   Add each of these variables:

   NODE_ENV                  = production
   MONGODB_URI               = (paste your MongoDB Atlas URI from above)
   JWT_SECRET                = kirana-jwt-secret-2024-minimum-32-characters
   JWT_REFRESH_SECRET        = kirana-refresh-secret-2024-minimum-32-chars
   JWT_EXPIRE                = 15m
   JWT_REFRESH_EXPIRE        = 7d
   FRONTEND_URL              = https://kirana-store-frontend.onrender.com
   CORS_ORIGIN               = https://kirana-store-frontend.onrender.com
   ADMIN_EMAIL               = admin@kiranastore.com
   ADMIN_PASSWORD            = Admin@123456
   SESSION_SECRET            = kirana-session-secret-2024-minimum-32-chars
   RATE_LIMIT_WINDOW_MS      = 900000
   RATE_LIMIT_MAX_REQUESTS   = 100

5. Click "Create Web Service"

6. Wait 5-7 minutes for build to complete

7. Test your backend — open this URL in browser:
   https://kirana-store-api.onrender.com/health
   You should see: {"success":true,"message":"Server is healthy"}

8. SEED THE DATABASE (important!):
   - In Render dashboard → kirana-store-api → click "Shell" tab
   - Type this command: npm run seed
   - Press Enter
   - Wait for: "KIRANA STORE SEEDING COMPLETED!"
   - This creates 16 products, 6 categories, and admin account

=======================================================
STEP 3 — Deploy the Frontend
=======================================================

1. On Render Dashboard → Click "New +" → "Web Service"

2. Connect GitHub → Select "kirana-store" (same repo)

3. Fill in these exact settings:
   Name:           kirana-store-frontend
   Region:         Singapore
   Branch:         main
   Root Directory: frontend
   Runtime:        Node
   Build Command:  npm install && npm run build
   Start Command:  npm start

4. Click "Advanced" → "Add Environment Variable"
   Add these variables:

   NODE_ENV                  = production
   NEXT_PUBLIC_API_URL       = https://kirana-store-api.onrender.com/api/v1
   NEXT_PUBLIC_FRONTEND_URL  = https://kirana-store-frontend.onrender.com

5. Click "Create Web Service"

6. Wait 8-10 minutes (Next.js takes longer to build)

7. Your website is live at:
   https://kirana-store-frontend.onrender.com

=======================================================
STEP 4 — Update CORS After Frontend is Live
=======================================================

After frontend is deployed, update backend settings:

1. Render Dashboard → kirana-store-api → Environment tab
2. Update these two values to match your actual frontend URL:
   FRONTEND_URL = https://kirana-store-frontend.onrender.com
   CORS_ORIGIN  = https://kirana-store-frontend.onrender.com
3. Click "Save Changes"
4. Service restarts automatically — takes about 1 minute

=======================================================
YOUR LIVE WEBSITE
=======================================================

Homepage:    https://kirana-store-frontend.onrender.com
Products:    https://kirana-store-frontend.onrender.com/products
Cart:        https://kirana-store-frontend.onrender.com/cart
Checkout:    https://kirana-store-frontend.onrender.com/checkout
Orders:      https://kirana-store-frontend.onrender.com/orders
Admin:       https://kirana-store-frontend.onrender.com/admin
API Health:  https://kirana-store-api.onrender.com/health

-------------------------------------------------------
LOGIN CREDENTIALS
-------------------------------------------------------
Admin:    admin@kiranastore.com  /  Admin@123456
Customer: user@test.com          /  User@123456

-------------------------------------------------------
COUPON CODES
-------------------------------------------------------
KIRANA10  = 10% off on orders above Rs.200
SAVE50    = Rs.50 off on orders above Rs.500
NAYA100   = Rs.100 off on orders above Rs.999

=======================================================
COMMON PROBLEMS AND SOLUTIONS
=======================================================

Problem: Products don't show on website
Solution: Check NEXT_PUBLIC_API_URL is set correctly in frontend

Problem: Login not working
Solution: Make sure you ran "npm run seed" in backend Shell tab

Problem: Build fails with TypeScript error
Solution: Check Render build logs, usually a missing env variable

Problem: CORS error in browser
Solution: Update CORS_ORIGIN in backend to match your frontend URL exactly

Problem: Website loads very slowly (first visit takes 30-60 seconds)
Solution: This is normal on Render free tier (service sleeps after 15 min)
Fix: Sign up free at https://uptimerobot.com
     Add a monitor for: https://kirana-store-api.onrender.com/health
     Set check interval to 14 minutes
     This keeps your service always awake

Problem: MongoDB connection fails
Solution: Check MONGODB_URI is correct
          Make sure MongoDB Atlas Network Access has 0.0.0.0/0
          Make sure the password in the URI is correct (no special chars)

=======================================================
