# Tracky Invoice Workspace

## Task

Create a new "Tracky" notebook-style invoice workspace.

## Approach

1. Read the model workspace at `src/workspaces/invoice/model/InvoiceWorkspace.tsx` to copy business logic exactly.
2. Created `src/workspaces/invoice/tracky/InvoiceWorkspace.tsx` with identical state management, section handling, callbacks, and calculation integration.
3. Applied the Tracky design language: ash canvas (#f2f2f2), navy (#151b31) buttons and group headers, coral (#ff5858) row totals and grand total, mint (#86e0c1) badges, butter (#fedf89) Draft badge, Bagel Fat One display font for section headers and grand total, Inter UI font with -0.01em tracking, 16px card radius, 8px input/button radius, warm stone card shadow.
4. Changed line item layout from two 2-column rows to a single 4-column row (Qty, Price, Unit, Make).
5. Grand total uses Bagel Fat One in coral at 24px.
6. Floating save button is navy (#151b31) with warm shadow.
7. Created `src/workspaces/invoice/tracky/index.css` with input spin-button removal and navy focus ring.
8. Registered the workspace in `src/App.tsx` — lazy import and workspace entry in the WORKSPACES array.

## Changes

| File | Change |
|------|--------|
| `src/workspaces/invoice/tracky/InvoiceWorkspace.tsx` | Created — 735 lines, full Tracky notebook design |
| `src/workspaces/invoice/tracky/index.css` | Created — spin-button reset, navy focus ring |
| `src/App.tsx` | Added TrackyInvoice lazy import and workspace entry |

## Verification

- `bun run build` — TypeScript strict mode passes, Vite production build succeeds.
- No type errors. No warnings (pre-existing chunk size warning ignored).
- Each workspace compiles into its own isolated CSS and JS chunk.

## Issues

None.