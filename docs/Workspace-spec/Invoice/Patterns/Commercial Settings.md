# Commercial Settings Pattern

## Purpose

Provide a consistent structure for commercial terms configuration across all workspaces.

## Structure

```
Commercial Settings Container
├── Payment terms
├── Discount (collapsible)
├── VAT (collapsible)
├── WHT (collapsible)
├── Additional charges (collapsible)
└── Additional fields (collapsible)
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Payment terms | Dropdown | Yes | Workspace-specific options |
| Custom payment terms | Text | Conditional | Visible when "Custom" selected |
| Discount value | Number | No | Required when discount enabled |
| Discount type | Segmented control | Yes | Flat or Percentage |
| Discount timing | Segmented control | Yes | Before VAT or After VAT |
| VAT rate | Number | No | Percentage value |
| WHT rate | Number | No | Required when WHT enabled |
| WHT unit | Segmented control | Yes | Percentage or Flat |
| Charge label | Text | Yes | Free text |
| Charge value | Number | Yes | Must be positive |
| Tax flag | Toggle | Yes | true = taxable, false = non-taxable |
| Field label | Text | Yes | Free text |
| Field value | Text | Yes | Free text |

## States

| State | Description |
|-------|-------------|
| Default | All sections collapsed (except VAT) |
| Expanded | Section expanded by user |
| Error | Invalid field highlighted |
| Loading | Data being fetched |

## Behaviors

| Behavior | Rule |
|----------|------|
| Collapsible | All sections collapsible |
| Default state | Collapsed (except VAT) |
| Validation | Validates on blur |
| Auto-save | Changes save automatically |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Every field has visible label |
| Focus | Logical tab order |
| Errors | Linked to inputs via aria-describedby |
| Touch | Minimum 44x44 targets |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Layout | Full-width sections |
| Collapsible | Reduces vertical space |
| Input types | Appropriate keyboard types |
| Touch | Large touch targets |

## Do's

- Use collapsible sections
- Show default values clearly
- Validate on blur
- Use appropriate input types
- Provide clear labels

## Don'ts

- Show all sections expanded by default
- Use tiny touch targets
- Hide validation errors
- Use inappropriate input types
- Mix calculation order without clear indication
