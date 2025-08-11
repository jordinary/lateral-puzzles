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

# Generate Prisma client (already done in buildCommand, but good for robustness)
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations or push schema if no migrations exist
echo "🗄️ Running database migrations..."
npx prisma migrate deploy || {
    echo "⚠️ No migrations found or migrate deploy failed, attempting prisma db push..."
    npx prisma db push
}

# Only seed if the database is empty (no levels exist)
echo "🔍 Checking if database needs seeding..."
LEVEL_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) as count FROM \"Level\";" | grep -o '[0-9]*' | tail -1)
if [ "$LEVEL_COUNT" = "0" ]; then
    echo "🌱 Database is empty, seeding initial data..."
    npm run prisma:seed || {
        echo "⚠️ Prisma seed failed, continuing without seeding."
    }
else
    echo "✅ Database already contains data, skipping seed operation."
fi

# Ensure uploads directory exists with proper permissions
echo "📁 Setting up uploads directory..."
mkdir -p public/uploads
chmod 755 public/uploads
echo "✅ Uploads directory ready"

echo "✅ Database setup complete"

# Start the application
echo "🚀 Starting Next.js application..."
npm start
