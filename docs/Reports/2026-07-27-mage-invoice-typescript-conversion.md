# Task: Convert mage-invoice.tsx to TypeScript

## Approach

1. Read the source file at `docs/Workspace-spec/Invoice/mage-invoice.tsx`
2. Read the reference file at `src/workspaces/invoice/anchor/InvoiceWorkspace.tsx`
3. Read the calculations module at `src/lib/calculations.ts`
4. Built the complete TypeScript file at `src/workspaces/invoice/mage/InvoiceWorkspace.tsx`

## Changes

| File | Change |
|------|--------|
| `src/workspaces/invoice/mage/InvoiceWorkspace.tsx` | Created from `docs/Workspace-spec/Invoice/mage-invoice.tsx` |

### Specific transformations

- Added `import { calcTotals, calcRowTotal, money } from "@/lib/calculations"` and `import "./index.css"`
- Removed inline `money` function (now imported from `@/lib/calculations`)
- Replaced inline totals `useMemo` with `calcTotals()` call
- Replaced `(Number(item.qty) || 0) * (Number(item.price) || 0)` with `calcRowTotal()` in ItemRow
- Replaced inline subtotal calculation in group header with `calcRowTotal()`
- Added TypeScript interfaces: `Section`, `Item`, `HeaderField`, `Charge`, `Bank`, `RefLink`, `ActionMenuItem`, `ActionMenuItems`
- Added inline prop type annotations to all primitive components (Card, Field, TextInput, Select, GhostButton, PrimaryButton, RowIcon, ActionMenu, Collapsible, LabelValueRow, Segmented, ItemRow, TotalRow)
- Added `type ChangeEvent` import and applied event type annotations
- Used `"divider" in it` pattern for ActionMenu type narrowing
- Widened `qty`/`price` to `number | string` in Item/Section interfaces to match existing handler behavior
- Added `type: "item"` to initial state items and all `emptyItem()` insertions into Section arrays
- Wrapped string-to-number conversions where number state setters are used (discount.value, vatRate, wht.rate, charge.value)

## Verification

- `bun run build` passes for the mage workspace
- Remaining build errors are all in the pre-existing `anchor` workspace (not modified)

## Issues

- The pre-existing `anchor` workspace has the same type errors (TypeScript strict conversion issues). These are out of scope for this task.
