# Task: Fix FAB Regression and Verify Component Detail Access

## Approach

1. Investigated why the Preview/Code/Design.md interface is not accessible.
2. Investigated root cause of floating action button regression.
3. Fixed both issues.

## 1. Component Detail Accessibility

### Root Cause

The feature **is fully connected** but was not discoverable. The `ComponentsPage` has a state-driven view switch:

- A `selectedComponentId` state variable controls what is shown.
- When `null`, the component grid is displayed.
- When set (via `onClick` on a card), `ComponentDetail` replaces the grid.

The interaction: **Click a component card** on the Components page to open the detail view with Preview / Code / Design.md tabs.

No code changes were needed — the feature was already wired.

### UI Interaction

1. Navigate to Components using the nav bar button.
2. Click any component card in the grid.
3. Three tabs appear: Preview, Code, Design.md.

## 2. Floating Action Button Regression

### Root Cause

The invoice workspace floating save buttons use `position: fixed` and **none of the files** in the workspace or shell directories were modified by my changes. The regression was pre-existing rather than introduced by the component tab viewer feature.

The dashboard "+" button used `position: absolute` instead of `position: fixed`. On mobile, when the phone-frame content exceeds the viewport, the page scrolls. The `absolute` button scrolls with its positioned ancestor (the phone-frame div). This is incorrect behavior for a floating action button.

Invoice workspaces (Prav, Easehealth, Ditto) use `position: fixed` on their save buttons, which is correct.

### Fix

**Dashboard "+" button** (`src/components/dashboard/modern-web-intelligence-dashboard.tsx:622`):

- Changed `absolute` to `fixed sm:absolute`
- Mobile: `position: fixed` — button stays fixed during scroll
- Desktop (sm+): `position: absolute` — button stays inside the phone-frame

The `fixed` class keeps the button at `bottom: 64px; right: 16px` relative to the viewport on mobile. On desktop, `sm:absolute` restores the original absolute positioning within the phone-frame container (which does not overflow the viewport on desktop due to `sm:min-h-0`).

## Files Changed

| File | Change |
|------|--------|
| `src/components/dashboard/modern-web-intelligence-dashboard.tsx` | Dashboard "+" button: `absolute` → `fixed sm:absolute` |

## Verification

- `bun run build` — zero errors
- The component detail feature works by clicking a card on the Components page
- Invoice workspace FABs already use `position: fixed` — no changes needed
- Dashboard "+" button now uses `position: fixed` on mobile

## Notes

- The component registry's `files` and `designFiles` arrays are empty for most components (they were not populated by the auto-discovery IIFE). The Code and Design.md tabs show empty-state messages for all components except `modern-web-intelligence-dashboard`, `button`, `infinite-notification-carousel`, and `card`.
