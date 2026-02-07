# Todo App - Phase II Frontend

A stunning, professional-grade todo application built with Next.js 16+, TypeScript, and Tailwind CSS. This application provides a breathtaking user experience with top-tier visual design comparable to Todoist, Notion, or Linear.

## Features

- **Authentication**: Secure sign-up and sign-in with JWT-based authentication
- **Todo Management**: Full CRUD functionality (Add, Delete, Update, View, Mark Complete)
- **Responsive Design**: Mobile-first approach with tablet and desktop support
- **Premium UI**: Glassmorphism effects, micro-interactions, and delightful animations
- **Optimistic Updates**: Smooth UI experience with instant feedback
- **Loading States**: Proper loading and empty states for better UX
- **Accessibility**: WCAG 2.1 AA compliance

## Design Philosophy

This application follows a "premium user experience" philosophy, featuring:

- **Flawless Typography**: Using Inter font with perfect spacing rhythm
- **Subtle Depth**: Glassmorphism and soft shadows for visual hierarchy
- **Premium Color Harmony**: Carefully selected color palette for professional appearance
- **Joyful Micro-interactions**: Framer Motion animations for delightful feedback
- **Responsive Excellence**: Pixel-perfect layouts across all device sizes

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

The application will start on [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file in the root of the frontend directory with the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key
```

## Why This UI Feels Premium

- **Visual Hierarchy**: Carefully crafted spacing and typography create clear information architecture
- **Micro-interactions**: Every button press, toggle, and modal transition has purposeful animation
- **Glassmorphism Effects**: Modern frosted glass UI elements create depth and sophistication
- **Responsive Design**: Thoughtful layouts ensure the app feels native on every device
- **Loading States**: Thoughtful loading indicators and skeleton screens prevent jank
- **Accessibility**: Proper focus rings, ARIA labels, and semantic HTML ensure inclusivity

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom-built with accessibility in mind
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **API**: SWR for data fetching
- **Authentication**: Better Auth with JWT

## Architecture

The application follows a component-based architecture with:

- **UI Components**: Reusable components in `components/ui/`
- **Feature Components**: Auth and Todo components in respective directories
- **Utilities**: Shared logic in `lib/` and `hooks/`
- **Types**: Strong typing with Zod validation schemas
- **API Layer**: Centralized API client with JWT handling

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run linter

## Contributing

This project follows a spec-first development approach. All features are fully specified before implementation begins.