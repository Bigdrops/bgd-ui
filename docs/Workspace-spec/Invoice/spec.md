# Invoice Workspace — Product Specification

**Version:** 1.0
**Date:** 2026-07-20
**Status:** Draft

---

## 1. Purpose

This document specifies the Invoice Workspace product requirements. It defines every field, control, and capability the invoice form must provide. This document does not reference implementation details.

---

## 2. Document Structure

The Invoice Workspace contains five primary sections:

| Section | Purpose |
|---------|----------|
| Header | Document metadata, client selection, dates |
| Line Items | Product or service entries with quantities and prices |
| Commercial Terms | Payment terms, discounts, taxes, additional charges |
| Totals | Financial summary with grand total |
| Additional Info | Notes, terms, signatory, reference links |

---

## 3. Header Section

### 3.1 Document Identity

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Document type badge | Display | Yes | "Invoice" | Not user-editable |
| Document title | Text | Yes | "Invoice" | Free text |
| Invoice number | Text | Yes | Auto-generated | Editable in create mode; locked in edit mode |
| Purchase order number | Text | No | Empty | Free text |

### 3.2 Client Selection

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Client | Selection | Yes | Opens client selector sheet |
| Client selector (empty state) | Button | — | Shows "Select a client" with dashed border |

### 3.3 Dates

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Issue date | Date | Yes | Today | Must not be empty |
| Due date | Date | No | Empty | Optional |

### 3.4 Custom Header Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Field label | Text | Yes | Free text |
| Field value | Text | Yes | Free text |
| Add field | Button | — | Adds new key-value row |
| Remove field | Button | — | Removes row |

---

## 4. Line Items Section

### 4.1 Item Fields

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| Description | Textarea | Yes | Empty | Multi-line with autocomplete |
| Sub-description | Textarea | No | Empty | Optional, collapsible |
| Image | File upload | No | Empty | Preview with remove option |
| Quantity | Number | No | 1 | Minimum: 0 |
| Unit | Text | No | Empty | Free text with suggestions |
| Unit price | Number | No | 0 | Minimum: 0 |
| Make | Text | No | Empty | Visibility controlled by column config |
| Part number | Text | No | Empty | Visibility controlled by column config |
| Condition | Text | No | Empty | Visibility controlled by column config |
| Install rate | Number | No | 0 | Auto-calculated or manual override |
| VAT rate | Number | No | 0 | Row-level override |
| Discount rate | Number | No | 0 | Row-level override |
| Custom columns | Dynamic | Varies | Varies | User-defined with configurable types |

### 4.2 Item Actions

| Action | Trigger | Behavior |
|--------|---------|----------|
| Move up | Button | Reorder within list |
| Move down | Button | Reorder within list |
| Insert below | Button | Add empty item after current |
| Duplicate | Action sheet | Copy current item |
| Remove | Button | Delete item |
| Drag | Drag handle | Reorder via drag and drop |

### 4.3 Group Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Group name | Inline text | Yes | Editable title |
| Collapse/expand | Toggle | — | Show/hide items in group |
| Show subtotal | Toggle | — | Display group subtotal |
| Delete group | Button | — | Removes group, ungroups items |
| Add item to group | Button | — | Appends empty item |

### 4.4 Toolbar Controls

| Control | Type | Label | Behavior |
|---------|------|-------|----------|
| Import JSON | Button | Import | Opens import sheet |
| Column settings | Button | Settings | Opens column manager |
| Clear all | Button | Clear | Opens confirmation dialog |
| Add item | Button | Add Item | Appends empty item |
| Add group | Button | Add Group | Creates new group |

---

## 5. Commercial Terms Section

### 5.1 Payment Terms

| Field | Type | Options | Notes |
|-------|------|---------|-------|
| Payment terms | Dropdown | Custom, Net 7, Net 14, Net 30, Due on Receipt | Required |
| Custom payment terms | Text | — | Visible when "Custom" selected |

### 5.2 Discount

| Field | Type | Default | Options | Notes |
|-------|------|---------|---------|-------|
| Discount value | Number | 0 | — | Required when discount enabled |
| Discount type | Segmented control | Flat | Flat, Percentage | Toggle between NGN and % |
| Discount timing | Segmented control | After VAT | After VAT, Before VAT | Controls calculation order |

### 5.3 VAT

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| VAT rate | Number | 0 | Percentage value |

### 5.4 WHT (Withholding Tax)

| Field | Type | Default | Options | Notes |
|-------|------|---------|---------|-------|
| WHT rate | Number | 0 | — | Required when WHT enabled |
| WHT unit | Segmented control | Percentage | Percentage, Flat | Toggle between % and NGN |

### 5.5 Additional Charges

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Charge label | Text | Yes | Free text |
| Charge value | Number | Yes | Must be positive |
| Tax flag | Toggle | — | true = taxable, false = non-taxable |
| Remove charge | Button | — | Deletes row |
| Add charge (with tax) | Button | — | Adds row with tax flag = true |
| Add charge (no tax) | Button | — | Adds row with tax flag = false |

### 5.6 Additional Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Field label | Text | Yes | Free text |
| Field value | Text | Yes | Free text |
| Remove field | Button | — | Removes row |
| Add field | Button | — | Adds new row |

---

## 6. Totals Section

| Element | Type | Label | Notes |
|---------|------|-------|-------|
| Subtotal | Read-only | Subtotal | Sum of all item subtotals |
| Discount | Read-only | Discount | Applied based on type and timing |
| VAT | Read-only | VAT | Computed on taxable base |
| Taxable extra charges | Read-only | Extra Charges (Taxable) | Charges with tax flag |
| Non-taxable extra charges | Read-only | Extra Charges (Non-Taxable) | Charges without tax flag |
| Install rate total | Read-only | Install Rate Total | Sum of install rates |
| WHT | Read-only | WHT | Computed on total minus VAT |
| Grand total | Read-only | Grand Total | Final payable amount |
| Amount in words | Read-only | Amount in Words | Naira words of grand total |

---

## 7. Additional Info Section

### 7.1 Invoice Notes

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Notes | Rich text | No | HTML content |

### 7.2 Terms & Conditions

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Terms | Rich text | No | HTML content |

### 7.3 Signatory

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Signatory | Selection | No | Opens selection sheet; displays name and role |

### 7.4 Reference Links

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Link label | Text | Yes | Free text |
| Link URL | Text | Yes | URL format |
| Remove link | Button | — | Removes row |
| Add link | Button | — | Adds new row |

---

## 8. Footer Controls

| Control | Label | Behavior |
|---------|-------|----------|
| Cancel | Cancel | Navigates away |
| Save as draft | Save as Draft | Saves with "unpaid" status |
| Primary save | Create Invoice | Primary action |
| Floating save | Save | Same as primary, fixed position |

---

## 9. Actions Sheet

| Action | Label | Behavior |
|--------|-------|----------|
| Save draft | Save as Draft | Saves document |
| Cancel | Cancel | Navigates away |
| Column manager | Manage Columns | Opens column manager |
| Import JSON | Import from JSON | Opens import sheet |
| Toggle qty/unit merge | Merge Qty/Unit | Switches display mode |
| Add group | Add Group | Creates new group |
| Scroll to additional info | Additional Info | Scrolls to notes section |
| 
