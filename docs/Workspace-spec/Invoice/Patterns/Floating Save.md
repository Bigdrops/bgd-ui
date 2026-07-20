# Floating Save Pattern

## Purpose

Provide a consistent structure for floating save buttons across all workspaces.

## Structure

```
Floating Save Button
├── Icon
├── Loading state
└── Tooltip (optional)
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Icon | Display | Yes | Save icon |
| Loading spinner | Display | Conditional | Shows during save |
| Tooltip | Display | No | "Save" label |

## States

| State | Description |
|-------|-------------|
| Default | Ready to save |
| Disabled | Cannot save (validation errors) |
| Loading | Save in progress |
| Hidden | Scrolled to top (optional) |

## Behaviors

| Behavior | Rule |
|----------|------|
| Position | Fixed bottom-right |
| Z-index | Above footer |
| Touch | Minimum 44x44 |
| Action | Triggers save |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Label | aria-label="Save" |
| Focus | Focusable via tab |
| Disabled | aria-disabled when disabled |
| Loading | aria-busy when loading |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Position | Fixed bottom-right |
| Size | Minimum 44x44 |
| Thumb reach | Easy to reach with thumb |
| Footer | Above sticky footer |

## Do's

- Use icon-only button
- Fix position bottom-right
- Show loading state
- Disable when invalid
- Meet minimum touch target

## Don'ts

- Use text label
- Position where it blocks content
- Allow save during validation errors
- Hide during loading
- Use tiny touch target
