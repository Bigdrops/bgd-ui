# Confirmation Dialog Pattern

## Purpose

Provide a consistent structure for confirmation dialogs across all workspaces.

## Structure

```
Confirmation Dialog
├── Title
├── Message
├── Cancel button
└── Confirm button
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Title | Text | Yes | Clear, concise title |
| Message | Text | Yes | Descriptive message |
| Cancel button | Button | Yes | "Cancel" label |
| Confirm button | Button | Yes | Action-specific label |

## States

| State | Description |
|-------|-------------|
| Closed | Dialog hidden |
| Open | Dialog visible |
| Confirming | Action in progress |

## Behaviors

| Behavior | Rule |
|----------|------|
| Trigger | Dangerous actions require confirmation |
| Close | Cancel or tap outside |
| Confirm | Executes action; closes dialog |
| Keyboard | Escape closes; Enter confirms |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Focus | Focus trap within dialog |
| Close | Escape key closes |
| Labels | Clear button labels |
| Screen reader | Announces dialog content |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Display | Bottom sheet on mobile |
| Touch | Large touch targets |
| Dismiss | Swipe down to dismiss |
| Buttons | Full-width stacked |

## Do's

- Use for dangerous actions
- Provide clear message
- Use action-specific confirm label
- Trap focus within dialog
- Allow Escape to close

## Don'ts

- Use for non-destructive actions
- Use generic "OK" label
- Allow outside click to confirm
- Hide close button
- Use tiny touch targets
