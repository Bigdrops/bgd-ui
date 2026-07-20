# Invoice Workspace — UX Behavior Rules

**Version:** 1.0
**Date:** 2026-07-20
**Status:** Draft

---

## 1. Purpose

This document defines all interaction rules for the Invoice Workspace. It specifies how the interface responds to user input across keyboard, touch, and pointer devices.

---

## 2. Non-Negotiable UX Rules

| Rule | Description |
|------|-------------|
| Groups never collapse | Group containers remain open at all times |
| Individual items never collapse | Line items remain fully visible |
| Groups are containers | Groups hold items; groups are not items |
| Items are records | Items represent individual line entries |
| Groups remain visually dominant | Groups have stronger visual weight than items |
| Groups maintain their position | Adding an item never reorders the group |
| No horizontal scrolling | All content must fit within viewport width |
| Mobile is the primary experience | Design for mobile first; enhance for desktop |
| Desktop enhances mobile | Desktop adds columns and density; it does not replace mobile patterns |
| Editing is inline | All data entry happens directly in the form |
| No dialogs for editing line items | Line items edit in place; no modal forms |
| Save is an icon-only floating action button | Primary save uses a floating button with icon only |
| Dangerous actions require confirmation | Delete, clear, and similar actions require user confirmation |
| Photos use image pickers | Image selection uses native or custom image picker |
| Signatures use signature pickers | Signature capture uses dedicated signature input |
| Commercial settings appear before totals | Commercial terms section precedes the totals section |
| Totals never display incomplete additional charges | Only completed charges appear in totals |
| Issue Date and Due Date share one row | Date fields occupy a single row with two columns |
| Header fields remain compact | Header uses minimal vertical space |
| Minimum touch target is 44x44 px | All interactive elements meet minimum size |
| Every workspace owns its visual language | Each workspace defines its own colors, typography, spacing |
| No workspace imports another workspace's visual styles | Workspaces do not share CSS or design tokens |

---

## 3. Keyboard Navigation

### 3.1 Tab Order

The tab order follows this sequence:

1. Invoice title
2. Invoice number
3. Purchase order number
4. Issue date
5. Due date
6. Custom header fields (label then value)
7. Item description
8. Item sub-description
9. Quantity
10. Unit
11. Unit price
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

### 3.2 Enter Behavior

| Element | Behavior |
|---------|----------|
| Item description | Inserts newline (textarea) |
| Other inputs | No special handling |

### 3.3 Escape Behavior

| Element | Behavior |
|---------|----------|
| Client selector sheet | Closes sheet |
| Actions sheet | Closes sheet |
| Import sheet | Closes sheet |
| Column manager | Closes sheet |

---

## 4. Touch Interactions

| Interaction | Element | Behavior |
|-------------|---------|----------|
| Tap | Button | Triggers action |
| Tap | Input | Focuses, opens keyboard |
| Tap | Date picker | Opens date selection |
| Tap | Sheet trigger | Opens overlay |
| Long press | Item card | Opens context menu (future) |
| Drag | Drag handle | Reorder items/groups |
| Swipe | Sheet | Dismisses bottom sheet |

---

## 5. Sheet Behaviors

| Sheet | Trigger | Behavior |
|-------|---------|----------|
| Client selector | Tap client button | Opens full-height sheet with searchable list |
| Actions sheet | Tap actions button | Opens bottom sheet with action list |
| Import sheet | Tap Import button | Opens bottom sheet with import UI |
| Column manager | Tap Settings button | Opens bottom sheet with column toggles |

---

## 6. Collapsible Sections

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

## 7. Drag and Drop

| Rule | Description |
|------|-------------|
| Drag handle | Users drag items by the designated handle |
| Visual feedback | Dragged item shows raised elevation and shadow |
| Drop indicator | System shows drop position during drag |
| Group reordering | Groups reorder independently of items |
| Item reordering | Items reorder within their group or standalone list |

---

## 8. Focus Behavior

| Element | Focus Style | Notes |
|---------|-------------|-------|
| Text inputs | Blue border | Indicates active input |
| Buttons | Focus ring | Visible focus indicator |
| Dropdowns | Highlighted option | Current selection highlighted |
| Date pickers | Calendar opens | Focus triggers date picker |
| Sheets | Trap focus | Focus stays within open sheet |

---

## 9. Editing Rules

| Rule | Description |
|------|-------------|
| Inline editing | All fields edit in place |
| Auto-save | Changes save automatically (future) |
| Undo | Users can undo recent changes (future) |
| Validation | Fields validate on blur |
| Error display | Errors show below the invalid field |
| Error scroll | System scrolls to first error on save attempt |

---

## 10. Progressive Disclosure

| Level | Content | Trigger |
|-------|---------|---------|
| Primary | Header, line items, totals | Always visible |
| Secondary | Commercial terms, additional info | Scroll down |
| Tertiary | Collapsible sections | Tap to expand |
| Quaternary | PDF settings, actions sheet | Menu access |

---

## 11. Confirmation Flows

| Action | Confirmation Required | Message |
|--------|----------------------|---------|
| Delete item | Yes | "Remove this item?" |
| Delete group | Yes | "Remove this group? Items will be ungrouped." |
| Clear all items | Yes | "Clear all items? This cannot be undone." |
| Cancel with unsaved changes | Yes | "Discard unsaved changes?" |
| Save invoice | No | — |

---

## 12. Loading States

| Element | Behavior |
|---------|----------|
| Save button | Disabled with spinner |
| Floating save | Disabled with spinner |
| Rich text editors | Skeleton loader |
| Item image upload | Spinner during upload |
| Data fetch | Skeleton loaders for sections |

---

## 13. Error States

| Element | Behavior |
|---------|----------|
| Client field | Red border with error message |
| Empty item rows | Highlighted, scrolled to |
| Save button | Disabled with error count |
| Toast notification | Shows validation error summary |

---

## 14. Empty States

| Section | Display |
|---------|---------|
| Client | "Select a client" with dashed border |
| Line items | "No items" with "Add item" button |
| Notes | Empty editor |
| Terms | Empty editor |
| Reference links | Empty list with "Add link" button |

---

## 15. Document Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | MiMoCode | Initial creation |
