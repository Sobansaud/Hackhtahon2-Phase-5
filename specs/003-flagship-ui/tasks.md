# Tasks: Flagship UI Transformation

**Input**: Design documents from `/specs/003-flagship-ui/`
**Prerequisites**: plan.md (tech stack, libraries, structure), spec.md (user stories with priorities), research.md (decisions), data-model.md (entities), contracts/ (design system), quickstart.md (test scenarios)

**Tests**: The feature specification includes test requirements. Tasks include validation and testing steps.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, etc.)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/`
- Paths shown below use `frontend/` structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for flagship UI transformation

- [ ] T001 Create `frontend/lib/theme.ts` with Theme type definition and useTheme hook signature
- [ ] T002 Extend `tailwind.config.ts` with custom colors from design-system.md (bg, text, primary, success, error, accent)
- [ ] T003 [P] Extend `tailwind.config.ts` with custom spacing values (micro: 4px, major: 48px)
- [ ] T004 [P] Extend `tailwind.config.ts` with custom border radius values (xl: 16px, 2xl: 24px)
- [ ] T005 [P] Add animation keyframes to `tailwind.config.ts` (shimmer, fadeInUp, checkDraw, pulseGlow)
- [ ] T006 Create CSS variables in `frontend/app/globals.css` for all design tokens (12 color, 5 spacing, 5 border radius, 4 shadow)
- [ ] T007 Add theme transition CSS in `frontend/app/globals.css` (500ms cubic-bezier on color/transition properties)
- [ ] T008 Add reduced motion CSS media query in `frontend/app/globals.css` (all animations disabled when prefers-reduced-motion)
- [ ] T009 [P] Configure Inter font in `frontend/app/layout.tsx` via next/font/google with weights 400/500/600/700/800
- [ ] T010 Create CSS for checkmark animation (stroke-dasharray/stroke-dashoffset) in `frontend/app/globals.css`

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Create `frontend/components/providers/ThemeProvider.tsx` client component with theme detection (localStorage → system → fallback)
- [ ] T012 Implement theme persistence in ThemeProvider.tsx (save to localStorage on change)
- [ ] T013 Add theme transition class toggling in ThemeProvider.tsx (toggle 'dark' class on html element)
- [ ] T014 Create `frontend/app/layout.tsx` root layout wrapping children with ThemeProvider
- [ ] T015 [P] Create `frontend/components/ui/Button.tsx` base component with TypeScript interface
- [ ] T016 [P] Implement Button variants in Button.tsx (primary, secondary, ghost, danger) per design-system.md
- [ ] T017 [P] Add Button size variants in Button.tsx (sm, md, lg) per design-system.md
- [ ] T018 [P] Add Button loading state in Button.tsx (spinner, disabled opacity)
- [ ] T019 [P] Add Button hover/active animations in Button.tsx (micro-lift 200-300ms, shadow transitions)
- [ ] T020 [P] Create `frontend/components/ui/Input.tsx` base component with TypeScript interface
- [ ] T021 [P] Add Input focus glow in Input.tsx (ring-2 ring-indigo-500/20 per design-system.md)
- [ ] T022 [P] Add Input inner shadow in Input.tsx (inset shadow for depth)
- [ ] T023 [P] Add Input error state in Input.tsx (rose-500 border and ring)
- [ ] T024 [P] Create `frontend/components/ui/Modal.tsx` base component with TypeScript interface
- [ ] T025 Add Modal backdrop in Modal.tsx (bg-slate-900/50 backdrop-blur-md)
- [ ] T026 Add Modal content styling in Modal.tsx (rounded-2xl, shadow-xl/2xl, glassmorphism)
- [ ] T027 Add Modal entrance animation in Modal.tsx (scale 0.95→1, opacity 0→1, 300ms ease-out-cubic)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First Visual Impact (Priority: P1) 🎯 MVP

**Goal**: Users experience immediate, visceral emotional response to visual design within 5 seconds of first view

**Independent Test**: Load the application and verify instant visual delight with perfectly harmonious colors, typography, and spacing

### Implementation for User Story 1

- [ ] T028 [US1] Apply typography scale to `frontend/app/globals.css` (H1-H4 with weights 700-800, tight tracking; Body 1.7 line-height)
- [ ] T029 [US1] Apply spacing rhythm to `frontend/app/globals.css` (48px major sections, 24px medium, 8px micro)
- [ ] T030 [US1] Apply rounded-xl/2xl to all cards and containers per design philosophy
- [ ] T031 [US1] Apply 4-layer shadow system (resting, raised, elevated, floating) to all elements per design-system.md
- [ ] T032 [US1] Apply consistent visual language across all existing components (colors, spacing, shadows)

**Checkpoint**: At this point, User Story 1 (First Visual Impact) should be visually complete and testable independently

---

## Phase 4: User Story 2 - Dual-Theme Mastery (Priority: P1) 🎯 MVP

**Goal**: Users experience flawlessly designed interface in both light and dark modes with seamless transitions

**Independent Test**: Toggle between themes and verify smooth 500ms animation with all colors perfectly adapted

### Implementation for User Story 2

- [ ] T033 [US2] Create `frontend/components/ui/ThemeToggle.tsx` component with TypeScript interface
- [ ] T034 [US2] Add sun/moon icon to ThemeToggle.tsx (stroke-based, 24x24)
- [ ] T035 [US2] Add hover animation to ThemeToggle.tsx icon (subtle fill or path animation)
- [ ] T036 [US2] Implement theme toggle logic in ThemeToggle.tsx (call setTheme from useTheme)
- [ ] T037 [US2] Add ThemeToggle to `frontend/app/(dashboard)/layout.tsx` header
- [ ] T038 [US2] Verify all colors defined with CSS variables have dark theme equivalents in `frontend/app/globals.css`
- [ ] T039 [US2] Verify all shadows have dark theme equivalents in `frontend/app/globals.css`
- [ ] T040 [US2] Verify theme transition is smooth (500ms cubic-bezier) when toggling

**Checkpoint**: At this point, User Story 2 (Dual-Theme Mastery) should be fully functional and testable independently

---

## Phase 5: User Story 3 - Cinematic Motion & Micro-Interactions (Priority: P1) 🎯 MVP

**Goal**: Users experience delightful, purposeful animations that enhance clarity and joy without ever feeling distracting

**Independent Test**: Interact with all UI elements and verify hover/entrance/page transitions feel magical yet purposeful

### Implementation for User Story 3

- [ ] T041 [P] [US3] Add hover micro-lift animation to Button.tsx (scale/translate 200-300ms ease-out-cubic)
- [ ] T042 [P] [US3] Add hover micro-lift animation to Input.tsx (scale 200-300ms ease-out-cubic)
- [ ] T043 [P] [US3] Add hover micro-lift animation to TodoCard.tsx (transform -translate-y-0.5, shadow-md)
- [ ] T044 [US3] Create checkmark SVG in TodoCard.tsx with stroke-dasharray for animation
- [ ] T045 [US3] Implement checkmark draw-in animation in TodoCard.tsx (stroke-dashoffset 24→0, 400-500ms ease-out-cubic)
- [ ] T046 [US3] Add staggered entrance animation to todo list items (fadeInUp with 300ms ease-out-cubic, staggered delays)
- [ ] T047 [US3] Add page transition animation to route transitions (fade/slide 400-500ms ease-out-cubic)
- [ ] T048 [US3] Create shimmer animation in `frontend/components/ui/SkeletonCard.tsx` (shimmer 1.5s infinite)
- [ ] T049 [US3] Verify all animation durations are 300-500ms maximum for responsiveness

**Checkpoint**: At this point, User Story 3 (Cinematic Motion & Micro-Interactions) should be fully functional and testable independently

---

## Phase 6: User Story 4 - Typography & Spacing Excellence (Priority: P1) 🎯 MVP

**Goal**: Users experience flawless typography with perfect hierarchy, rhythm, and readability

**Independent Test**: Read all interface elements at various screen sizes and verify hierarchy, readability, and visual rhythm

### Implementation for User Story 4

- [ ] T050 [US4] Create Typography components (H1, H2, H3, H4, Body, Small, Tiny) in `frontend/components/ui/`
- [ ] T051 [US4] Apply heading weights (700-800) with tight letter-spacing to all heading components
- [ ] T052 [US4] Apply 1.7 line-height to Body and Small typography components
- [ ] T053 [US4] Apply text opacity hierarchy to secondary/tertiary text per design-system.md
- [ ] T054 [US4] Apply 48px+ vertical spacing rhythm between major sections
- [ ] T055 [US4] Apply 24px vertical spacing rhythm within sections
- [ ] T056 [US4] Apply 8px vertical spacing rhythm for micro elements
- [ ] T057 [US4] Verify contrast ratios exceed WCAG AA in both light and dark themes

**Checkpoint**: At this point, User Story 4 (Typography & Spacing Excellence) should be fully functional and testable independently

---

## Phase 7: User Story 5 - Depth & Glassmorphism (Priority: P2)

**Goal**: Users experience sophisticated, multi-layered interface with premium depth effects and glassmorphic elements

**Independent Test**: Examine all interface elements and verify consistent, sophisticated use of shadows and glassmorphic effects

### Implementation for User Story 5

- [ ] T058 [US5] Apply 4-layer shadow system (resting, raised, elevated, floating) to all cards in Modal.tsx
- [ ] T059 [US5] Apply glassmorphism (backdrop-blur-xl, bg-white/10, border) to Modal.tsx content
- [ ] T060 [US5] Apply glassmorphism to header in `frontend/app/(dashboard)/layout.tsx` (backdrop-blur-md, border-b)
- [ ] T061 [US5] Add inner shadow to Input.tsx recessed state (inset shadow for visual recession)
- [ ] T062 [US5] Add focus border glow animation to all interactive elements (ring-2 with theme color)
- [ ] T063 [US5] Verify multiple depth layers are visible creating 3D space perception

**Checkpoint**: At this point, User Story 5 (Depth & Glassmorphism) should be fully functional and testable independently

---

## Phase 8: User Story 6 - Icon & Visual Elements (Priority: P2)

**Goal**: Users experience custom, perfectly aligned icons that adapt elegantly to theme changes

**Independent Test**: Examine all icons across the interface and verify alignment, theme adaptation, and hover animations

### Implementation for User Story 6

- [ ] T064 [P] [US6] Create checkmark SVG in TodoCard.tsx (stroke-based, 2px stroke, centered)
- [ ] T065 [P] [US6] Add hover animation to checkmark icon in TodoCard.tsx (subtle fill or path animation)
- [ ] T066 [P] [US6] Add draw-in animation to checkmark on complete (stroke-dasharray 24, 400-500ms)
- [ ] T067 [US6] Verify all icons are perfectly aligned with adjacent text elements (vertical center)
- [ ] T068 [US6] Verify stroke-based icons adapt colors seamlessly between light and dark themes
- [ ] T069 [US6] Verify all icons use consistent stroke width (2px) and visual language

**Checkpoint**: At this point, User Story 6 (Icon & Visual Elements) should be fully functional and testable independently

---

## Phase 9: User Story 7 - State Mastery (Priority: P2)

**Goal**: Users experience sophisticated, designed states for loading, empty lists, errors, and success messages

**Independent Test**: Trigger each state type (loading, empty, error, success) and verify sophisticated visual treatment

### Implementation for User Story 7

- [ ] T070 [US7] Create `frontend/components/ui/SkeletonCard.tsx` with shimmer animation (shimmer keyframe)
- [ ] T071 [US7] Create `frontend/components/ui/EmptyState.tsx` with illustration and helpful guidance
- [ ] T072 [US7] Add EmptyState variants (no-todos, no-results, all-complete) with appropriate icons and text
- [ ] T073 [US7] Create `frontend/components/ui/Toast.tsx` component with TypeScript interface
- [ ] T074 [US7] Add Toast variants (success, error, info) with color schemes per design-system.md
- [ ] T075 [US7] Add Toast entrance animation (translate-y-8 to 0, opacity 0 to 1, 300ms ease-out-cubic)
- [ ] T076 [US7] Add Toast exit animation (opacity 1 to 0, 200ms ease-in)
- [ ] T077 [US7] Create Toast context/hook for managing toasts in `frontend/lib/toast.ts`
- [ ] T078 [US7] Apply sophisticated error visual treatment (rose colors, clear messaging, retry button)
- [ ] T079 [US7] Verify all states share same visual language as primary interface

**Checkpoint**: At this point, User Story 7 (State Mastery) should be fully functional and testable independently

---

## Phase 10: User Story 8 - Responsiveness Perfection (Priority: P2)

**Goal**: Users experience pixel-perfect, adaptive layouts across all device sizes from mobile to desktop

**Independent Test**: View the application at multiple breakpoints (320px, 375px, 768px, 1024px, 1920px) and verify perfect layout adaptation

### Implementation for User Story 8

- [ ] T080 [US8] Apply mobile layout (320px+) with touch-friendly element sizes and stacked layout
- [ ] T081 [US8] Apply tablet layout (768px) with appropriate column layouts and spacing
- [ ] T082 [US8] Apply desktop layout (1024px+) with full width and optimal multi-column layout
- [ ] T083 [US8] Ensure breakpoint transitions trigger smoothly without visual jank (CSS transitions)
- [ ] T084 [US8] Verify typography and spacing maintain proportional harmony at all sizes
- [ ] T085 [US8] Test and verify at breakpoints: 320px, 375px, 768px, 1024px, 1920px

**Checkpoint**: At this point, User Story 8 (Responsiveness Perfection) should be fully functional and testable independently

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T086 [P] Update sign-in page `frontend/app/(auth)/sign-in/page.tsx` with flagship visual system
- [ ] T087 [P] Update sign-up page `frontend/app/(auth)/sign-up/page.tsx` with flagship visual system
- [ ] T088 [P] Update dashboard page `frontend/app/(dashboard)/page.tsx` with flagship visual system
- [ ] T089 [P] Update header in `frontend/app/(dashboard)/layout.tsx` with glassmorphism and theme toggle
- [ ] T090 [P] Apply consistent visual language to all authentication pages
- [ ] T091 [P] Apply consistent visual language to all dashboard elements
- [ ] T092 Verify all interactive elements have visible focus indicators (ring-2 with glow animation)
- [ ] T093 Verify keyboard navigation works throughout the application
- [ ] T094 Verify reduced motion preference is respected (all non-essential animations disabled)
- [ ] T095 [P] Verify ARIA labels are present on all interactive elements
- [ ] T096 Verify all animations achieve 60fps on target devices
- [ ] T097 Verify theme transition completes within 500ms
- [ ] T098 Verify visual feedback appears within 200ms for all user actions
- [ ] T099 Verify all color contrast meets WCAG AA (4.5:1) in both themes
- [ ] T100 Run quickstart.md testing checklist and validate all items pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundation (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-10)**: All depend on Foundation phase completion
- **Polish (Phase 11)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 4 (P1)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 5 (P2)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 6 (P2)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 7 (P2)**: Can start after Foundation (Phase 2) - No dependencies on other stories
- **User Story 8 (P2)**: Can start after Foundation (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tasks are numbered sequentially within each story
- Tasks marked [P] can run in parallel (different files, no dependencies)
- Complete all tasks in story before marking story complete

### Parallel Opportunities

- All Setup tasks marked [P] (T003-T005, T009) can run in parallel
- All Foundation tasks marked [P] (T015-T027) can run in parallel within Phase 2
- Once Foundation phase completes, all user stories can start in parallel
- Within each story, tasks marked [P] can run in parallel
- Polish phase tasks marked [P] (T086-T091, T092-T095) can run in parallel

---

## Parallel Example: Foundation Phase

```bash
# Launch all Button component tasks together:
Task: "Create Button base component in frontend/components/ui/Button.tsx"
Task: "Implement Button variants in Button.tsx (primary, secondary, ghost, danger)"
Task: "Add Button size variants in Button.tsx (sm, md, lg)"
Task: "Add Button loading state in Button.tsx"
Task: "Add Button hover/active animations in Button.tsx"

# Launch all Input component tasks together:
Task: "Create Input base component in frontend/components/ui/Input.tsx"
Task: "Add Input focus glow in Input.tsx"
Task: "Add Input inner shadow in Input.tsx"
Task: "Add Input error state in Input.tsx"

# Launch all Modal component tasks together:
Task: "Create Modal base component in frontend/components/ui/Modal.tsx"
Task: "Add Modal backdrop in Modal.tsx"
Task: "Add Modal content styling in Modal.tsx"
Task: "Add Modal entrance animation in Modal.tsx"
```

---

## Parallel Example: User Story 6 (Icons)

```bash
# Launch all icon tasks together (different components):
Task: "Create checkmark SVG in TodoCard.tsx"
Task: "Add hover animation to checkmark icon in TodoCard.tsx"
Task: "Add draw-in animation to checkmark on complete"
```

---

## Implementation Strategy

### MVP First (User Stories 1-4 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundation (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 - First Visual Impact
4. Complete Phase 4: User Story 2 - Dual-Theme Mastery
5. Complete Phase 5: User Story 3 - Cinematic Motion
6. Complete Phase 6: User Story 4 - Typography & Spacing
7. **STOP and VALIDATE**: Test all P1 stories independently
8. Demo MVP to stakeholders if ready

### Incremental Delivery

1. Complete Setup + Foundation → Foundation ready
2. Add User Stories 1-4 (P1) → Test independently → Deploy/Demo (MVP!)
3. Add User Stories 5-6 (P2) → Test independently → Deploy/Demo
4. Add User Stories 7-8 (P2) → Test independently → Deploy/Demo
5. Polish & Cross-Cutting → Final validation → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundation together
2. Once Foundation is done:
   - Developer A: User Stories 1-2 (P1)
   - Developer B: User Stories 3-4 (P1)
   - Developer C: User Stories 5-6 (P2)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify implementation against quickstart.md testing checklist
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Zero external libraries: Do NOT install Framer Motion, React Spring, or similar
- All motion and effects via Tailwind utilities and CSS transitions only

---

## Summary

- **Total Task Count**: 100 tasks
- **Task Count by User Story**:
  - User Story 1 (First Visual Impact): 5 tasks
  - User Story 2 (Dual-Theme Mastery): 8 tasks
  - User Story 3 (Cinematic Motion): 9 tasks
  - User Story 4 (Typography & Spacing): 8 tasks
  - User Story 5 (Depth & Glassmorphism): 6 tasks
  - User Story 6 (Icon & Visual Elements): 6 tasks
  - User Story 7 (State Mastery): 10 tasks
  - User Story 8 (Responsiveness): 6 tasks
- **Setup Phase**: 10 tasks
- **Foundation Phase**: 17 tasks
- **Polish Phase**: 15 tasks
- **Parallel Opportunities Identified**: 45 tasks marked [P] can run in parallel
- **MVP Scope**: User Stories 1-4 (30 tasks) after Setup + Foundation

---

## Format Validation

- ✅ All tasks follow checklist format: `- [ ] [ID] [P?] [Story] Description`
- ✅ All Task IDs are sequential (T001-T100)
- ✅ All [P] markers indicate parallelizable tasks
- ✅ All [Story] labels map to user stories (US1-US8)
- ✅ All tasks include exact file paths
- ✅ No vague tasks present
- ✅ No same file conflicts in parallel tasks
- ✅ Each story has independent test criteria
