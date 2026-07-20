# Group Container Pattern

## Purpose

Provide a consistent structure for grouping line items across all workspaces.

## Structure

```
Group Container
├── Group Header
│   ├── Group name (editable)
│   ├── Item count
│   ├── Show subtotal toggle
│   └── Delete group button
├── Group Items
│   └── Line Item Card (per item)
└── Add item to group button
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Group name | Inline text | Yes | Editable title |
| Item count | Display | Yes | Shows number of items |
| Show subtotal | Toggle | Yes | Display group subtotal |
| Delete group | Button | Yes | Removes group; ungroups items |
| Add item | Button | Yes | Appends empty item |

## States

| State | Description |
|-------|-------------|
| Empty | Group with no items |
| Populated | Group with items |
| Collapsed | Only header visible (prohibited) |
| Expanded | All fields visible (required) |
| Dragging | Being reordered |
| Highlighted | Validation error |

## Behaviors

| Behavior | Rule |
|----------|------|
| Collapse | Groups never collapse (non-negotiable) |
| Items | Items always fully visible |
| Reorder | Groups reorder via drag handle |
| Delete | Requires confirmation |
| Subtotal | Calculates when toggle enabled |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Group name is editable label |
| Focus | Logical tab order |
| Screen reader | Announces group name and item count |
| Touch | Minimum 44x44 targets |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Layout | Full-width; single-column |
| Header | Compact; easy to read |
| Items | Full-width cards |
| Actions | Easy to reach with thumb |

## Do's

- Keep groups expanded at all times
- Show item count in header
- Provide clear group name
- Support drag and drop reorder
- Calculate subtotals when enabled

## Don'ts

- Collapse groups (prohibited)
- Collapse items within groups (prohibited)
- Allow group deletion without confirmation
- Hide item count
- Use tiny touch targets
