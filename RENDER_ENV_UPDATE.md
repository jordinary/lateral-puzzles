# 🚀 Update Render Environment Variables Programmatically

You have two options to update your Render environment variables without clicking around the dashboard:

## Option 1: Render CLI (Recommended - Easiest)

### Step 1: Login to Render CLI
```bash
render login
```
This will open your browser to authenticate with Render.

### Step 2: Run the Update Script
```bash
./scripts/update-render-env.sh
```

That's it! The script will automatically set all your ImageKit environment variables.

---

## Option 2: Manual CLI Commands

If you prefer to run commands manually:

```bash
# Login first
render login

# Set each environment variable
render env set IMAGEKIT_PUBLIC_KEY "public_CqYvnU6KUN2LGW8bo6NQctkkMYU="
render env set IMAGEKIT_PRIVATE_KEY "private_bmNlN9wkmpBV+7H0OWRIEEQzhhE="
render env set IMAGEKIT_URL_ENDPOINT "https://ik.imagekit.io/puzzle"
```

---

## Option 3: Render API (Advanced)

If you want to use the API directly, use the `scripts/update-render-env.js` script:

1. Get your Render API key from: https://render.com/docs/api#authentication
2. Get your service ID from your service URL
3. Update the script with your credentials
4. Run: `node scripts/update-render-env.js`

---

## What Happens After Update

✅ Environment variables are set immediately  
🔄 Your service automatically restarts  
📱 New variables are available to your app  
🎯 ImageKit integration starts working  

## Troubleshooting

### "render: command not found"
```bash
npm install -g render-cli
```

### "Not logged in"
```bash
render login
```

### "Service not found"
Make sure you're in the right directory and your service is deployed on Render.

---

## Verify the Update

After running the script, check your Render dashboard:
1. Go to your service
2. Environment tab
3. You should see the new ImageKit variables

Your app will now work with ImageKit! 🎉
