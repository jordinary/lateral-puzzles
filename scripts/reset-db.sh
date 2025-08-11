#!/bin/bash
# Database reset script - use this when you want to reset to initial state
echo "⚠️  WARNING: This will reset the database to initial state!"
echo "All admin changes and user progress will be lost!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Database reset cancelled."
    exit 0
fi

echo "🗄️  Resetting database..."
npx prisma migrate reset --force

echo "🌱 Seeding database with initial data..."
npm run prisma:seed

echo "✅ Database has been reset to initial state."
echo "⚠️  Remember: This script should only be used in development or when you intentionally want to reset everything."
