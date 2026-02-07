# Next.js Development Skill

## Purpose
This skill provides expert guidance and implementation assistance for Next.js 16+ applications using TypeScript, Tailwind CSS, and the App Router.

## Capabilities
- Component creation and modification
- Route implementation with App Router
- State management with React Context and hooks
- API route development
- Styling with Tailwind CSS
- TypeScript type definitions
- Performance optimization
- SEO best practices
- Server-side rendering (SSR) and static site generation (SSG)

## Best Practices
- Use the App Router (`app/` directory) for new routes
- Implement proper error boundaries with `error.tsx` and `global-error.tsx`
- Follow Next.js conventions for loading states with `loading.tsx`
- Leverage React Server Components where appropriate
- Use `async`/`await` for server-side data fetching
- Implement proper form handling with React Hook Form when needed

## File Structure
- Components: `components/`
- Pages: `app/`
- API routes: `app/api/`
- Styles: `styles/` or within component folders
- Utilities: `lib/` or `utils/`
- Public assets: `public/`

## Common Patterns
- Client components: Use `'use client'` directive
- Server components: Default behavior, no directive needed
- Environment variables: Use `.env.local` and `process.env`
- Image optimization: Use Next.js `Image` component
- Link handling: Use Next.js `Link` component