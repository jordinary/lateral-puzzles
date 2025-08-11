#!/bin/bash

# Script to update Render environment variables using Render CLI
# Make sure you're logged in: render login

echo "🚀 Updating Render environment variables..."

# Update ImageKit environment variables
echo "📝 Setting IMAGEKIT_PUBLIC_KEY..."
render env set IMAGEKIT_PUBLIC_KEY "public_CqYvnU6KUN2LGW8bo6NQctkkMYU="

echo "📝 Setting IMAGEKIT_PRIVATE_KEY..."
render env set IMAGEKIT_PRIVATE_KEY "private_bmNlN9wkmpBV+7H0OWRIEEQzhhE="

echo "📝 Setting IMAGEKIT_URL_ENDPOINT..."
render env set IMAGEKIT_URL_ENDPOINT "https://ik.imagekit.io/puzzle"

echo "✅ Environment variables updated!"
echo "🔄 Your service will restart automatically with the new variables."
