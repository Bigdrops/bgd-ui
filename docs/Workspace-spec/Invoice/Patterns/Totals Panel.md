# Totals Panel Pattern

## Purpose

Provide a consistent structure for displaying financial totals across all workspaces.

## Structure

```
Totals Panel Container
├── Summary rows
├── Amount in words
└── Grand total
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Subtotal | Read-only | Yes | Sum of all line item subtotals |
| Discount | Read-only | Conditional | Shows when discount > 0 |
| VAT | Read-only | Conditional | Shows when VAT > 0 |
| Additional charges | Read-only | Conditional | Shows when charges exist |
| Install total | Read-only | Conditional | Shows when install > 0 |
| WHT | Read-only | Conditional | Shows when WHT > 0 |
| Grand total | Read-only | Yes | Final payable amount |
| Amount in words | Read-only | Yes | Currency words of grand total |

## States

| State | Description |
|-------|-------------|
| Empty | No data; shows zeros |
| Partial | Some values calculated |
| Complete | All values calculated |
| Error | Calculation error |

## Behaviors

| Behavior | Rule |
|----------|------|
| Display | Read-only; no user input |
| Update | Recalculates on any change |
| Formatting | Currency format with symbol |
| Words | Converts amount to words |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Clear row labels |
| Screen reader | Announces grand total |
| Contrast | Sufficient contrast for totals |
| Focus | Not focusable (read-only) |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Layout | Full-width; single-column |
| Font size | Grand total larger for emphasis |
| Formatting | Tabular numbers for alignment |
| Words | Wraps if needed |

## Do's

- Display grand total prominently
- Show amount in words
- Use currency formatting
- Update in real-time
- Show only relevant rows

## Don'ts

- Allow editing of totals
- Hide grand total
- Use non-standard formatting
- Show incomplete calculations
- Use tiny font for grand total
