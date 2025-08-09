# 🗄️ Database Setup Guide

## Option 1: Render PostgreSQL (Recommended)

### Step 1: Create Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Fill in details:
   - **Name**: `lateral-puzzles-db`
   - **Database**: `lateral_puzzles`
   - **User**: `lateral_puzzles_user`
   - **Plan**: Free

### Step 2: Get Connection String
After creation, copy the "External Database URL" from your database dashboard.

### Step 3: Set Environment Variable
In your `lateral-puzzles` web service:
- **Key**: `DATABASE_URL`
- **Value**: Your PostgreSQL connection string

## Option 2: Supabase (Free)

### Step 1: Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub
4. Create new project:
   - **Name**: `lateral-puzzles`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to you

### Step 2: Get Connection String
1. Go to Settings → Database
2. Copy the "Connection string" (URI format)
3. Replace `[YOUR-PASSWORD]` with your database password

### Step 3: Set Environment Variable
In your Render web service:
- **Key**: `DATABASE_URL`
- **Value**: Your Supabase connection string

## Option 3: Neon (Free)

### Step 1: Create Neon Project
1. Go to [Neon](https://neon.tech)
2. Sign up with GitHub
3. Create new project:
   - **Name**: `lateral-puzzles`
   - **Region**: Choose closest to you

### Step 2: Get Connection String
1. Go to your project dashboard
2. Copy the connection string from the "Connection Details" section

### Step 3: Set Environment Variable
In your Render web service:
- **Key**: `DATABASE_URL`
- **Value**: Your Neon connection string

## 🔧 Database Migration

After setting up your database, the application will automatically:
1. **Run migrations** on startup
2. **Create tables** based on Prisma schema
3. **Seed initial data** (levels, admin user)

## 🧪 Testing Your Database

### Health Check
Visit: `https://lateral-puzzles.onrender.com/api/health`

This will show:
- Database connection status
- Environment variables status
- Any connection errors

### Manual Test
You can also test locally:
```bash
# Test database connection
npx prisma db push

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed
```

## 🚨 Common Issues

### Connection Refused
- Check if database is running
- Verify connection string format
- Ensure database allows external connections

### Authentication Failed
- Check username/password in connection string
- Verify database user has proper permissions

### SSL Issues
- Add `?sslmode=require` to connection string if needed
- Some providers require SSL connections

## 📊 Database Schema

Your database will contain these tables:
- `User` - User accounts and authentication
- `Level` - Puzzle levels and content
- `LevelAnswer` - Correct answers for each level
- `LevelUnlock` - Which users have unlocked which levels
- `LevelSolve` - User completion records
- `AnswerAttempt` - Failed answer attempts

## 🔐 Security Notes

- **Never commit** database passwords to Git
- **Use environment variables** for all sensitive data
- **Enable SSL** for production databases
- **Regular backups** are recommended

## 🆘 Need Help?

1. **Check Render logs** for database connection errors
2. **Test connection string** locally first
3. **Verify environment variables** are set correctly
4. **Contact database provider** if connection issues persist
