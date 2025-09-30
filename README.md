# LifeFlow - Next-Gen Lifestyle & Productivity Platform

A modern, full-stack productivity and lifestyle platform built for Gen Z and Millennials.

## 🚀 Features

### Core Functionality
- **Task Management**: Create, update, and track tasks with due dates
- **Smart Achievements**: Earn points for completing tasks (10 points per task)
- **Streak Tracking**: Build daily completion streaks
- **Social Feed**: Share progress and connect with community
- **Leaderboard**: Compete with others and track rankings
- **Analytics Dashboard**: Visualize productivity with charts and stats

### User System
- **Authentication**: Secure email/password login and registration
- **User Roles**: Support for ROLE_USER, ROLE_CREATOR, and ROLE_ADMIN
- **Profiles**: User profiles with achievements and stats

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Recharts (data visualization)
- shadcn/ui (component library)
- React Router (navigation)

### Backend (Lovable Cloud / Supabase)
- PostgreSQL database
- Row-Level Security (RLS) policies
- Real-time subscriptions
- JWT-based authentication
- Serverless edge functions

## 📦 Project Structure

```
src/
├── components/
│   ├── Navigation.tsx       # Main navigation bar
│   └── ui/                  # shadcn UI components
├── hooks/
│   └── useAuth.tsx         # Authentication context
├── pages/
│   ├── Auth.tsx            # Login/Register page
│   ├── Dashboard.tsx       # Main dashboard with charts
│   ├── Tasks.tsx           # Task management
│   ├── Feed.tsx            # Social feed
│   ├── Leaderboard.tsx     # Rankings
│   └── NotFound.tsx        # 404 page
└── integrations/
    └── supabase/           # Auto-generated Supabase types
```

## 🎨 Design System

The app features a modern, Gen Z-focused design with:
- Dark theme with vibrant gradients (purple, blue, pink)
- Glassmorphism effects on cards
- Smooth animations and transitions
- Mobile-first responsive layout
- Semantic color tokens for consistency

## 🔒 Security

- Row-Level Security (RLS) on all tables
- JWT-based authentication
- Input validation with Zod
- Protected routes with auth guards
- Secure user role management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Clone the repository
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies
```bash
npm install
```

3. Start development server
```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 📊 Database Schema

### Tables
- `profiles` - User profile information
- `user_roles` - Role assignments (ROLE_USER, ROLE_CREATOR, ROLE_ADMIN)
- `tasks` - User tasks with completion tracking
- `posts` - Social feed posts
- `likes` - Post likes
- `user_achievements` - Points, streaks, and task completion stats

### Key Features
- Automatic profile creation on signup
- Points awarded on task completion (10 per task)
- Streak calculation based on daily task completion
- Cascading deletes for data integrity

## 🎯 Usage

1. **Sign Up**: Create an account with email/password
2. **Create Tasks**: Add tasks with titles, descriptions, and due dates
3. **Complete Tasks**: Check off tasks to earn 10 points each
4. **Share Progress**: Post updates to the social feed
5. **Compete**: View your ranking on the leaderboard
6. **Track Stats**: Monitor progress on the analytics dashboard



This project is built with Lovable and uses Supabase under the hood.
