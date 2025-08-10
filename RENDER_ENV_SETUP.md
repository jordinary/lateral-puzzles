# 🚀 Render Environment Variables Setup

## 📋 Copy-Paste Values for Render

### **Required Variables (Copy These Exactly):**

#### 1. DATABASE_URL
**Key:** `DATABASE_URL`  
**Value:** `postgresql://lateral_puzzles_user:JpuS9y9YAp9CvU4vaE2ujyOn4qtET2vV@dpg-d2bp7315pdvs73d0f260-a/lateral_puzzles`

#### 2. NEXTAUTH_SECRET
**Key:** `NEXTAUTH_SECRET`  
**Value:** `a22de9a9331ac34230f87dd4a0d8d713dab6d481b9f8ef90170c6a990c4b9d1d`

#### 3. NEXTAUTH_URL
**Key:** `NEXTAUTH_URL`  
**Value:** `https://lateral-puzzles.onrender.com`

#### 4. NODE_ENV
**Key:** `NODE_ENV`  
**Value:** `production`

#### 5. GOOGLE_CLIENT_ID
**Key:** `GOOGLE_CLIENT_ID`  
**Value:** `90760514988-j391bukslsj4vst39kksov5cm2i6cv2l.apps.googleusercontent.com`

#### 6. GOOGLE_CLIENT_SECRET
**Key:** `GOOGLE_CLIENT_SECRET`  
**Value:** `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`

## 🔧 How to Add in Render:

1. **Go to your Render dashboard**
2. **Click on your `lateral-puzzles` service**
3. **Click "Environment" tab**
4. **Click "Add Environment Variable"**
5. **Copy each Key and Value pair above**
6. **Click "Save Changes"**
7. **Repeat for all 6 variables**

## ✅ After Adding All Variables:

1. **Go to "Manual Deploy" section**
2. **Click "Clear build cache & deploy"**
3. **Wait for deployment to complete**

## 🧪 Test Your Setup:

Visit: `https://lateral-puzzles.onrender.com/api/health`

This should show:
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": "production"
}
```

## 🎯 What This Will Enable:

- ✅ **Database connection** and user management
- ✅ **User authentication** and sign-in
- ✅ **Google OAuth** sign-in
- ✅ **Password reset** functionality
- ✅ **Admin dashboard** access
- ✅ **Full application** functionality

## 🚨 Important Notes:

- **Don't include quotes** around values
- **Copy exactly** as shown
- **Save each variable** before adding the next
- **Redeploy** after adding all variables
- **Keep your database credentials secure**
