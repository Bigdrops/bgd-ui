# Header Fields Pattern

## Purpose

Provide a consistent structure for document header sections across all workspaces.

## Structure

```
Header Container
├── Document type badge
├── Document title
├── Identity fields (number, PO)
├── Date fields
└── Custom fields
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Document type badge | Display | Yes | Static, non-editable |
| Document title | Text | Yes | Free text |
| Identity fields | Text | Varies | Workspace-specific |
| Date fields | Date | Varies | Workspace-specific |
| Custom fields | Dynamic | No | User-defined key-value pairs |

## States

| State | Description |
|-------|-------------|
| Create | All fields editable |
| Edit | Identity fields locked |
| Read-only | All fields locked |
| Error | Invalid field highlighted |

## Behaviors

| Behavior | Rule |
|----------|------|
| Layout | Compact, single-column on mobile |
| Field order | Logical grouping by function |
| Validation | Validates on blur |
| Lock | Identity fields lock on edit |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Every field has visible label |
| Focus | Logical tab order |
| Errors | Linked to inputs |
| Touch | Minimum 44x44 targets |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Density | Compact layout; minimal vertical space |
| Field size | Full-width inputs |
| Date pickers | Native date inputs |
| Keyboard | Appropriate input types |

## Do's

- Keep header compact
- Group related fields
- Use appropriate input types
- Provide clear labels
- Show locked state clearly

## Don'ts

- Use excessive vertical space
- Hide labels
- Use tiny touch targets
- Mix locked and unlocked fields without clear distinction
