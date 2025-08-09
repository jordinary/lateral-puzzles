# 🔧 Troubleshooting Guide

## 502 Bad Gateway Error

If you're getting a 502 Bad Gateway error, follow these steps:

### 1. Check Environment Variables

Make sure these are set in your Render dashboard:

**Required:**
```bash
NODE_ENV=production
DATABASE_URL=your-postgresql-url
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://lateral-puzzles.onrender.com
```

**Optional:**
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
```

### 2. Check Database Connection

1. **Verify DATABASE_URL is correct**
2. **Ensure database is accessible** from Render's servers
3. **Check if database exists** and is running

### 3. Check Render Logs

1. Go to your Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for error messages

### 4. Test Health Check

Visit: `https://lateral-puzzles.onrender.com/api/health`

This will show you:
- Database connection status
- Environment variables status
- Any startup errors

### 5. Common Issues

#### Missing DATABASE_URL
```
Error: DATABASE_URL is not set
```
**Solution:** Set the DATABASE_URL environment variable in Render

#### Database Connection Failed
```
Error: connect ECONNREFUSED
```
**Solution:** Check your database URL and ensure the database is running

#### Missing NEXTAUTH_SECRET
```
Error: NEXTAUTH_SECRET is not set
```
**Solution:** Generate a secret using `npm run generate:secret` and set it in Render

#### Prisma Migration Failed
```
Error: P1001: Can't reach database server
```
**Solution:** Check database URL and network connectivity

### 6. Manual Database Setup

If you need to set up the database manually:

1. **Connect to your database** (PostgreSQL)
2. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
3. **Seed the database:**
   ```bash
   npx prisma db seed
   ```

### 7. Debugging Steps

1. **Check build logs** for compilation errors
2. **Check runtime logs** for startup errors
3. **Test database connection** manually
4. **Verify all environment variables** are set
5. **Check if the port is correct** (Render uses PORT environment variable)

### 8. Getting Help

If you're still having issues:

1. **Check the health endpoint:** `/api/health`
2. **Review Render logs** for specific error messages
3. **Verify environment variables** are correctly set
4. **Test database connection** from Render's servers

## Quick Fixes

### Reset Environment Variables
1. Go to Render dashboard
2. Click on your service
3. Go to "Environment" tab
4. Verify all required variables are set
5. Redeploy the service

### Force Redeploy
1. Go to Render dashboard
2. Click "Manual Deploy"
3. Select "Clear build cache & deploy"

### Check Database
1. Test your DATABASE_URL locally
2. Ensure the database is accessible
3. Verify the database exists and has the correct schema
