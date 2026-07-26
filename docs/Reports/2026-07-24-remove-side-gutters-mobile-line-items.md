# Remove Side Gutters for Mobile Line Items

Date: 2026-07-24

## Task

Remove horizontal padding from EASEHEALTH and Ditto workspace line-item containers on mobile devices. Line items must extend edge-to-edge, touching the screen wall.

## Approach

1. Add a CSS class (`.esh-container`, `.dit-container`) to the main container div in each workspace's `InvoiceWorkspace.tsx`.
2. Add `@media (max-width: 640px)` overrides in each workspace's `index.css`:
   - Remove `padding-left` and `padding-right` (set to `0 !important`).
   - Force `max-width: 100%`.
   - Set `border-radius: 0` on cards and remove left/right borders so the cards sit flush against the screen edge.
3. Desktop (`min-width: 641px`) is not affected — centered layout with original padding is preserved.

## Changes

| File | Change |
|------|--------|
| `src/workspaces/invoice/easehealth/InvoiceWorkspace.tsx` | Added `className="esh-container"` to main content div |
| `src/workspaces/invoice/easehealth/index.css` | Added `@media (max-width: 640px)` override block |
| `src/workspaces/invoice/ditto/InvoiceWorkspace.tsx` | Added `className="dit-container"` to main content div |
| `src/workspaces/invoice/ditto/index.css` | Added `@media (max-width: 640px)` override block |

## Verification

- `bun run build` — exit 0, 0 errors.
- No other workspaces or shell files were modified.

## Issues

None.
