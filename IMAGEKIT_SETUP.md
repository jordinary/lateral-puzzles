# ImageKit Setup Guide

This guide will help you set up ImageKit for image uploads in your Lateral Puzzles application.

## Step 1: Create an ImageKit Account

1. Go to [https://imagekit.io/](https://imagekit.io/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Keys

1. Log in to your ImageKit dashboard
2. Go to "Developer Options" → "API Keys"
3. Copy your:
   - **Public Key**
   - **Private Key**
   - **URL Endpoint** (looks like `https://ik.imagekit.io/your-imagekit-id`)

## Step 3: Set Environment Variables

### Local Development (.env file)
Add these to your `.env` file:
```bash
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
```

### Production (Render Dashboard)
1. Go to your Render dashboard
2. Select your `lateral-puzzles` service
3. Go to "Environment" tab
4. Add these environment variables:
   - `IMAGEKIT_PUBLIC_KEY` = your public key
   - `IMAGEKIT_PRIVATE_KEY` = your private key
   - `IMAGEKIT_URL_ENDPOINT` = your URL endpoint

## Step 4: Test the Setup

1. Start your development server: `npm run dev`
2. Go to your admin dashboard
3. Try uploading an image for a puzzle level
4. The image should upload to ImageKit and be accessible via the returned URL

## How It Works

- Images are uploaded directly to ImageKit's servers
- ImageKit provides optimized image URLs
- Images are served from ImageKit's CDN for fast loading
- No local file storage needed
- Images persist across deployments

## Troubleshooting

### "ImageKit configuration error"
- Check that all three environment variables are set correctly
- Ensure your API keys are valid
- Verify your URL endpoint is correct

### "Image could not be loaded"
- Check the browser console for errors
- Verify the image URL is accessible
- Ensure the image was uploaded successfully

### File size limits
- Maximum file size is 10MB
- Supported formats: JPEG, PNG, GIF, WebP

## Benefits of ImageKit

- **Free tier**: 20GB storage, 20GB bandwidth per month
- **Fast CDN**: Global content delivery network
- **Image optimization**: Automatic format conversion and compression
- **No server storage**: Images don't consume your app's storage
- **Scalable**: Handles traffic spikes automatically
