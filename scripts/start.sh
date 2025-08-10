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

# Run database migrations with fallback to db push
echo "🗄️ Running database migrations..."
if ! npx prisma migrate deploy; then
  echo "⚠️  Migrations not found or failed. Falling back to 'prisma db push' to sync schema..."
  npx prisma db push
fi

# Seed the database
echo "🌱 Seeding database..."
npm run prisma:seed || true

echo "✅ Database setup complete"

# Start the application
echo "🚀 Starting Next.js application..."
npm start
