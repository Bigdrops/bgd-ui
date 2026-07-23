# Invoice Workspaces — Delete & Create

**Date:** 2026-07-22

---

## Deleted

| Workspace | Reason |
|-----------|--------|
| Sackville | Removed per user request |
| Typeform | Removed per user request |

## Created

### 1. Runway
**Design:** Kraft paper ledger under amber desk lamp
- Cream canvas (#f8f7f5), espresso ink (#261b07), amber accent (#f9a600)
- 8px radius on cards/buttons/inputs, 4px on badges
- Warm brown-tinted shadows (rgba 38,27,7,0.06)
- Inter font, tight tracking
- Files: 12 (types, data, CSS, 8 components, index)

### 2. PostHog
**Design:** Warm paper desktop pinned to cork
- Sandy beige canvas (#e1d7c2), deep moss text (#23251d), amber accent (#eb9d2a)
- 4px radius everywhere (signature choice), 6px on windows
- NO shadows — hairline 1px borders for structure
- DM Sans + Inter fonts, tight tracking -0.025em
- Files: 12

### 3. Nuri
**Design:** Lavender art-deco bank lobby
- Lavender mist canvas (#f7f2ff), card lilac (#e2d9ff), ink-plum text (#2c232e)
- 9999px radius on buttons/inputs/pills, 48px on cards
- NO heavy shadows
- Lora serif for headings, Inter for body
- Files: 12

## Files Modified

| File | Change |
|------|--------|
| src/App.tsx | Added 3 workspace imports and registrations |

## Spec Compliance

All 3 workspaces implement Compact-behaviour.md v7.0:
- Groups with headers (name + subtotal) and footers (Add item button)
- Standalone items with section label
- Client picker with search
- Commercial settings: payment terms, discount, VAT, WHT, charges
- Totals with correct calculation order
- Notes and terms sections
- Mobile-first responsive

## Verification

- `bun run build` — passes clean, no type errors
- 5 workspace CSS chunks + 5 JS chunks isolated
- Responsive at 375px, 768px, 1024px
