# TaskFlow

A full-stack task manager built with Next.js 15 (App Router), TypeScript,
Tailwind CSS, shadcn/ui, Mongoose + MongoDB Atlas, Better Auth, Zod,
React Hook Form, and Zustand.

This project was generated with all source files hand-written (no
`npm install` was run in the process, since the sandbox that built it has
no internet access). Follow the steps below on your own machine to get it
running.

## 1. Install dependencies

```bash
cd taskflow
npm install
```

## 2. Set up MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Under **Database Access**, create a user with a password
3. Under **Network Access**, allow your current IP (or `0.0.0.0/0` for
   development)
4. Click **Connect → Drivers** and copy the connection string

## 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp  .env
```

- `MONGODB_URI` — your Atlas connection string (include a database name,
  e.g. `.../taskflow?retryWrites=true...`)
- `BETTER_AUTH_SECRET` — generate one with `openssl rand -base64 32`
- `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` — leave as
  `http://localhost:3000` for local dev

## 4. Run the dev server

```bash
npm run dev
```

Visit `http://taskflow.vercal.app`. You should be able to:
- Sign up at `/register`
- Log in at `/login`
- Land on `/dashboard`, which is protected — try visiting it while logged
  out and you'll be redirected to `/login`
- Create, edit, complete, and delete tasks; search and filter by
  priority/status; see live stats (total/completed/pending/high priority)

## Project structure

```
src/
├── app/                  # Routes (App Router)
│   ├── (auth)/login, register
│   ├── dashboard/         # Protected — layout re-checks session server-side
│   └── api/               # auth catch-all + tasks REST endpoints
├── actions/               # Server Actions (task CRUD used directly by forms)
├── components/ui/         # Hand-written shadcn/ui primitives
├── features/              # Feature components (auth forms, task UI)
├── lib/                   # db connection, auth config, validation schemas, utils
├── models/                # Mongoose Task model
├── providers/             # Theme provider (dark mode)
├── store/                 # Zustand store (client-side filters)
└── types/                 # Shared TypeScript types
middleware.ts              # Route protection (cookie-based fast check)
```

## Notes / what's included vs. what's left

**Included:** register/login/logout, protected dashboard, full task CRUD
(API routes + Server Actions), ownership checks (a user can never read,
edit, or delete another user's task), search + priority/status filters,
dashboard stats, dark mode, toast notifications, loading skeleton, custom
404 and error pages, input validation with Zod on both client and server.


## Before you deploy

- Double-check `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` match your
  production domain once deployed.
- Add your production domain's IP range (or `0.0.0.0/0`) to Atlas Network
  Access, or use Atlas's "Allow access from anywhere" if Vercel's IPs
  aren't static for you.
