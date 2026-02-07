# Design System Contracts: Flagship UI

**Feature**: 003-flagship-ui
**Date**: 2026-01-02
**Version**: v3.0

---

## Overview

This document defines the **visual design system contracts** for implementing the flagship UI transformation. These are not API contracts but visual specifications that the Frontend Engineer agent must implement with fidelity.

---

## Component Contracts

### 1. Theme Toggle Component

**Component**: `ThemeToggle`

**Props**:
```typescript
interface ThemeToggleProps {
  position?: 'header' | 'settings';
  showLabel?: boolean;
}
```

**Visual Specifications**:

| State | Classes (Light) | Classes (Dark) | Animation |
|-------|----------------|---------------|-----------|
| Default | `bg-white border-slate-200 rounded-xl p-2` | `bg-slate-800 border-slate-700 rounded-xl p-2` | Scale/opacity on hover |
| Hover | `shadow-md border-slate-300` | `shadow-md border-slate-600` | Micro-lift (200-300ms) |
| Focus | `ring-2 ring-indigo-500` | `ring-2 ring-indigo-400` | Glow animation |

**Behavior**:
- Click toggles between light/dark with 500ms transition
- Icon shows current opposite theme (sun in dark, moon in light)
- Preference saves to localStorage immediately

---

### 2. Todo Card Component

**Component**: `TodoCard`

**Props**:
```typescript
interface TodoCardProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}
```

**Visual Specifications**:

| State | Classes | Animation |
|-------|---------|-----------|
| Resting | `bg-white border-slate-100 rounded-2xl p-6 shadow-sm` | N/A |
| Hover | `shadow-md border-slate-200 transform -translate-y-0.5` | Micro-lift (200-300ms, ease-out-cubic) |
| Completing | `opacity-80` | Fade (300ms) |
| Completed | `bg-slate-50 opacity-60 line-through` | Fade (300ms) |

**Typography**:
- Title: `text-lg font-semibold text-slate-900` (light) / `text-slate-50` (dark)
- Description: `text-slate-600` (light) / `text-slate-400` (dark)

**Checkmark**:
- Size: 24x24
- Stroke: 2px
- Colors: `stroke-slate-300` (resting) → `stroke-emerald-500` (completed)
- Animation: Stroke draw-in (400-500ms) on completion

---

### 3. Modal Component

**Component**: `Modal`

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}
```

**Visual Specifications**:

**Backdrop**:
- `bg-slate-900/50 backdrop-blur-md`
- Fade animation: 200ms ease-out-cubic

**Content**:
| Property | Light Theme | Dark Theme |
|----------|-------------|-------------|
| Background | `bg-white` | `bg-slate-800` |
| Border | `border-slate-100` | `border-slate-700` |
| Border Radius | `rounded-2xl` | `rounded-2xl` |
| Shadow | `shadow-xl` | `shadow-2xl` |
| Padding | `p-8` | `p-8` |

**Animation**:
- Entrance: Scale 0.95 → 1, opacity 0 → 1 (300ms ease-out-cubic)
- Exit: Scale 1 → 0.95, opacity 1 → 0 (200ms ease-in-cubic)

---

### 4. Loading Skeleton Component

**Component**: `SkeletonCard`

**Visual Specifications**:

| Element | Classes | Animation |
|---------|---------|-----------|
| Card base | `bg-white rounded-2xl p-6 h-32` | N/A |
| Title shimmer | `bg-slate-100 rounded-lg h-6 w-3/4` | Shimmer (1.5s infinite) |
| Text shimmer | `bg-slate-100 rounded-lg h-4 w-1/2` | Shimmer (1.5s infinite, delayed 0.1s) |
| Text shimmer 2 | `bg-slate-100 rounded-lg h-4 w-2/3` | Shimmer (1.5s infinite, delayed 0.2s) |

**Shimmer Animation**:
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.shimmer {
  background: linear-gradient(90deg,
    var(--bg-surface) 0%,
    var(--bg-surface-2) 50%,
    var(--bg-surface) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite linear;
}
```

---

### 5. Empty State Component

**Component**: `EmptyState`

**Props**:
```typescript
interface EmptyStateProps {
  type: 'no-todos' | 'no-results' | 'all-complete';
  title: string;
  description: string;
  cta?: { text: string; action: () => void };
}
```

**Visual Specifications**:

| Element | Classes |
|---------|---------|
| Container | `flex flex-col items-center justify-center py-16` |
| Icon container | `w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6` |
| Icon | `w-12 h-12 stroke-slate-400` |
| Title | `text-2xl font-semibold text-slate-900 mb-2` (light) / `text-slate-50` (dark) |
| Description | `text-slate-600 text-center max-w-md mb-8` (light) / `text-slate-400` (dark) |
| CTA button | `bg-indigo-600 text-white rounded-xl px-6 py-3 font-medium shadow-md` |

---

### 6. Toast Component

**Component**: `Toast`

**Props**:
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'info';
  message: string;
  onDismiss: () => void;
}
```

**Visual Specifications**:

| Type | Background | Border | Icon | Text Color |
|------|-------------|--------|------|------------|
| Success | `bg-emerald-50` (light) / `bg-emerald-950/20` (dark) | `border-emerald-200` (light) / `border-emerald-800` (dark) | Checkmark, `text-emerald-600` (light) / `text-emerald-400` (dark) | `text-emerald-900` (light) / `text-emerald-100` (dark) |
| Error | `bg-rose-50` (light) / `bg-rose-950/20` (dark) | `border-rose-200` (light) / `border-rose-800` (dark) | Alert, `text-rose-600` (light) / `text-rose-400` (dark) | `text-rose-900` (light) / `text-rose-100` (dark) |
| Info | `bg-slate-50` (light) / `bg-slate-800` (dark) | `border-slate-200` (light) / `border-slate-700` (dark) | Info, `text-slate-500` (light) / `text-slate-400` (dark) | `text-slate-900` (light) / `text-slate-100` (dark) |

**Layout**:
- `rounded-xl p-4 shadow-lg glass`
- Flex row: icon (left), text (center), dismiss button (right)
- Position: Bottom-center, 24px from edge

**Animation**:
- Entrance: `translate-y-8` to `translate-y-0`, opacity 0 to 1 (300ms ease-out-cubic)
- Exit: Opacity 1 to 0 (200ms ease-in)

---

### 7. Input Component

**Component**: `Input`

**Props**:
```typescript
interface InputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  // ... standard input props
}
```

**Visual Specifications**:

| State | Border | Background | Shadow |
|-------|--------|-------------|--------|
| Default | `border-slate-200` | `bg-white` | `inner-shadow` |
| Focus | `border-indigo-500 ring-2 ring-indigo-500/20` | `bg-white` | None (ring replaces) |
| Error | `border-rose-500 ring-2 ring-rose-500/20` | `bg-white` | None |

**Typography**:
- Label: `text-sm font-medium text-slate-700 mb-2` (light) / `text-slate-300` (dark)
- Input: `text-slate-900` (light) / `text-slate-100` (dark)
- Error: `text-sm text-rose-600 mt-2` (light) / `text-rose-400` (dark)

**Inner Shadow (for depth)**:
```css
.input-inner-shadow {
  box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
}
```

---

### 8. Button Component

**Component**: `Button`

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  // ... standard button props
}
```

**Visual Specifications**:

**Primary (Default)**:
| State | Background | Text | Shadow |
|-------|-------------|------|--------|
| Default | `bg-indigo-600` | `text-white` | `shadow-md` |
| Hover | `bg-indigo-700` | `text-white` | `shadow-lg transform -translate-y-0.5` |
| Active | `bg-indigo-800` | `text-white` | `shadow-sm` |
| Disabled | `bg-slate-300` | `text-slate-500` | `none` |

**Secondary**:
| State | Background | Text | Border |
|-------|-------------|------|--------|
| Default | `bg-white` | `text-slate-900` | `border-slate-200` |
| Hover | `bg-slate-50` | `text-slate-900` | `border-slate-300` |

**Ghost**:
| State | Background | Text |
|-------|-------------|------|
| Default | `transparent` | `text-slate-700` |
| Hover | `bg-slate-100` | `text-slate-900` |

**Sizes**:
- `sm`: `px-3 py-1.5 text-sm rounded-lg`
- `md`: `px-4 py-2 text-base rounded-xl`
- `lg`: `px-6 py-3 text-lg rounded-2xl`

**Loading State**:
- Button disabled, opacity 70%
- Spinner replaces text
- `animate-spin` on spinner

---

## Typography Scale

| Scale | Size | Weight | Line Height | Tracking | Usage |
|-------|------|--------|------------|----------|-------|
| H1 | 2.5rem (40px) | 800 | 1.2 | -0.025em | Hero titles |
| H2 | 2rem (32px) | 700 | 1.25 | -0.02em | Page titles |
| H3 | 1.5rem (24px) | 600 | 1.33 | -0.015em | Section headers |
| H4 | 1.25rem (20px) | 600 | 1.4 | -0.01em | Subsection headers |
| Body | 1rem (16px) | 400 | 1.7 | 0 | Body text |
| Small | 0.875rem (14px) | 400 | 1.5 | 0 | Labels, captions |
| Tiny | 0.75rem (12px) | 500 | 1.33 | 0 | Metadata |

---

## Page Layout Contracts

### Authentication Pages (Sign In / Sign Up)

**Layout**:
- Container: `min-h-screen flex items-center justify-center bg-slate-50` (light) / `bg-slate-900` (dark)
- Card: `w-full max-w-md bg-white rounded-3xl p-8 shadow-xl` (light) / `bg-slate-800 shadow-2xl` (dark)
- Spacing: Inputs separated by `space-y-6`, form groups by `space-y-4`

**Elements**:
- Logo: `w-16 h-16 mb-6 mx-auto`
- Title: `text-3xl font-bold text-center mb-2`
- Subtitle: `text-slate-600 text-center mb-8` (light) / `text-slate-400` (dark)
- Inputs: Full width with consistent styling
- Submit button: Full width, `h-12`
- Footer links: `text-sm text-center space-x-4`

### Dashboard

**Layout**:
- Container: `min-h-screen bg-slate-50` (light) / `bg-slate-900` (dark)
- Header: `sticky top-0 z-50 glass border-b border-slate-100` (light) / `border-slate-800` (dark)
  - Padding: `px-6 py-4`
  - Flex: Between (logo left, actions right)
- Content: `max-w-4xl mx-auto px-6 py-8`
- Footer: `border-t border-slate-200 py-8 text-center` (light) / `border-slate-800` (dark)

**Mobile (<768px)**:
- Header: Logo left, hamburger menu right
- Content: Single column, no sidebar
- Spacing: Reduced to `py-4`

**Tablet (768px-1024px)**:
- Header: Logo left, actions right (horizontal)
- Content: Single column, optimized for touch

**Desktop (1024px+)**:
- Header: Full-width with centered content
- Content: Optional sidebar + main content area

---

## Animation Keyframes

### Shimmer

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Fade In Up

```css
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Checkmark Draw

```css
@keyframes checkDraw {
  0% {
    stroke-dashoffset: 24;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
```

### Pulse Glow

```css
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(99, 102, 241, 0.1);
  }
}
```

---

## Breakpoint Contracts

| Breakpoint | Screen Width | Container Max Width |
|------------|---------------|---------------------|
| Mobile | < 640px | 100% - 48px padding |
| Mobile Large | 640px - 767px | 100% - 48px padding |
| Tablet | 768px - 1023px | 640px |
| Desktop | 1024px - 1279px | 896px |
| Desktop Large | 1280px+ | 1024px |

---

## Accessibility Contracts

### Focus Indicators

All interactive elements MUST have:

```css
*:focus-visible {
  outline: none;
  ring: 2px solid var(--primary);
  ring-offset: 2px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Implementation Notes

1. **Tailwind Configuration**: Extend tailwind.config.js with custom colors, animations, and spacing
2. **CSS Variables**: Use CSS custom properties for theme switching (see data-model.md for values)
3. **Server Components**: Maximize server components; use client components only for:
   - Theme detection (`'use client'` directive)
   - Modals
   - Toasts
   - Interactive elements with state
4. **Performance**: Animate only `transform` and `opacity` properties for GPU acceleration
