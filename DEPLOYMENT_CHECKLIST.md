# 🚀 Deployment Checklist

Use this checklist to track your deployment progress to Render.

## ✅ Pre-Deployment Setup

- [ ] **Code is ready**: All features working locally
- [ ] **GitHub repository**: Code pushed to GitHub
- [ ] **Render account**: Created at [render.com](https://render.com)
- [ ] **Database**: PostgreSQL instance created (Render, Supabase, Neon, etc.)

## 🔧 Environment Variables

### Required Variables:
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL=your-postgresql-url`
- [ ] `NEXTAUTH_SECRET=your-generated-secret` (use `npm run generate:secret`)
- [ ] `NEXTAUTH_URL=https://your-app-name.onrender.com`

### Optional Variables:
- [ ] `GOOGLE_CLIENT_ID=your-google-client-id`
- [ ] `GOOGLE_CLIENT_SECRET=your-google-client-secret`
- [ ] `RESEND_API_KEY=your-resend-api-key`
- [ ] `EMAIL_FROM=noreply@yourdomain.com`
- [ ] `UPSTASH_REDIS_REST_URL=your-redis-url`
- [ ] `UPSTASH_REDIS_REST_TOKEN=your-redis-token`

## 🚀 Deployment Steps

- [ ] **Create Render service**: Web service connected to GitHub
- [ ] **Set environment variables**: All required vars configured
- [ ] **Deploy**: Initial deployment completed
- [ ] **Database migration**: Run `npx prisma migrate deploy`
- [ ] **Seed database**: Run `npx prisma db seed`
- [ ] **Test deployment**: App loads without errors

## 🔐 Post-Deployment Setup

- [ ] **Register admin account**: Create first user account
- [ ] **Set admin role**: Run `npm run admin:set` in Render shell
- [ ] **Test features**: Login, levels, admin interface working
- [ ] **Configure OAuth**: Update Google Cloud Console with production URLs
- [ ] **Test OAuth**: Google sign-in working (if configured)

## 🎯 Final Verification

- [ ] **App accessible**: `https://your-app-name.onrender.com` loads
- [ ] **Authentication working**: Login/register functional
- [ ] **Levels working**: Users can solve puzzles
- [ ] **Admin interface**: Content management functional
- [ ] **File uploads**: Images and content upload properly
- [ ] **Mobile responsive**: Works on mobile devices
- [ ] **Performance**: App loads quickly

## 📊 Monitoring

- [ ] **Logs checked**: No errors in Render logs
- [ ] **Performance monitored**: App response times acceptable
- [ ] **Error tracking**: Set up monitoring if needed

## 🎉 Success!

Your lateral puzzles app is now live in production! 🚀

---

## 🔍 Troubleshooting

If you encounter issues:

1. **Check Render logs**: Look for error messages
2. **Verify environment variables**: All required vars set correctly
3. **Database connection**: Ensure DATABASE_URL is correct
4. **OAuth configuration**: Check redirect URIs in Google Cloud Console
5. **Build issues**: Check package.json and dependencies

## 📞 Support Resources

- [Render Documentation](https://render.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/configuration/providers)
