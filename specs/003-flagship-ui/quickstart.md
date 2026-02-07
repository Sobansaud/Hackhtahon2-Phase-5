# Quickstart: Flagship UI Transformation

**Feature**: 003-flagship-ui
**Date**: 2026-01-02
**Target**: Frontend Engineer agent

---

## Overview

This quickstart guide provides the Frontend Engineer agent with essential context to implement the flagship UI transformation. The transformation elevates the existing Next.js frontend (spec 001) to a visually flawless, emotionally captivating masterpiece.

---

## What This Feature Changes

### In Scope (Visual Layer Only)

| Area | Transformation |
|------|----------------|
| Colors | Dual-theme system with precise color tokens |
| Typography | Inter font, refined hierarchy, 1.7 line-height |
| Spacing | 8pt grid with 48px major rhythm |
| Motion | Cinematic animations (200-500ms), ease-out-cubic |
| Depth | 4-layer shadow system, glassmorphism |
| Icons | Custom stroke-based SVGs with animations |
| States | Designed loading, empty, error, success states |
| Components | Complete visual overhaul of all components |

### Out of Scope

- Backend changes, API modifications, new functionality
- Third-party libraries (no animation frameworks, UI kits, icon libraries)
- Authentication flow changes (only visual improvements)
- External assets, illustrations, fonts beyond Inter

---

## Prerequisites

1. **Existing Implementation**: Frontend (001) must be implemented first
2. **Dependencies Installed**: Next.js 16+, TypeScript, Tailwind CSS, Better Auth
3. **No Extra Libraries**: Do NOT install any animation frameworks or UI kits

---

## Implementation Order

### Phase 1: Foundation (Must Complete First)

1. **Configure Tailwind for Design System**
   - Extend `tailwind.config.js` with custom colors from `contracts/design-system.md`
   - Add animation keyframes (shimmer, fadeInUp, checkDraw, pulseGlow)
   - Add custom spacing values
   - Add custom border radius values

2. **Create Theme System**
   - Create `components/providers/ThemeProvider.tsx` (client component)
   - Implement theme detection: localStorage → system → fallback
   - Create CSS variables for all color tokens
   - Add theme transition CSS (500ms cubic-bezier)

3. **Set Up Typography**
   - Configure Inter font via `next/font/google`
   - Create typography scale components (H1, H2, H3, H4, Body, Small, Tiny)
   - Apply 1.7 line-height and letter-spacing values

### Phase 2: Core Components (P1 Priority)

4. **Create Base Components**
   - `Button` component with all variants (primary, secondary, ghost, danger)
   - `Input` component with focus glow and inner shadow
   - `Modal` component with backdrop blur and entrance animation
   - `ThemeToggle` component

5. **Implement Todo Card**
   - Create `TodoCard` component with hover micro-lift
   - Implement checkmark stroke draw-in animation (400-500ms)
   - Add completed state styling (opacity, strikethrough)

6. **Create Loading States**
   - `SkeletonCard` component with shimmer animation
   - Button loading state with spinner

### Phase 3: State Components (P2 Priority)

7. **Implement Empty States**
   - `EmptyState` component with illustration and CTA
   - Variants for: no-todos, no-results, all-complete

8. **Create Toast Notifications**
   - `Toast` component with all types (success, error, info)
   - Entrance/exit animations
   - Toast context/hook for managing toasts

9. **Design Error States**
   - Network error state with retry button
   - Validation error inline display
   - Unauthorized redirect handling

### Phase 4: Page Implementations

10. **Update Authentication Pages**
    - Apply new visual system to sign-in page
    - Apply new visual system to sign-up page
    - Ensure consistency with dashboard

11. **Transform Dashboard**
    - Apply header glassmorphism
    - Update spacing to 48px major rhythm
    - Add page transitions (400-500ms)

---

## Key Implementation Details

### Tailwind Extension Example

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          surface: 'var(--bg-surface)',
          'surface-2': 'var(--bg-surface-2)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
      },
      spacing: {
        'micro': 'var(--space-micro)',
        'major': 'var(--space-major)',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite linear',
        'fade-in-up': 'fadeInUp 300ms ease-out-cubic',
        'check-draw': 'checkDraw 500ms ease-out-cubic',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
}
```

### Theme Provider Pattern

```typescript
// components/providers/ThemeProvider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme;
    const system = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setThemeState(stored === 'system' ? system : (stored || system));
  }, []);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    const resolved = newTheme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : newTheme;
    setThemeState(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

### Checkmark Animation Pattern

```css
.checkmark {
  stroke-dasharray: 24;
  stroke-dashoffset: 24;
  transition: stroke-dashoffset 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.checkmark.checked {
  stroke-dashoffset: 0;
}
```

---

## Testing Checklist

After implementation, verify:

### Visual Quality
- [ ] Both light and dark themes are equally stunning
- [ ] All colors meet WCAG AA contrast requirements
- [ ] Spacing follows 8pt grid with 48px major rhythm
- [ ] Typography hierarchy is clear and consistent
- [ ] Shadows provide appropriate depth (4-layer system)

### Motion & Interactions
- [ ] Hover animations feel premium, not distracting
- [ ] Checkmark draw-in animation is satisfying (400-500ms)
- [ ] Page transitions are smooth (400-500ms)
- [ ] Loading shimmer animation feels premium
- [ ] Theme switch is seamless (500ms transition)

### States
- [ ] Empty states provide helpful guidance
- [ ] Loading states appear within 500ms
- [ ] Error states are clear and actionable
- [ ] Success states feel rewarding

### Responsiveness
- [ ] Mobile (320px+) layout is perfect
- [ ] Tablet (768px) layout adapts appropriately
- [ ] Desktop (1024px+) layout is optimal
- [ ] Breakpoints transition smoothly without jank

### Accessibility
- [ ] All interactive elements have visible focus indicators
- [ ] Keyboard navigation works throughout
- [ ] Reduced motion preference is respected
- [ ] ARIA labels are present where needed

---

## Common Pitfalls

1. **Adding External Libraries**: Do NOT install Framer Motion, React Spring, or similar. Use Tailwind utilities only.

2. **Heavy Animations**: Keep animations subtle. The goal is "refined minimalism," not flashy effects.

3. **Incomplete Dark Mode**: Ensure every element has a dark variant. Dark mode must be equal quality to light.

4. **Ignoring Reduced Motion**: Must test with `prefers-reduced-motion` enabled.

5. **Breaking Existing Functionality**: This is visual-only. All existing functionality must continue working.

---

## Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Visual quality | Equal/superior to Todoist, Notion, Linear | Design review panel |
| Theme transition | < 500ms | Performance profiler |
| Animation frame rate | 60fps | Performance profiler |
| Accessibility | WCAG AA compliance | Automated tools |
| Responsiveness | 320px-1920px perfect | Manual testing |

---

## Reference Documents

- **Specification**: `specs/003-flagship-ui/spec.md`
- **Research**: `specs/003-flagship-ui/research.md`
- **Data Model**: `specs/003-flagship-ui/data-model.md`
- **Design System**: `specs/003-flagship-ui/contracts/design-system.md`
- **Frontend Spec**: `specs/001-frontend-todo-ui/spec.md` (for functionality)

---

## Get Started

1. Read the Design System contract for component specifications
2. Configure Tailwind with the extended theme
3. Implement ThemeProvider first (foundation for all components)
4. Follow the implementation order above
5. Test each phase before proceeding to the next

**Remember**: This is a flagship transformation. Every pixel matters. Zero tolerance for mediocrity.
