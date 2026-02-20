# Servizi Secondari

Web application for Italian volunteering associations to manage transport and event services.

## Tech Stack

- **Frontend**: React 18 + MUI 5 + TypeScript
- **Backend**: Vercel Serverless Functions (Node.js)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 22+
- A [Supabase](https://supabase.com) project
- A [Vercel](https://vercel.com) account (for deployment)

### 1. Clone and Install

```bash
git clone <repo-url>
cd servizi-secondari-main
npm install --legacy-peer-deps
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/migration.sql`
3. Go to **Settings > API** and copy your:
   - **Project URL** (e.g., `https://abc123.supabase.co`)
   - **Service Role Key** (under "Project API keys")
   - **Anon Key** (under "Project API keys")

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

For Vercel deployment, add these same variables in the Vercel dashboard under **Settings > Environment Variables**.

### 4. Run Locally

```bash
npm start
```

The frontend runs on `http://localhost:3000`. API routes are served by Vercel CLI during deployment; for local development, the frontend uses mock data until connected to a deployed backend.

To test API routes locally with Vercel CLI:

```bash
npx vercel dev
```

## Project Structure

```
servizi-secondari-main/
├── api/                    # Vercel Serverless Functions (backend)
│   ├── auth/               # Authentication endpoints
│   │   ├── login.ts
│   │   ├── register.ts
│   │   ├── logout.ts
│   │   └── verify.ts
│   ├── services/           # Service CRUD endpoints
│   │   ├── index.ts        # GET (list) / POST (create)
│   │   ├── [id].ts         # GET / PUT / DELETE by ID
│   │   └── stats.ts        # GET aggregated stats
│   ├── users/
│   │   └── profile.ts      # GET / PUT user profile
│   └── utils/
│       ├── supabase.ts     # Supabase client config
│       ├── auth.ts         # JWT verification middleware
│       └── cors.ts         # CORS handler
├── src/                    # React frontend
│   ├── contexts/           # Auth, Service, UI state management
│   ├── services/           # API client layer
│   ├── sections/           # Page views (auth, services, dashboard)
│   ├── components/         # Reusable UI components
│   ├── types/              # TypeScript interfaces
│   └── hooks/              # Custom React hooks
├── supabase/
│   └── migration.sql       # Database schema and RLS policies
├── vercel.json             # Vercel deployment config
└── .env.example            # Environment variable template
```

## API Endpoints

### Authentication

| Method | Endpoint            | Description                |
|--------|---------------------|----------------------------|
| POST   | `/api/auth/login`   | Sign in with email/password |
| POST   | `/api/auth/register`| Create new account          |
| POST   | `/api/auth/logout`  | Sign out                    |
| GET    | `/api/auth/verify`  | Verify JWT token            |

### Services

| Method | Endpoint               | Description                    |
|--------|------------------------|--------------------------------|
| GET    | `/api/services`        | List services (with filters)   |
| POST   | `/api/services`        | Create a new service           |
| GET    | `/api/services/:id`    | Get service by ID              |
| PUT    | `/api/services/:id`    | Update service                 |
| DELETE | `/api/services/:id`    | Delete service                 |
| GET    | `/api/services/stats`  | Get service statistics         |

### Users

| Method | Endpoint              | Description           |
|--------|-----------------------|-----------------------|
| GET    | `/api/users/profile`  | Get current profile   |
| PUT    | `/api/users/profile`  | Update current profile|

## Database Schema

- **`profiles`**: User profiles (linked to Supabase `auth.users`)
- **`services`**: All services (sport + secondary) with JSONB data column

Row Level Security ensures users can only access their own data, while admins and operators can view all services.

## Deployment

```bash
# Deploy to Vercel
npx vercel --prod
```

Make sure environment variables are configured in Vercel dashboard before deploying.
