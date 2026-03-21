# Raphamel Marketplace — Frontend

Africa's B2B medical marketplace, built with [Next.js](https://nextjs.org).

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SHEETS_WEBHOOK_URL` | Google Apps Script webhook URL for waitlist form submissions |
| `WAITLIST_MODE` | Set to `true` to redirect all routes to `/waitlist` |

## Project Structure

```
src/
├── app/                   # Next.js App Router pages and layouts
│   ├── (shop)/            # Shop layout (Header + Footer)
│   ├── (auth)/            # Auth layout
│   └── waitlist/          # Standalone waitlist page
├── features/              # Feature-based components
│   └── waitlist/          # Waitlist landing page
├── components/            # Shared UI components
│   └── ui/                # Button, Input, Badge, Spinner, etc.
├── domain/                # Entities and domain types
├── hooks/                 # Shared React hooks
└── lib/                   # Utilities (cn, etc.)
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **Animations:** Framer Motion
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Data Fetching:** TanStack React Query v5
- **Icons:** Lucide React

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion)
