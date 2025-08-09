#!/bin/bash

# Production startup script for Render deployment

echo "🚀 Starting Lateral Puzzles application..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL is not set"
    exit 1
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "❌ Error: NEXTAUTH_SECRET is not set"
    exit 1
fi

if [ -z "$NEXTAUTH_URL" ]; then
    echo "❌ Error: NEXTAUTH_URL is not set"
    exit 1
fi

echo "✅ Environment variables check passed"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Seed the database if needed
echo "🌱 Seeding database..."
npx prisma db seed

echo "✅ Database setup complete"

# Start the application
echo "🚀 Starting Next.js application..."
npm start
