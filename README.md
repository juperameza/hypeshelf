# HypeShelf

A shared recommendations hub where users can share and discover recommendations for movies, shows, and other content with their friends.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: SCSS Modules
- **Authentication**: Clerk
- **Backend/Database**: Convex
- **Deployment Target**: Vercel

## Features

- Public landing page with latest recommendations preview
- User authentication via Clerk (email + social login)
- Dashboard for creating and managing recommendations
- Genre filtering and staff picks filtering
- Role-based access control (User/Admin)
- Real-time updates via Convex subscriptions
- Responsive design (mobile-first)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn
- Clerk account
- Convex account

### Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <repository-url>
   cd hypeshelf
   pnpm install
   ```

2. **Set up Clerk**:
   - Create a Clerk application at [clerk.com](https://clerk.com)
   - Enable Email and Google authentication
   - Create a JWT template for Convex:
     - Go to JWT Templates
     - Create new template named "convex"
     - Copy the Issuer URL

3. **Set up Convex**:
   ```bash
   npx convex dev
   ```
   - This will prompt you to create a Convex project
   - Follow the prompts to set up your deployment

4. **Configure environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   Then fill in your values:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
   CLERK_JWT_ISSUER_DOMAIN=https://your-clerk-domain.clerk.accounts.dev
   ```

5. **Run the development server**:
   ```bash
   pnpm dev
   ```

   In a separate terminal, run Convex:
   ```bash
   npx convex dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Making a User Admin

To grant admin privileges to a user:

1. Sign up/sign in to create the user in the database
2. Open the Convex dashboard: `npx convex dashboard`
3. Navigate to the `users` table
4. Find the user by their email
5. Change their `role` from `"user"` to `"admin"`

Admins can:
- Delete any recommendation
- Toggle "Staff Pick" status on any recommendation

## Project Structure

```
hypeshelf/
├── app/                              # Next.js App Router pages
│   ├── ConvexClientProvider.tsx      # Convex React provider
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Landing page
│   ├── globals.scss                  # Global styles
│   └── dashboard/                    # Protected dashboard
├── src/
│   ├── components/                   # React components
│   │   ├── Header/
│   │   ├── RecommendationCard/
│   │   ├── RecommendationForm/
│   │   ├── RecommendationsDashboard/
│   │   ├── PublicRecommendationsList/
│   │   └── FilterBar/
│   ├── hooks/                        # Custom React hooks
│   ├── types/                        # TypeScript types
│   └── utils/                        # Utility functions
├── convex/                           # Convex backend
│   ├── schema.ts                     # Database schema
│   ├── recommendations.ts            # Recommendation queries/mutations
│   ├── users.ts                      # User management
│   └── auth.config.ts                # Clerk-Convex auth config
└── middleware.ts                     # Clerk middleware
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Convex

```bash
npx convex deploy
```

## Future Enhancements

- Comments on recommendations
- User profiles/public shelves
- Social sharing
- Search functionality
- Recommendation categories (books, podcasts, etc.)
- Upvoting/rating system
- Following other users

## License

MIT
