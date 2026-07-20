# Workspace Gallery Pattern

## Purpose

Provide a consistent structure for displaying workspace options across the application.

## Structure

```
Workspace Gallery Container
├── Gallery header
├── Workspace cards
│   ├── Workspace preview
│   ├── Workspace name
│   └── Workspace description
└── Navigation controls
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Gallery header | Display | Yes | "Workspaces" title |
| Workspace cards | Container | Yes | List of available workspaces |
| Workspace preview | Display | Yes | Thumbnail or icon |
| Workspace name | Text | Yes | Workspace identifier |
| Workspace description | Text | No | Brief description |
| Navigation controls | Buttons | Yes | Previous/Next |

## States

| State | Description |
|-------|-------------|
| Default | All workspaces visible |
| Selected | Active workspace highlighted |
| Loading | Workspace loading |

## Behaviors

| Behavior | Rule |
|----------|------|
| Navigation | Tap card to open workspace |
| Preview | Shows workspace thumbnail |
| Selection | Highlights active workspace |
| Scroll | Horizontal scroll on mobile |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Workspace names as labels |
| Focus | Tab navigation between cards |
| Screen reader | Announces workspace names |
| Touch | Minimum 44x44 targets |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Layout | Horizontal scroll |
| Cards | Full-width cards |
| Touch | Large touch targets |
| Preview | Thumbnail size |

## Do's

- Show workspace preview
- Provide clear names
- Support horizontal scroll
- Highlight active workspace
- Meet touch target size

## Don'ts

- Hide workspace names
- Use tiny cards
- Disable horizontal scroll
- Hide active state
- Use tiny touch targets
