# Task: Add Modern Web Intelligence Dashboard

## Approach

1. Analyzed the BGD UI component library structure and the spec file at `docs/Workspace-spec/B2B-dashboard/modern-web-intelligence-dashboard.tsx`
2. Performed a dependency audit: removed `chart.js/auto`, replaced Google Fonts import with workspace-level CSS
3. Created reusable `InfiniteNotificationCarousel` component using `embla-carousel-react`
4. Adapted the spec into a self-contained `ModernWebIntelligenceDashboard` component
5. Registered the Dashboard category in the components page and Shell gallery

## Files Added

| File | Purpose |
|------|---------|
| `src/components/ui/infinite-notification-carousel.tsx` | Reusable infinite carousel with embla-carousel-react, autoplay, pagination dots |
| `src/components/dashboard/modern-web-intelligence-dashboard.tsx` | Self-contained dashboard component adapted from spec |
| `src/components/dashboard/index.css` | Workspace-level CSS with Google Fonts import, custom animations |
| `src/components/dashboard/index.ts` | Barrel export file |

## Files Modified

| File | Change |
|------|--------|
| `src/App.tsx` | Added Dashboard workspace entry and topic in Shell gallery |
| `src/pages/components/ComponentsPage.tsx` | Added 'Dashboard' category and two entries (Infinite Notification Carousel, Modern Web Intelligence Dashboard) |
| `src/lib/utils.ts` | Added missing `generateId`, `generateInvoiceNumber`, `formatCurrency` functions (shared business logic used by PRAV workspace) |
| `tailwind.config.js` | Added shadcn theme colors (`border`, `input`, `ring`, `background`, `foreground`, `primary`, `secondary`, `destructive`, `muted`, `accent`, `popover`, `card`) with CSS variable references, plus outline color and border radius extensions |
| `src/index.css` | Fixed `outline-ring/50` to use plain CSS variable reference for Tailwind v3 compatibility |

## Dependencies Removed

- `chart.js/auto` — not in package.json, not used in the component (the SVG-based sparklines and telemetry graph are dependency-free)

## Dependencies Replaced

- Google Fonts `@import url(...)` moved from inline `<style>` to workspace-level `index.css`

## Reusable Components Created

- **`InfiniteNotificationCarousel`** (`src/components/ui/infinite-notification-carousel.tsx`) — Generic infinite notification carousel using `embla-carousel-react` with:
  - `loop: true` for infinite looping
  - Autoplay every 4.5 seconds via embla API + `setInterval`
  - Pause on drag/pointer-down, resume on settle
  - Touch swipe and mouse drag (via embla)
  - Pagination dots
  - Customizable `renderSlide` prop and `onSlideAction` callback
  - Default slide renderer preserving the BIGDrops visual design

## Export Changes

- `ModernWebIntelligenceDashboard` exported from `src/components/dashboard/` (default export for lazy loading, named via barrel)
- `InfiniteNotificationCarousel` and `NotificationSlide` type exported from `src/components/ui/infinite-notification-carousel`

## Verification

- `bun run build` — zero TypeScript errors, production bundle succeeds
- Dashboard is code-split into its own chunk: `modern-web-intelligence-dashboard-*.js` (61.96 kB) and `modern-web-intelligence-dashboard-*.css` (0.92 kB)
- All existing workspaces (PRAV, EASEHEALTH, Ditto) continue to build
- Pre-existing issues that were fixed:
  - Missing `generateId`, `generateInvoiceNumber`, `formatCurrency` in `src/lib/utils.ts`
  - Missing Tailwind v3 theme color mappings needed by shadcn components
  - `outline-ring/50` opacity modifier incompatibility with oklch CSS variables

## Issues

- Pre-existing build errors in `src/lib/utils.ts` (missing utility functions) were fixed since they are shared business logic, not workspace-specific
- Pre-existing CSS build issue with `outline-ring/50` was fixed in `src/index.css`
