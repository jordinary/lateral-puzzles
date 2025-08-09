# Lateral Puzzles

A web-based lateral thinking puzzle game inspired by the Tim Tang Test. Players solve visual and textual puzzles by entering passwords, with progression through levels and an admin interface for content management.

## Features

- **User Authentication**: Login/register system with role-based access
- **OAuth Integration**: Google sign-in support for easy account creation
- **Password Reset**: Secure forgot password flow with email-based reset
- **Level Progression**: Unlock new levels by solving previous ones
- **Visual Puzzles**: Retro-styled puzzle components with CRT aesthetic
- **Admin Interface**: Create, edit, and manage levels and content
- **File Uploads**: Support for image uploads and code/text content
- **Progress Tracking**: Monitor user activity and solve attempts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (development), supports PostgreSQL (production)
- **Authentication**: NextAuth.js with JWT strategy
- **Styling**: Tailwind CSS with custom retro components
- **Build Tool**: Turbopack for fast development

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd lateral-puzzles
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Google OAuth (for Google sign-in)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Setting up Google OAuth (Optional)

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Copy the Client ID and Client Secret to your `.env` file

### Setting up Email Service (Required for password reset)

The application uses [Resend](https://resend.com/) for sending emails. To set up:

1. Sign up for a free account at [Resend](https://resend.com/)
2. Get your API key from the dashboard
3. Add your API key to `.env`:
   ```env
   RESEND_API_KEY="re_your-api-key-here"
   EMAIL_FROM="noreply@yourdomain.com"
   ```

**Note**: For development, if email service is not configured, the app will show reset URLs in the console and UI for testing purposes.

### Setting up Rate Limiting (Optional - for production)

To protect against abuse, the application includes rate limiting for password reset requests:

1. Sign up for a free account at [Upstash](https://upstash.com/)
2. Create a Redis database
3. Add your Redis credentials to `.env`:
   ```env
   UPSTASH_REDIS_REST_URL="https://your-redis-url.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="your-redis-token"
   ```

**Note**: If Redis is not configured, the app will use in-memory rate limiting as a fallback.

4. Set up the database:
```bash
npm run prisma:migrate
npm run prisma:seed
```

5. Set up admin user:
```bash
npm run admin:set
```

6. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Default Admin Credentials

- Email: `admin@example.com`
- Password: `admin123`

## Project Structure

```
lateral-puzzles/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets and uploads
├── scripts/               # Utility scripts
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin interface
│   │   ├── api/          # API routes
│   │   ├── levels/       # Level pages
│   │   └── login/        # Authentication pages
│   ├── components/       # React components
│   │   └── puzzles/      # Puzzle-specific components
│   ├── lib/              # Utility libraries
│   └── types/            # TypeScript type definitions
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database with initial data
- `npm run admin:set` - Set up admin user

## Database Schema

The application uses the following main models:

- **User**: Authentication and user management
- **Level**: Puzzle content and metadata
- **LevelAnswer**: Hashed answers for each level
- **LevelUnlock**: Track which levels users have unlocked
- **LevelSolve**: Track when users solve levels
- **AnswerAttempt**: Log all answer attempts for analytics

## 🚀 Deployment

### Deploy to Render (Recommended)

This app is configured for easy deployment to Render. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

**Quick Start:**
1. Push your code to GitHub
2. Create a Render account at [render.com](https://render.com)
3. Connect your GitHub repository
4. Set environment variables (see DEPLOYMENT.md)
5. Deploy!

### Environment Variables for Production

Required:
```bash
NODE_ENV=production
DATABASE_URL=your-postgresql-url
NEXTAUTH_SECRET=your-super-secret-key
NEXTAUTH_URL=https://your-app-name.onrender.com
```

Optional:
```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Other Deployment Options

- **Vercel**: Compatible with Next.js apps
- **Railway**: Good for full-stack apps
- **Heroku**: Traditional deployment option
- **DigitalOcean App Platform**: Scalable option

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Inspired by the Tim Tang Test
- Built with Next.js and modern web technologies
- Retro aesthetic inspired by classic computer interfaces
