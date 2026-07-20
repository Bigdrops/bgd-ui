# Invoice Workspace — Implementation Architecture

**Version:** 1.0
**Date:** 2026-07-20
**Status:** Draft

---

## 1. Purpose

This document describes the implementation architecture for the Invoice Workspace. It defines folder structure, component hierarchy, state management, and code organization. This document does not repeat product requirements.

---

## 2. Repository Structure

```
src/
├── App.tsx                  ← Gallery + workspace switching
├── main.tsx
├── index.css                ← Tailwind/base reset only
├── gallery/
│   └── Gallery.tsx
├── types/
│   └── invoice.ts           ← Shared business types only
├── lib/
│   ├── calculations.ts
│   ├── mock-data.ts
│   └── utils.ts
└── workspaces/
    └── invoice/
        ├── amra/
        ├── prav/
        ├── sackville/
        └── <new-workspace>/
```

---

## 3. Shared Business Logic

| Module | Purpose | Export |
|--------|---------|--------|
| `types/invoice.ts` | TypeScript interfaces for invoice data | `Invoice`, `LineItem`, `LineGroup`, `CommercialSettings`, `AdditionalInfo`, `InvoiceTotals` |
| `lib/calculations.ts` | Financial calculation functions | `calculateTotals()` |
| `lib/utils.ts` | Currency formatting, ID generation | `formatCurrency()`, `generateId()` |
| `lib/mock-data.ts` | Mock data factories | `MOCK_CLIENTS`, `PAYMENT_TERMS`, `createEmptyItem()`, `createEmptyGroup()` |

---

## 4. Workspace Structure

Each workspace must contain:

| File | Purpose |
|------|---------|
| `index.ts` | Named export for workspace component |
| `index.css` | Workspace-specific styles and design tokens |
| `InvoiceWorkspace.tsx` | Main workspace component |
| `InvoiceHeader.tsx` | Header section component |
| `LineItemsSection.tsx` | Line items section component |
| `LineItemCard.tsx` | Individual line item card |
| `GroupContainer.tsx` | Group container component |
| `CommercialSettings.tsx` | Commercial terms section |
| `TotalsSection.tsx` | Totals display section |
| `AdditionalInfo.tsx` | Notes, terms, signatory section |
| `QuickActions.tsx` | Toolbar and action buttons |
| `FloatingSave.tsx` | Floating save button |
| `types.ts` | Workspace-specific types (if needed) |
| `data.ts` | Workspace-specific mock data (if needed) |

---

## 5. Component Hierarchy

```
InvoiceWorkspace (entry point)
├── Header
│   ├── Document type badge
│   ├── Client selector
│   ├── Title input
│   ├── Invoice number input
│   ├── PO number input
│   ├── Issue date input
│   ├── Due date input
│   └── Custom header fields
│
├── QuickActions (toolbar)
│   ├── Import button
│   ├── Settings button
│   └── Clear all button
│
├── LineItemsSection
│   ├── GroupContainer (per group)
│   │   ├── Group header
│   │   └── LineItemCard (per item)
│   └── LineItemCard (standalone items)
│
├── CommercialSettings
│   ├── Payment terms
│   ├── Discount (collapsible)
│   ├── VAT (collapsible)
│   ├── WHT (collapsible)
│   ├── Additional charges (collapsible)
│   └── Additional fields (collapsible)
│
├── TotalsSection
│   ├── Summary rows
│   ├── Amount in words
│   └── Grand total
│
├── AdditionalInfo
│   ├── Notes (collapsible)
│   ├── Terms (collapsible)
│   ├── Signatory (collapsible)
│   └── Reference links (collapsible)
│
└── FloatingSave
```

---

## 6. State Management

### 6.1 Primary State

| State | Type | Owner |
|-------|------|-------|
| `data` | `Invoice` | `InvoiceWorkspace` |
| `header` | `InvoiceHeader` | `InvoiceHeader` component |
| `groups` | `LineGroup[]` | `LineItemsSection` component |
| `standaloneItems` | `LineItem[]` | `LineItemsSection` component |
| `commercial` | `CommercialSettings` | `CommercialSettings` component |
| `additional` | `AdditionalInfo` | `AdditionalInfo` component |

### 6.2 State Updates

| Component | Update Method | Callback |
|-----------|---------------|----------|
| `InvoiceHeader` | `onUpdate(patch)` | Updates `data.header` |
| `LineItemsSection` | `onUpdateGroups(groups)` | Updates `data.groups` |
| `LineItemsSection` | `onUpdateStandalone(items)` | Updates `data.standaloneItems` |
| `CommercialSettings` | `onUpdate(commercial)` | Updates `data.commercial` |
| `AdditionalInfo` | `onUpdate(additional)` | Updates `data.additional` |

### 6.3 Derived State

| Value | Calculation | Source |
|-------|-------------|--------|
| `allItems` | `groups.flatMap(g => g.items)` | `data.groups` + `data.standaloneItems` |
| `subtotal` | `calculateSubtotal(allItems)` | `allItems` |
| `totals` | `calculateTotals(groups, commercial)` | `data.groups` + `data.commercial` |

---

## 7. Data Flow

```
User Input
    ↓
Component State Update
    ↓
Parent State Update (via callback)
    ↓
Derived Calculations Recompute
    ↓
UI Re-render
```

---

## 8. Lazy Loading

| Module | Load Condition | Method |
|--------|----------------|--------|
| Rich text editors | On section expand | Dynamic import |
| PDF generation | On user request | Dynamic import |
| Image upload | On file selection | Dynamic import |

---

## 9. Workspace Isolation

| Property | Rule |
|----------|------|
| CSS | Each workspace has its own `index.css` |
| Design tokens | Defined in workspace `index.css` |
| Visual styles | No cross-workspace imports |
| Business logic | Shared via `src/lib/` and `src/types/` |

---

## 10. CSS Isolation

| Property | Rule |
|----------|------|
| Scope | CSS scoped to workspace components |
| Naming | Use workspace-specific class prefixes |
| Variables | Define in workspace `index.css` |
| Tailwind | Use workspace-specific utility classes |

---

## 11. Gallery Architecture

| Property | Description |
|----------|-------------|
| Registration | Workspaces registered in `src/App.tsx` |
| Switching | Gallery component handles workspace switching |
| Isolation | Each workspace loads independently |
| Preview | Gallery shows all workspaces as cards |

---

## 12. Adding a New Workspace

| Step | Action |
|------|--------|
| 1 | Select one design reference from `docs/Designs/` |
| 2 | Create workspace folder in `src/workspaces/invoice/<name>/` |
| 3 | Implement all required components |
| 4 | Define workspace-specific CSS in `index.css` |
| 5 | Register workspace in `src/App.tsx` |
| 6 | Verify workspace compiles independently |

---

## 13. Document Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | MiMoCode | Initial creation |
