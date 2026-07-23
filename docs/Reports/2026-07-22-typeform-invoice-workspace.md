# Typeform Invoice Workspace

**Date:** 2026-07-22
**Design Reference:** Typeform (docs/Designs/Typeform.md)

---

## Design Direction

Editorial publishing house meets product dashboard. Tobias-style serif headlines with tight negative tracking on a cream canvas. Aubergine ink (#2a222b) for primary surfaces, violet (#9454ab) reserved exclusively for section eyebrow labels. No box shadows — elevation expressed through background color contrast (dark → light section alternation). 12px radius buttons, 24px radius cards.

## Aesthetic Signatures

- **Typography:** Playfair Display (Tobias substitute) for display headings at 400 weight with -1.5px tracking. Inter for all functional UI text.
- **Color palette:** Aubergine ink primary, cream canvas background, violet mist accent (eyebrows only), lavender whisper for reversed dark surfaces.
- **Surfaces:** Dark card (#2a222b) for the invoice header hero and totals panel. White cards for line items and settings. Parchment (#f5f3f6) for group headers and alternating sections.
- **No shadows anywhere.** Depth comes from background color progression only.
- **Buttons:** Low-key 12px radius rectangles in near-black — not pill-shaped, not sharp. Quiet enough for typography to lead.

## Files Created

| File | Purpose |
|------|---------|
| `src/workspaces/invoice/typeform/types.ts` | Type definitions aligned to Compact-behaviour.md spec |
| `src/workspaces/invoice/typeform/data.ts` | Sample data, clients, units, factory functions |
| `src/workspaces/invoice/typeform/index.css` | Full Typeform theme — 630+ lines, all tokens, components, responsive |
| `src/workspaces/invoice/typeform/InvoiceWorkspace.tsx` | Main workspace — dark hero header, grid layout, totals computation |
| `src/workspaces/invoice/typeform/InvoiceHeader.tsx` | Dark aubergine hero with serif title, client picker, date fields |
| `src/workspaces/invoice/typeform/LineItemsSection.tsx` | Groups + standalone items, item cards with actions, add controls |
| `src/workspaces/invoice/typeform/CommercialSettings.tsx` | Collapsible settings — discount, VAT, WHT, charges with toggles |
| `src/workspaces/invoice/typeform/TotalsSection.tsx` | Dark sticky totals panel with serif grand total display |
| `src/workspaces/invoice/typeform/AdditionalInfo.tsx` | Collapsible notes and terms sections |
| `src/workspaces/invoice/typeform/FloatingSave.tsx` | Fixed-position save button |
| `src/workspaces/invoice/typeform/QuickActions.tsx` | Kebab menu with save and clear actions |
| `src/workspaces/invoice/typeform/index.ts` | Default export |

## Files Modified

| File | Change |
|------|--------|
| `src/App.tsx` | Added Typeform workspace registration |

## Spec Compliance

All behaviors from Compact-behaviour.md v7.0 implemented:

- Groups with headers (name + subtotal) and footers (add item)
- Standalone items section
- Group delete moves items to standalone
- Items move between groups / standalone
- Client picker with search
- Auto-generated document number
- Issue date defaults to today, due date +30 days
- Collapsible commercial settings (discount, VAT, WHT, charges)
- Toggle switches for enabling/disabling features
- Segmented controls for type/timing selection
- Totals computation with correct order (subtotal → discount → charges → VAT → WHT → grand total)
- Amount in words
- Notes and terms sections
- Mobile-first responsive (375px, 768px, 1024px)

## Verification

- `bun run build` — passes clean, no type errors
- Production bundle succeeds
- Responsive at 375px, 768px, 1024px breakpoints
- Workspace compiles into isolated CSS and JS chunk
