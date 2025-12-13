# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js car listing application (PL8M8 Carlot) that allows users to create and share vehicle listings with authentication via Supabase.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Application Structure

The application follows a modular architecture pattern:

- **`app/`**: Next.js App Router pages
  - `/` - Landing page with auto-redirect to profile if authenticated
  - `/signin` - OTP email authentication
  - `/signin/otp` - OTP verification
  - `/[username]` - Public/private profile pages with print-ready listing view

- **`modules/`**: Feature-based modules with service/store pattern
  - Each module contains: `*.service.ts` (API logic), `*.store.ts` (Zustand state), `components/` (UI)
  - Example: `modules/profile/` handles all user profile and authentication logic

- **`utils/`**: Shared utilities
  - `utils/supabase/` - Supabase client initialization for browser (`client.ts`) and server (`server.ts`)

- **`helpers/`**: Helper functions
  - Example: `getPublicBucketUrls.helper.ts` - transforms storage paths to public URLs

### State Management

Uses Zustand for global state management. See `modules/profile/profile.store.ts` for the pattern:
- Store exports hook (e.g., `useProfileStore`)
- Contains both state and async actions
- Services are separated into `*.service.ts` files

### Authentication & Middleware

- **Authentication**: Supabase OTP (magic link) via email
- **Middleware** (`middleware.ts`): Handles route protection
  - Public routes: `/`, `/signin`, `/signin/otp`
  - Profile pages (`/[username]`) are public for viewing
  - Authenticated users redirected from `/signin` to their profile
  - Protected routes require authentication

### Supabase Integration

- **Browser client**: `utils/supabase/client.ts` - for client components
- **Server client**: `utils/supabase/server.ts` - for server components/actions (uses cookies)
- **Storage**: Vehicle images stored in `vehicle-images` bucket
- **Database**: `profiles` table with fields: `id`, `username`, `vehicle` (JSONB), `vehicle_images` (array)

### Path Aliases

TypeScript configured with `@/*` pointing to project root (tsconfig.json):
```typescript
import { supabase } from "@/utils/supabase/client"
import { useProfileStore } from "@/modules/profile"
```

### Key Patterns

1. **Module Pattern**: Features organized as self-contained modules with service layer, store, and components
2. **Server/Client Split**: Separate Supabase clients for server vs client contexts
3. **Store Initialization**: Stores have `initialize()` method called in useEffect - prevents redundant initialization with `initialized` flag
4. **Profile System**: Users auto-create profiles on first login, profiles are accessible via username URL

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

## Styling

- TailwindCSS v4 with PostCSS
- Global styles in `app/globals.css`
- Scoped styles using CSS-in-JS (`<style jsx>`) for print layouts
- Geist and Geist Mono fonts loaded via `next/font/google`

## Node Version

Configured to use Node.js version specified in `.nvmrc` file (located at project root).
