# Signature Picker Pattern

## Purpose

Provide a consistent structure for signature capture across all workspaces.

## Structure

```
Signature Picker Container
├── Signature area
├── Preview
├── Clear button
└── Save button
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Signature area | Drawing canvas | Yes | Touch/mouse input |
| Preview | Display | Conditional | Shows captured signature |
| Clear button | Button | Yes | Clears signature |
| Save button | Button | Yes | Saves signature |

## States

| State | Description |
|-------|-------------|
| Empty | No signature captured |
| Drawing | User drawing signature |
| Captured | Signature displayed |
| Saved | Signature saved to document |

## Behaviors

| Behavior | Rule |
|----------|------|
| Input | Touch or mouse drawing |
| Clear | Resets canvas |
| Save | Captures and stores signature |
| Cancel | Discards signature |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Label | aria-label="Draw signature" |
| Clear | Clear button labeled |
| Save | Save button labeled |
| Keyboard | Alternative input method |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Canvas | Full-width for easy drawing |
| Input | Touch optimized |
| Preview | Shows after capture |
| Save | Large save button |

## Do's

- Provide full-width canvas
- Show preview after capture
- Allow clear and save
- Support touch input
- Provide clear buttons

## Don'ts

- Use tiny canvas
- Hide preview
- Auto-save without confirmation
- Require complex gestures
- Use tiny buttons
