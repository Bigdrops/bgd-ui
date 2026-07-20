# Line Item Card Pattern

## Purpose

Provide a consistent structure for line item entry cards across all workspaces.

## Structure

```
Item Card Container
├── Description (required)
├── Sub-description (optional)
├── Image (optional)
├── Quantity + Unit + Price
├── Optional fields (configurable)
└── Actions
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Description | Textarea | Yes | Multi-line with autocomplete |
| Sub-description | Textarea | No | Collapsible, optional |
| Image | File upload | No | Preview with remove option |
| Quantity | Number | No | Default: 1 |
| Unit | Text | No | Free text with suggestions |
| Unit price | Number | No | Default: 0 |
| Make | Text | No | Configurable visibility |
| Part number | Text | No | Configurable visibility |
| Condition | Text | No | Configurable visibility |
| Install rate | Number | No | Auto-calculated or manual |
| VAT rate | Number | No | Row-level override |
| Discount rate | Number | No | Row-level override |
| Custom columns | Dynamic | Varies | User-defined |

## States

| State | Description |
|-------|-------------|
| Empty | No data entered; shows required markers |
| Partial | Some fields filled |
| Complete | All required fields filled |
| Error | Validation errors present |
| Dragging | Being reordered |
| Highlighted | Validation error; scrolled to |

## Behaviors

| Behavior | Rule |
|----------|------|
| Layout | Single-column card |
| Editing | Inline editing; no modals |
| Actions | Accessible via card controls |
| Reorder | Drag handle or move buttons |
| Delete | Requires confirmation |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Every input has visible label |
| Focus | Logical tab order within card |
| Errors | Linked to inputs via aria-describedby |
| Touch | Minimum 44x44 targets |
| Screen reader | Card announces item number |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Touch targets | Minimum 44x44 CSS pixels |
| Input size | Full-width; 16px minimum font |
| Actions | Easy to reach with thumb |
| Keyboard | Appropriate input types |
| Images | Tap to upload; preview inline |

## Do's

- Use full-width layout
- Provide clear field labels
- Show validation errors inline
- Support drag and drop reorder
- Allow image upload with preview

## Don'ts

- Use multi-column layouts
- Hide required field indicators
- Use tiny touch targets
- Require modals for editing
- Lose data on accidental tap
