# Troubleshooting Guide

## Common Issues and Solutions

### Build Errors

#### TypeScript Compilation Errors

**Issue**: `Cannot find name 'Request'` in types/index.ts

**Solution**: Already fixed. The file now imports `Request` from `express`.

---

**Issue**: `Property 'updateRating' does not exist on type 'IProduct'`

**Solution**: Already fixed. Added method signature to interface and implementation to model.

---

**Issue**: `Property 'isValid' does not exist on type 'ICoupon'`

**Solution**: Already fixed. Added method signature and implementation.

---

#### Module Not Found Errors

**Issue**: `Cannot find module 'tailwindcss-animate'`

**Solution**: Install dependencies:
```bash
cd frontend
npm install
```

---

### Runtime Errors

#### Stripe Webhook Errors

**Issue**: `Webhook Error: No signatures found matching the expected signature`

**Solution**: 
1. Ensure webhook route is registered BEFORE `express.json()` (already done in app.ts)
2. Use `express.raw()` for the webhook endpoint (already configured)
3. Set correct `STRIPE_WEBHOOK_SECRET` in .env

---

**Issue**: Stripe webhook receives parsed JSON instead of raw body

**Solution**: Already fixed — webhook is now registered at top of app.ts with raw body parser.

---

#### MongoDB Connection Errors

**Issue**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution**:
1. Check `MONGODB_URI` in `.env`
2. Ensure MongoDB Atlas IP whitelist includes your IP
3. Verify database user credentials

---

**Issue**: `MONGODB_URI environment variable is not defined`

**Solution**: Create `backend/.env` with proper connection string.

---

#### Authentication Errors

**Issue**: `Invalid or expired token`

**Solution**:
1. Check `JWT_SECRET` is set in `.env`
2. Clear browser cookies
3. Log in again to get fresh token

---

#### Cart Item Updates Fail

**Issue**: `Cart item not found` when trying to update

**Solution**: Already fixed — controller now properly finds items by subdocument `_id`.

---

### Development Issues

#### Port Already in Use

**Issue**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solution**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

---

#### CORS Errors

**Issue**: `Access to fetch has been blocked by CORS policy`

**Solution**:
1. Check `CORS_ORIGIN` in backend `.env` matches frontend URL
2. Ensure both servers are running
3. Verify corsOptions in `app.ts` includes your frontend URL

---

#### Email Not Sending

**Issue**: Emails fail to send

**Solution**:
1. Use Gmail App Password (not regular password)
2. Enable 2FA on Google Account
3. Check SMTP settings in `.env`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   ```

---

### Payment Integration Issues

#### Razorpay Order Creation Fails

**Issue**: `Error: Invalid api key or secret`

**Solution**:
1. Use Razorpay **Test Mode** keys for development
2. Verify keys in `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   ```

---

#### Stripe Checkout Redirect Fails

**Issue**: Stripe checkout created but redirect doesn't work

**Solution**:
1. Check `FRONTEND_URL` is correctly set
2. Verify success/cancel URLs are accessible
3. Ensure Stripe publishable key is in frontend `.env.local`

---

### Database Seeding Issues

**Issue**: `Seeding failed: ValidationError`

**Solution**:
1. Ensure MongoDB is connected
2. Drop existing data if needed:
   ```bash
   # MongoDB shell
   use ecommerce
   db.dropDatabase()
   ```
3. Run seed again:
   ```bash
   cd backend
   npm run seed
   ```

---

### Frontend Build Issues

#### Next.js Build Fails

**Issue**: `Module not found: Can't resolve '@/...'`

**Solution**: Check `tsconfig.json` has correct path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

**Issue**: `Error: Image optimization error`

**Solution**: Install sharp:
```bash
cd frontend
npm install sharp
```

---

### Windows-Specific Issues

#### Long Path Errors

**Issue**: `ENAMETOOLONG: name too long`

**Solution**: 
1. Move project to shorter path (e.g., `C:\projects\ecom`)
2. Or enable long paths:
   ```powershell
   # Run as Administrator
   New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
   ```

---

#### Permission Denied Errors

**Issue**: `EPERM: operation not permitted`

**Solution**:
1. Close VS Code and any terminals
2. Run as Administrator
3. Or disable antivirus temporarily during npm install

---

### Production Deployment Issues

#### Environment Variables Not Loading

**Issue**: App crashes in production with missing env vars

**Solution**:
1. Set all environment variables in hosting platform
2. Don't rely on `.env` files in production
3. Use platform-specific variable management (Vercel, Railway, etc.)

---

#### Database Connection Timeout

**Issue**: `MongooseServerSelectionError` in production

**Solution**:
1. Whitelist `0.0.0.0/0` in MongoDB Atlas (or specific hosting IPs)
2. Check connection string format
3. Increase `serverSelectionTimeoutMS` if needed

---

## Quick Fixes Checklist

Before asking for help, try these:

- [ ] Ran `npm install` in root, backend, and frontend
- [ ] Created `.env` files with all required variables
- [ ] MongoDB Atlas IP is whitelisted
- [ ] Both frontend and backend servers are running
- [ ] Cleared browser cache and cookies
- [ ] Checked console for detailed error messages
- [ ] Tried with test/demo credentials
- [ ] Verified API endpoint URLs are correct

---

## Getting Help

If issues persist:

1. **Check logs**:
   - Backend: `backend/logs/combined.log`
   - Backend errors: `backend/logs/error.log`
   - Browser console for frontend issues

2. **Enable debug mode**:
   ```env
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

3. **Test API directly**:
   ```bash
   # Test health endpoint
   curl http://localhost:5000/health
   
   # Test with auth
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/v1/auth/me
   ```

4. **Check database**:
   - Use MongoDB Compass or Atlas web interface
   - Verify collections exist and have data
   - Check indexes are created

---

## Useful Commands

```bash
# Check if ports are in use (Windows)
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Kill process by PID (Windows)
taskkill /PID <PID> /F

# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# TypeScript check without building
npm run type-check

# View logs (backend)
tail -f backend/logs/combined.log

# Test MongoDB connection
mongosh "your-connection-string"
```

---

## Platform-Specific Notes

### Vercel (Frontend)
- Automatically installs dependencies
- Set env vars in project settings
- Build command: `npm run build`
- Output directory: `.next`

### Railway/Render (Backend)
- Set all env vars in dashboard
- Ensure MongoDB URI is production-ready
- Set `NODE_ENV=production`
- Health check: `/health`

### MongoDB Atlas
- Free tier: M0 (512MB)
- Backup: Automatic for paid tiers
- IP Whitelist: Required for connections
- Connection string format: `mongodb+srv://...`

---

## Performance Tips

1. **Enable caching**: Use Redis for sessions and cache
2. **Optimize images**: Use WebP format, lazy loading
3. **Database indexes**: Already configured in models
4. **CDN**: Use Cloudinary for images (already integrated)
5. **Compression**: Already enabled in app.ts

---

## Security Checklist for Production

- [ ] Change default admin credentials
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure CORS properly (don't use '*')
- [ ] Rate limit API endpoints (already configured)
- [ ] Keep dependencies updated
- [ ] Enable MongoDB Atlas network security
- [ ] Use environment variables for all secrets
- [ ] Set up error monitoring (Sentry, etc.)

---

**Need more help?** Check:
- `README.md` - Project overview
- `INSTALLATION.md` - Detailed setup guide
- `API.md` - API documentation
- `PROJECT_SUMMARY.md` - Complete feature list
- `FIXES_APPLIED.md` - What was fixed and why
