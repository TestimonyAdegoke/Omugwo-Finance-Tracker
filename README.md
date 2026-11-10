<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Omugwo Academy Finance Tracker

A comprehensive, production-ready finance tracking application for Omugwo Academy built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Core Functionality
- **Income & Expense Tracking** - Full CRUD operations for all financial transactions
- **Financial Dashboard** - Real-time overview with charts and KPIs
- **Category Management** - Customizable income and expense categories
- **Partner Directory** - Manage customers, vendors, sponsors with full contact details
- **Budget Planning** - Set monthly spending limits and track against actuals
- **Financial Reports** - Monthly trends, category breakdowns, and strategic insights
- **Team Management** - Role-based access control (Admin, Finance, Viewer)
- **AI Advisor** - Gemini-powered financial insights and recommendations

### Technical Features
- **Supabase Backend** - PostgreSQL database with real-time subscriptions
- **Authentication** - Secure email/password authentication via Supabase Auth
- **Row Level Security** - Data protection at the database level
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- **TypeScript** - Full type safety throughout the application

## Getting Started

### Prerequisites
- Node.js 18+ 
- A Supabase account (free tier available at https://supabase.com)

### 1. Clone and Install
```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql` to create all tables
3. Go to **Settings > API** and copy your project URL and anon key

### 3. Configure Environment Variables

Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here  # Optional, for AI Advisor
```

### 4. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 5. Create Your First Account
Sign up with your email and password on the login page.

## Database Schema

The application uses the following tables:
- `categories` - Income and expense categories
- `transactions` - All financial records
- `partners` - Customers, vendors, sponsors
- `budgets` - Monthly spending limits
- `recurring_schedules` - Automated recurring transactions
- `users` - Team members and roles
- `invites` - Pending team invitations

## User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full access to all features including user management |
| Finance | Create/edit transactions, partners, budgets |
| Viewer | Read-only access to dashboards and reports |

## Production Deployment

```bash
npm run build
```

The build output in `dist/` can be deployed to any static hosting service (Netlify, Vercel, etc.)

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Build Tool**: Vite
- **AI**: Google Gemini API (optional)

## License

MIT License
