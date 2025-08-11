# 🚀 Deployment Guide for Render

This guide will help you deploy your lateral puzzles app to Render.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Your code should be pushed to GitHub
3. **Google Cloud Console**: For OAuth (optional)
4. **Database**: PostgreSQL (recommended for production)

## 🔧 Step 1: Database Setup

### Option A: Use Render's PostgreSQL (Recommended)
1. Go to your Render dashboard
2. Click "New" → "PostgreSQL"
3. Choose a name (e.g., "lateral-puzzles-db")
4. Select "Free" plan
5. Click "Create Database"
6. Copy the "External Database URL"

### Option B: Use External Database
- [Supabase](https://supabase.com) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)
- [Railway](https://railway.app) (Free tier available)

## 🔧 Step 2: Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Add authorized redirect URIs:
   ```
   https://your-app-name.onrender.com/api/auth/callback/google
   ```
6. Copy Client ID and Client Secret

## 🔧 Step 3: Email Service Setup (Optional)

1. Sign up at [Resend](https://resend.com)
2. Get your API key from dashboard
3. Verify your domain or use their test domain

## 🔧 Step 4: Deploy to Render

### Method A: Using render.yaml (Recommended)
1. Push your code to GitHub (including the `render.yaml` file)
2. Go to Render dashboard
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect the configuration

### Method B: Manual Setup
1. Go to Render dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `lateral-puzzles`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm start`

## 🔧 Step 5: Environment Variables

Set these in your Render dashboard under "Environment":

### Required Variables:
```bash
NODE_ENV=production
DATABASE_URL=your-postgresql-url
NEXTAUTH_SECRET=your-super-secret-key-at-least-32-characters
NEXTAUTH_URL=https://your-app-name.onrender.com
```

### Optional Variables:
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Service
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com

# Rate Limiting
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

## 🔧 Step 6: Database Migration

After deployment, you need to run database migrations:

1. Go to your app's "Shell" tab in Render
2. Run these commands:
   ```bash
   npx prisma migrate deploy
   ```
   
   **Note**: The database will be automatically seeded with initial data only if it's empty. This prevents admin changes from being overwritten on application restarts.

## 🔧 Step 7: Admin Setup

1. Visit your deployed app
2. Register a new account
3. Use the shell to make your account admin:
   ```bash
   npm run admin:set
   ```

## 🎉 You're Live!

Your app should now be accessible at:
```
https://your-app-name.onrender.com
```

## 🗄️ Database Management

### Resetting Database (Development Only)
If you need to reset the database to initial state (this will delete all admin changes and user progress):

```bash
npm run db:reset
```

**⚠️ Warning**: This should only be used in development or when you intentionally want to reset everything.

### Preserving Admin Changes
The application is now configured to preserve admin changes to levels:
- Initial seeding only happens when the database is empty
- Admin modifications are preserved across application restarts
- Use the admin panel to modify levels instead of resetting the database

## 🔍 Troubleshooting

### Common Issues:

1. **Build Fails**: Check that all dependencies are in `package.json`
2. **Database Connection**: Verify `DATABASE_URL` is correct
3. **OAuth Errors**: Check redirect URIs in Google Cloud Console
4. **Environment Variables**: Ensure all required vars are set

### Logs:
- Check "Logs" tab in Render dashboard for errors
- Use "Shell" tab to run commands manually

## 📞 Support

If you encounter issues:
1. Check Render's documentation
2. Review the logs in Render dashboard
3. Verify all environment variables are set correctly
