# PL8M8 Web Application

The PL8M8 web application provides a comprehensive platform for users to track vehicle issues, manage maintenance schedules, and access vehicle-related services through a modern web interface.

## Prerequisites

Before starting, ensure you have the following set up:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git** for version control
- **Modern web browser** for development and testing

## Core Technologies

This web application is built with:

- **Next.js 15**: React framework with SSR/SSG capabilities
- **React 18**: Modern React with latest features
- **Supabase**: Backend-as-a-Service for database, authentication, and storage
- **TypeScript**: Type-safe development
- **Styled Components**: Component-based styling
- **Framer Motion**: Smooth animations and transitions

## Environment Setup

### 1. Clone the Repository

```bash
git clone [repository-url]
cd pl8m8-web
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=your_posthog_host

# External APIs (Optional)
UNSPLASH_ACCESS_KEY=your_unsplash_api_key
```

**Where to find these values:**
- **Personal Database**: Supabase Dashboard > Settings > API
- **Team Database**: Request from project maintainer

> ⚠️ **Critical**: The application will not function without the Supabase environment variables. The Supabase client library requires these to connect to your database.

## Package Scripts

### Development Scripts

#### `npm run dev`
```bash
npm run dev
```
Starts the Next.js development server with hot reload enabled on `http://localhost:3000`.

#### `npm run build`
```bash
npm run build
```
Creates an optimized production build of the application.

#### `npm start`
```bash
npm start
```
Starts the production server (requires `npm run build` first).

#### `npm run lint`
```bash
npm run lint
```
Runs ESLint to check for code quality issues and enforce coding standards.

#### `npm run type-check`
```bash
npm run type-check
```
Runs TypeScript compiler to check for type errors without emitting files.

### Export & Deployment

#### `npm run export`
```bash
npm run export
```
Creates a static export of the application for static hosting platforms.

## Supabase Integration

This web application shares the same database with the mobile app, ensuring data consistency across platforms.

### Quick Start (Using Team Database)

If you have access to the team's development database:

1. **Login to Supabase CLI:**
   ```bash
   npm run sb:login
   ```

2. **Link to team database:**
   ```bash
   npm run sb:link
   # Select the team's development project
   ```

3. **Create .env.local file with team database credentials:**
   ```env
   # Get these values from the project maintainer
   NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_team_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_team_service_role_key
   ```
   > **Important**: Request these values from the project maintainer.

4. **Generate TypeScript types:**
   ```bash
   npm run sb:types
   ```

5. **Start development:**
   ```bash
   npm run dev
   ```

### Personal Database Setup

For isolated development or experimental features:

1. **Create your own Supabase project** at [supabase.com](https://supabase.com)

2. **Login and link to your project:**
   ```bash
   npm run sb:login
   npm run sb:link
   # Enter your project reference ID
   ```

3. **Create .env.local file:**
   ```env
   # Get these from your Supabase project dashboard > Settings > API
   NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Start local Supabase instance:**
   ```bash
   npm run sb:start
   ```

5. **Push schema and setup storage:**
   ```bash
   npm run sb:push
   npm run sb:storage
   ```

6. **Generate TypeScript types:**
   ```bash
   npm run sb:types
   ```

### Supabase Commands Reference

| Command | Purpose |
|---------|---------|
| `npm run sb:login` | Login to Supabase CLI |
| `npm run sb:start` | Start local Supabase instance |
| `npm run sb:stop` | Stop local instance |
| `npm run sb:link` | Connect to Supabase project |
| `npm run sb:storage` | Create storage buckets |
| `npm run sb:pull` | Pull schema changes from remote |
| `npm run sb:push` | Push migrations to remote |
| `npm run sb:reset` | Reset local database |
| `npm run sb:types` | Generate TypeScript types |

## Development Workflow

### File Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Next.js pages (file-based routing)
├── styles/             # Global styles and themes
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

### Database Synchronization

The web application shares the same database schema as the mobile app:

#### For Experimental Changes
1. Use your personal Supabase database
2. Make changes and test locally
3. Create migrations with `npm run sb:pull`

#### For Team Changes
1. Switch to team database: `npm run sb:link`
2. Push your migrations: `npm run sb:push`
3. Generate updated types: `npm run sb:types`
4. Test with team database

### TypeScript Integration

Generate TypeScript types from your Supabase schema:

```bash
npm run sb:types
```

This creates `types/supabase.ts` with all your database types, enabling full type safety.

## Deployment

### Static Export (Recommended)
```bash
npm run build
npm run export
```

The `out/` directory can be deployed to any static hosting platform:
- Netlify
- Vercel
- AWS S3 + CloudFront
- GitHub Pages

### Server-Side Rendering
For full SSR capabilities, deploy to platforms that support Node.js:
- Vercel
- Netlify Functions
- Railway
- Render

## Testing

### Included Testing Tools

- **Cypress**: End-to-end testing in real browsers
- **TypeScript**: Compile-time error checking
- **ESLint**: Code quality and consistency

### Running Tests

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# End-to-end tests (if Cypress is configured)
npx cypress open
```

## Troubleshooting

### Common Issues

**Development server won't start:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

**Supabase connection issues:**
```bash
npm run sb:stop
npm run sb:start
npm run sb:types
```

**Build errors:**
```bash
# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint
```

**Environment variable issues:**
- Ensure `.env.local` file exists in root directory
- Verify all required variables are present
- Check variable names match exactly (case-sensitive)
- Restart development server after changing `.env.local`
- Confirm Supabase URL format: `https://[project-ref].supabase.co`

### Performance Optimization

- Use `next/image` for optimized images
- Implement code splitting with dynamic imports
- Configure proper caching headers
- Monitor bundle size with `npm run build`

## Contributing

### Git Workflow
- Create feature branches from `develop`
- Include migration files when schema changes are made
- Update TypeScript types with `npm run sb:types`
- Test both locally and with team database before merging

### Code Standards
- Follow TypeScript best practices
- Use ESLint configuration for consistent styling
- Write meaningful component and function names
- Add proper TypeScript types for all functions

## Integration with Mobile App

This web application is designed to work seamlessly with the PL8M8 mobile app:

- **Shared Database**: Both applications use the same Supabase backend
- **Consistent API**: Same data models and API endpoints
- **Real-time Sync**: Changes in one platform reflect immediately in the other
- **Unified Authentication**: Users can access both platforms with the same credentials

---

**Need access to team resources?** Contact the project maintainer for:
- Supabase team database access
- Analytics platform access
- Deployment credentials