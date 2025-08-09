# Lateral Puzzles

A web-based lateral thinking puzzle game inspired by the Tim Tang Test. Players solve visual and textual puzzles by entering passwords, with progression through levels and an admin interface for content management.

## Features

- **User Authentication**: Login/register system with role-based access
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
```

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
