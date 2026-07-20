```markdown
# BIGDROPS Invoice Form — UI Components & Behavior Specification

**Version:** 1.0  
**Date:** 2026-07-20  
**Status:** Draft  
**Purpose:** Complete reference for invoice form UI components, fields, and interactions

---

## 1. Overview

This document provides a comprehensive reference for the BIGDROPS Invoice Form design. It captures every field, control, and interaction pattern present in the form interface. The document is intended for designers, developers, and product managers who need to understand or replicate the invoice form UI.

The invoice form is a mobile-first, full-screen document workspace for creating and editing invoices. It provides complete data entry for all invoice-related fields, commercial terms, line items, and document metadata.

---

## 2. Component Hierarchy

```

InvoiceFormPage (Entry Point)
├── Layout (Page wrapper)
│   └── SharedDocumentForm (Core form component)
│       ├── FormHeader
│       │   ├── Document type badge
│       │   ├── Client selector
│       │   ├── Title input
│       │   ├── Invoice number input
│       │   ├── PO number input
│       │   ├── Issue date input
│       │   ├── Due date input
│       │   └── Custom header fields
│       │
│       ├── FormLineItems
│       │   ├── Toolbar (Import, Settings, Clear)
│       │   ├── DndContext (Drag and drop)
│       │   │   ├── SortableContext
│       │   │   │   ├── MobileGroupCard (Groups)
│       │   │   │   │   ├── Group header (name, collapse, delete)
│       │   │   │   │   ├── MobileItemCard (Items in group)
│       │   │   │   │   └── Add item to group button
│       │   │   │   └── MobileItemCard (Ungrouped items)
│       │   │   └── SortableLineItem
│       │   ├── Add item button
│       │   └── Add group button
│       │
│       ├── FormCommercialTerms
│       │   ├── Payment terms dropdown
│       │   ├── Custom payment terms input
│       │   ├── Discount (collapsible)
│       │   │   ├── Value input
│       │   │   ├── Type toggle (NGN/%)
│       │   │   └── Timing toggle (Before/After VAT)
│       │   ├── VAT rate (collapsible)
│       │   ├── WHT (collapsible)
│       │   │   ├── WHT rate input
│       │   │   └── Unit toggle (%/NGN)
│       │   ├── Additional charges (collapsible)
│       │   │   ├── Charge rows (label + value + remove)
│       │   │   ├── Add charge (with tax) button
│       │   │   └── Add charge (no tax) button
│       │   └── Additional fields (collapsible)
│       │       ├── Field rows (label + value + remove)
│       │       └── Add field button
│       │
│       ├── FormTotals
│       │   ├── Summary rows (Subtotal, Discount, VAT, etc.)
│       │   ├── Amount in words display
│       │   └── Grand total display
│       │
│       ├── FormNotesTerms
│       │   ├── Invoice notes (collapsible)
│       │   │   └── RichTextEditor
│       │   ├── Terms & conditions (collapsible)
│       │   │   └── RichTextEditor
│       │   ├── Signatory (collapsible)
│       │   │   └── SignatoryPicker
│       │   └── Reference links (collapsible)
│       │       ├── Link rows (label + URL + remove)
│       │       └── Add link button
│       │
│       ├── FormFooter (Sticky)
│       │   ├── Cancel button
│       │   ├── Draft button
│       │   └── Primary save button
│       │
│       ├── ClientSelector (Sheet)
│       ├── ActionsSheet
│       ├── JsonItemsImportSheet
│       ├── ColumnManager
│       ├── IdentityLockDialog
│       └── PdfOutputSettings (PDF options only — fields listed separately)
│
└── Floating save button (FAB)

```

---

## 3. Field Inventory

### 3.1 Document Header (FormHeader)

| Field | Input Type | Label | Default | Notes |
|-------|------------|-------|---------|-------|
| Document type badge | Display | — | "Invoice" | Static badge, not user-editable |
| Document title | Text input | Title | "Invoice" | Free text |
| Invoice number | Text input | Invoice Number | Auto-generated | Create: editable; Edit: locked |
| PO number | Text input | PO Number | Empty | Optional free text |
| Issue date | Date picker | Issue Date | Today | Required |
| Due date | Date picker | Due Date | Empty | Optional |
| Custom header fields | Key-value pairs | Label + Value | Empty | Dynamic rows; add/remove |

**Client Selection:**

| Field | Input Type | Label | Default | Notes |
|-------|------------|-------|---------|-------|
| Client name | Display + Sheet | Client | — | Opens ClientSelector sheet |
| Client selector state | Button | Select a client | — | Dashed border + chevron when empty |

### 3.2 Line Items (FormLineItems)

**Toolbar:**

| Control | Type | Label | Behavior |
|---------|------|-------|----------|
| Import JSON | Button | Import | Opens import sheet |
| Column settings | Button | Settings | Opens ColumnManager |
| Clear all | Button | Clear | Opens confirmation dialog |

**MobileItemCard Fields:**

| Field | Input Type | Label | Required | Notes |
|-------|------------|-------|----------|-------|
| Description | Textarea | Description | Yes | Multi-line with autocomplete |
| Sub-description | Textarea | Sub-description | No | Collapsible, optional |
| Item image | File upload | Image | No | Cloudinary upload, preview with remove |
| Quantity | Number | Qty | No | Default 1, min 0 |
| Unit | Text input | Unit | No | Free text with suggestions |
| Unit price | Number | Rate | No | Default 0, min 0 |
| Make | Text input | Make | No | Visibility controlled by column config |
| Part number | Text input | Part No. | No | Visibility controlled by column config |
| Condition | Text input | Condition | No | Visibility controlled by column config |
| Install rate | Number | Install Rate | No | Auto-calculated or manual override |
| VAT rate | Number | VAT % | No | Row-level override |
| Discount rate | Number | Discount % | No | Row-level override |
| Custom columns | Dynamic | Varies | Varies | User-defined with configurable types |

**Item Actions (via card controls):**

| Action | Trigger | Behavior |
|--------|---------|----------|
| Move up | Button | Reorder within list |
| Move down | Button | Reorder within list |
| Insert below | Button | Add empty item after current |
| Duplicate | Action sheet | Copy current item |
| Remove | Button | Delete item |
| Drag handle | Drag | Reorder via drag and drop |

**MobileGroupCard Fields:**

| Field | Input Type | Behavior |
|-------|------------|----------|
| Group name | Inline text | Editable title |
| Collapse/expand | Toggle | Show/hide items in group |
| Show subtotal | Toggle | Display group subtotal |
| Delete group | Button | Removes group, ungroups items |
| Add item to group | Button | Appends empty item |

### 3.3 Commercial Terms (FormCommercialTerms)

**Payment Terms:**

| Field | Input Type | Options |
|-------|------------|---------|
| Payment terms | Dropdown | Custom, Net 7, Net 14, Net 30, Due on Receipt |
| Custom payment terms | Text input | Free text (visible when "Custom" selected) |

**Discount (collapsible):**

| Field | Input Type | Default | Options |
|-------|------------|---------|---------|
| Discount value | Number | 0 | — |
| Discount type | Segmented control | NGN | NGN, % |
| Discount timing | Segmented control | After VAT | After VAT, Before VAT |

**VAT Rate (collapsible):**

| Field | Input Type | Default |
|-------|------------|---------|
| VAT rate | Number | 0 |

**WHT (collapsible):**

| Field | Input Type | Default | Options |
|-------|------------|---------|---------|
| WHT rate | Number | 0 | — |
| WHT unit | Segmented control | % | %, NGN |

**Additional Charges (collapsible):**

| Field | Input Type | Required | Notes |
|-------|------------|----------|-------|
| Charge label | Text | Yes | Free text |
| Charge value | Number | Yes | — |
| Remove charge | Button | — | Deletes row |

| Controls | Label | Behavior |
|----------|-------|----------|
| Add charge (with tax) | Button | Adds row with tax flag = true |
| Add charge (no tax) | Button | Adds row with tax flag = false |

**Additional Fields (collapsible):**

| Field | Input Type |
|-------|------------|
| Field label | Text |
| Field value | Text |
| Remove field | Button |
| Add field | Button |

### 3.4 Totals (FormTotals)

| Element | Display Type | Label | Notes |
|---------|--------------|-------|-------|
| Subtotal | Read-only | Subtotal | Sum of all item subtotals |
| Discount | Read-only | Discount | Applied based on type/timing |
| VAT | Read-only | VAT | Computed on taxable base |
| Taxable extra charges | Read-only | Extra Charges (Taxable) | Charges with tax flag |
| Non-taxable extra charges | Read-only | Extra Charges (Non-Taxable) | Charges without tax flag |
| Install rate total | Read-only | Install Rate Total | Sum of install rates |
| WHT | Read-only | WHT | Computed on total minus VAT |
| Grand total | Read-only | Grand Total | Final payable amount |
| Amount in words | Read-only | Amount in Words | Naira words of grand total |

### 3.5 Notes & Terms (FormNotesTerms)

**Invoice Notes (collapsible):**

| Field | Input Type | Notes |
|-------|------------|-------|
| Invoice notes | RichTextEditor | HTML content, lazy loaded |

**Terms & Conditions (collapsible):**

| Field | Input Type | Notes |
|-------|------------|-------|
| Terms & conditions | RichTextEditor | HTML content, lazy loaded |

**Signatory (collapsible):**

| Field | Input Type | Behavior |
|-------|------------|----------|
| Signatory | SignatoryPicker | Opens selection sheet, displays name + role |

**Reference Links (collapsible):**

| Field | Input Type |
|-------|------------|
| Link label | Text |
| Link URL | Text |
| Remove link | Button |
| Add link | Button |

### 3.6 Footer (FormFooter)

| Control | Type | Label | Behavior |
|---------|------|-------|----------|
| Cancel | Button | Cancel | Navigates away |
| Save as draft | Button | Save as Draft | Saves with 'unpaid' status |
| Primary save | Button | Create Invoice | Primary action |
| Floating save | Button (FAB) | Save | Same as primary, fixed bottom-right |

### 3.7 Actions Sheet

| Action | Label | Behavior |
|--------|-------|----------|
| Save draft | Save as Draft | Saves document |
| Cancel | Cancel | Navigates away |
| Column manager | Manage Columns | Opens ColumnManager |
| Import JSON | Import from JSON | Opens import sheet |
| Toggle qty/unit merge | Merge Qty/Unit | Switches display mode |
| Add group | Add Group | Creates new group |
| Scroll to additional info | Additional Info | Scrolls to notes section |
| Scroll to links | Links | Scrolls to links section |

### 3.8 PDF Output Settings

| Control | Type | Label | Behavior |
|---------|------|-------|----------|
| Show bank details | Toggle | Show Bank Details | Controls visibility in PDF |
| Select bank account | Dropdown | Bank Account | Selects which account to show |
| Show footer | Toggle | Show Footer | Controls visibility in PDF |
| Show tagline | Toggle | Show Tagline | Controls visibility in PDF |
| Show balance due | Toggle | Show Balance Due | Controls visibility in PDF |
| Show amount in words | Toggle | Show Amount in Words | Controls visibility in PDF |
| Show VAT % | Toggle | Show VAT % | Controls visibility in PDF |
| Show WHT % | Toggle | Show WHT % | Controls visibility in PDF |
| Show discount % | Toggle | Show Discount % | Controls visibility in PDF |
| Compact mode | Toggle | Compact Mode | PDF layout option |
| Landscape orientation | Toggle | Landscape | PDF orientation |

---

## 4. Interaction Patterns

### 4.1 Keyboard Navigation

**Tab Order:**

1. Invoice title
2. Invoice number
3. PO number
4. Issue date
5. Due date
6. Custom header fields (label → value)
7. Item description
8. Item sub-description
9. Quantity
10. Unit
11. Rate
12. Payment terms
13. Custom payment terms
14. Discount value
15. VAT rate
16. WHT rate
17. Extra charge fields
18. Additional field fields
19. Notes editor
20. Terms editor
21. Signatory picker
22. Reference link fields

**Enter Behavior:**
- Item description: Inserts newline (textarea)
- Other inputs: No special handling

**Escape Behavior:**
- Closes sheets (ClientSelector, ActionsSheet, ImportSheet, ColumnManager)

### 4.2 Touch Interactions

| Interaction | Element | Behavior |
|-------------|---------|----------|
| Tap | Button | Triggers action |
| Tap | Input | Focuses, opens keyboard |
| Tap | Date picker | Opens date selection |
| Tap | Sheet trigger | Opens overlay |
| Long press | Item card | Opens context menu (future) |
| Drag | Drag handle | Reorder items/groups |
| Swipe | Sheet | Dismisses bottom sheet |

### 4.3 Sheet Behaviors

| Sheet | Trigger | Behavior |
|-------|---------|----------|
| ClientSelector | Tap client button | Opens full-height sheet, searchable list |
| ActionsSheet | Tap actions button | Opens bottom sheet with action list |
| JsonItemsImportSheet | Tap Import button | Opens bottom sheet with import UI |
| ColumnManager | Tap Settings button | Opens bottom sheet with column toggles |

### 4.4 Collapsible Sections

| Section | Default State | Trigger |
|---------|---------------|---------|
| Discount | Closed | Tap header |
| VAT | Closed | Tap header |
| WHT | Closed | Tap header |
| Additional charges | Closed | Tap header |
| Additional fields | Closed | Tap header |
| Invoice notes | Open | Tap header |
| Terms & conditions | Closed | Tap header |
| Signatory | Closed | Tap header |
| Reference links | Closed | Tap header |

---

## 5. Form States

### 5.1 Empty State (Create Mode)

| Section | State |
|---------|-------|
| Client | "Select a client" with dashed border |
| Items | "No items" empty state with "Add item" button |
| Invoice number | Auto-generated |
| Issue date | Today's date |
| Commercial terms | All default values |
| Notes & terms | Empty editors |

### 5.2 Filled State

| Section | State |
|---------|-------|
| Client | Client name displayed |
| Items | Item cards with content |
| Invoice number | Generated or user-entered |
| Dates | Selected dates |
| Commercial terms | Configured values |
| Notes & terms | Rich text content |

### 5.3 Edit Mode

| Section | State |
|---------|-------|
| Client | Locked — shows lock icon, opens IdentityLockDialog |
| Invoice number | Locked — shows lock icon, opens IdentityLockDialog |
| All other fields | Editable |

### 5.4 Error State

| Field | Behavior |
|-------|----------|
| Client | Highlighted red, error message below |
| Empty item rows | Highlighted and scrolled to |
| Save button | Disabled, shows errors |
| Toast notification | Shows validation error summary |

### 5.5 Loading State

| Element | Behavior |
|---------|----------|
| Save button | Disabled, loading spinner |
| FAB | Disabled, loading spinner |
| Rich text editors | Skeleton loader |
| Item image | Loading spinner during upload |
| Data fetching | Skeleton loaders |

---

## 6. Conditional Display Rules

### 6.1 Field Visibility

| Condition | Shows/Hides |
|-----------|-------------|
| Quotation mode | Labels change (Invoice → Quotation) |
| Edit mode | Identity fields locked |
| Create mode | Identity fields editable |
| Custom columns enabled | Additional fields visible |
| Item image uploaded | Preview shown, remove button appears |
| Sub-description present | Details section expanded |
| Suggestions available | Autocomplete dropdown shown |

### 6.2 Section Visibility

| Condition | Shows/Hides |
|-----------|-------------|
| Group exists | Group header with item count |
| Items exist | Clear all button visible |
| No items | Empty state with add button |
| Invalid row | Highlighted, scrolled to |

### 6.3 Button States

| Button | Enabled/Disabled |
|--------|------------------|
| Save | Enabled when valid, disabled when invalid |
| Draft | Always enabled (no validation) |
| Clear all | Enabled when items exist, disabled when empty |
| Remove item | Enabled when item exists |
| Add item | Always enabled |
| Import | Always enabled |

---

## 7. Layout & Spacing

### 7.1 Page Structure

```

┌─────────────────────────────────────────────────────────────────┐
│ Layout (hidePageHeader, immersive)                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ SharedDocumentForm                                        │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ FormHeader                                          │  │  │
│  │  │ • Document type badge                               │  │  │
│  │  │ • Client selector                                   │  │  │
│  │  │ • Title input                                       │  │  │
│  │  │ • Number + PO inputs                                │  │  │
│  │  │ • Date inputs                                       │  │  │
│  │  │ • Custom header fields                              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ FormLineItems                                       │  │  │
│  │  │ • Toolbar (Import / Settings / Clear)               │  │  │
│  │  │ • Item cards (sortable)                             │  │  │
│  │  │ • Group cards (collapsible)                         │  │  │
│  │  │ • Add item / Add group buttons                      │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ FormCommercialTerms                                 │  │  │
│  │  │ • Payment terms                                     │  │  │
│  │  │ • Discount (collapsible)                            │  │  │
│  │  │ • VAT (collapsible)                                 │  │  │
│  │  │ • WHT (collapsible)                                 │  │  │
│  │  │ • Extra charges (collapsible)                       │  │  │
│  │  │ • Additional fields (collapsible)                   │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ FormTotals                                          │  │  │
│  │  │ • Summary rows                                      │  │  │
│  │  │ • Amount in words                                   │  │  │
│  │  │ • Grand total                                       │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ FormNotesTerms                                      │  │  │
│  │  │ • Notes (collapsible)                               │  │  │
│  │  │ • Terms (collapsible)                               │  │  │
│  │  │ • Signatory (collapsible)                           │  │  │
│  │  │ • Reference links (collapsible)                     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ FormFooter (sticky)                                 │  │  │
│  │  │ • Cancel / Draft / Save buttons                     │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Floating Save Button (FAB)                          │  │  │
│  │  │ • Fixed bottom-right                                │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

```

### 7.2 Sticky Elements

| Element | Position | Behavior |
|---------|----------|----------|
| FormFooter | Bottom | Sticks to bottom with backdrop blur |
| Floating save FAB | Bottom-right | Fixed position, above footer |

### 7.3 Spacing

| Section | Spacing |
|---------|---------|
| Between sections | 16px (1rem) |
| Between fields | 8px (0.5rem) |
| Within cards | 12px (0.75rem) |
| Card padding | 16px (1rem) |
| Page padding | 16px (1rem) |

### 7.4 Mobile Adaptation

| Element | Desktop | Mobile |
|---------|---------|--------|
| Layout | Multi-column | Single-column |
| Item cards | Full width | Full width |
| Tables | Table view | Card list |
| Sheets | Modal | Bottom sheet |
| Touch targets | 44px min | 44px min |

---

## 8. Component States

### 8.1 Input States

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Normal border | Editable |
| Focused | Blue border | Keyboard open, suggestions shown |
| Filled | Normal border | Value present |
| Error | Red border | Error message below |
| Disabled | Grayed out | Not interactive |
| Locked | Grayed + lock icon | Not editable, shows tooltip |

### 8.2 Button States

| State | Visual | Behavior |
|-------|--------|----------|
| Default | Standard button | Clickable |
| Hover (desktop) | Slightly darker | — |
| Active | Pressed state | Trigger action |
| Disabled | Grayed out | Not clickable |
| Loading | Spinner | Not clickable |

### 8.3 Sheet States

| State | Behavior |
|-------|----------|
| Closed | Hidden |
| Opening | Animate in from bottom |
| Open | Full or partial visibility |
| Closing | Animate out |

### 8.4 Card States

| State | Behavior |
|-------|----------|
| Default | Normal visibility |
| Dragging | Raised, shadow, transparent |
| Collapsed | Only header visible |
| Expanded | All fields visible |
| Highlighted | Validation error border |

---

## 9. Visual Hierarchy

### 9.1 Typography

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | 2xl | Semibold | Primary |
| Section headers | lg | Medium | Primary |
| Field labels | sm | Medium | Muted |
| Field values | sm | Regular | Primary |
| Totals | base → lg | Medium → Bold | Primary |
| Grand total | xl → 2xl | Bold | Primary |
| Amount in words | sm | Regular | Muted |
| Badges | xs | Medium | Varies |

### 9.2 Color Usage

| Element | Color | Purpose |
|---------|-------|---------|
| Primary | Blue | CTAs, focus indicators |
| Destructive | Red | Warnings, danger actions |
| Success | Green | Confirmation, success states |
| Muted | Gray | Secondary text, disabled |
| Accent | Brand color | Accents, highlights |

### 9.3 Badge Variants

| Variant | Use Case |
|---------|----------|
| Default | Invoice, Active status |
| Secondary | Quotation, Pending |
| Destructive | Suspended, Error |
| Outline | Archived, Inactive |

---

## 10. Success Criteria (Design Reference)

- [ ] All fields listed in this document are present in the form
- [ ] Each field has the correct input type and behavior
- [ ] Collapsible sections toggle correctly
- [ ] Sheets open with correct content
- [ ] Edit mode locks identity fields with lock icon
- [ ] Create mode allows all fields to be edited
- [ ] Totals display all financial values
- [ ] Amount in words is displayed below totals
- [ ] Touch targets meet 44×44 minimum
- [ ] Layout is mobile-first
- [ ] Loading and error states are represented
- [ ] All buttons have appropriate states

---

## 11. Document Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | MiMoCode | Initial creation |

---

This document serves as the authoritative reference for the BIGDROPS Invoice Form UI design. It captures every field, control, and interaction pattern present in the interface, making it suitable for design replication, development reference, and product documentation.
```