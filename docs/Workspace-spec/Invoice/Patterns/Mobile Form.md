# Mobile Form Pattern

## Purpose

Provide a consistent structure for mobile-first data entry forms across all workspaces.

## Structure

```
Form Container
├── Header Section
├── Primary Content
├── Secondary Content
├── Tertiary Content (collapsible)
└── Footer (sticky)
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Form container | Wrapper | Yes | Full-width, single-column |
| Header section | Container | Yes | Document metadata |
| Primary content | Container | Yes | Main data entry area |
| Secondary content | Container | Yes | Supporting data |
| Footer | Sticky bar | Yes | Action buttons |

## States

| State | Description |
|-------|-------------|
| Empty | No data entered; shows empty states |
| Partial | Some fields filled; shows validation |
| Complete | All required fields filled; ready to save |
| Error | Validation errors present |
| Loading | Data being fetched or saved |

## Behaviors

| Behavior | Rule |
|----------|------|
| Layout | Single-column on all screen sizes |
| Scrolling | Vertical scroll only; no horizontal scroll |
| Keyboard | Opens on input focus; dismisses on done |
| Validation | Validates on blur; shows errors inline |
| Save | Auto-saves or saves on user action |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Labels | Every input has a visible label |
| Focus order | Logical tab order top to bottom |
| Error messages | Linked to inputs via aria-describedby |
| Touch targets | Minimum 44x44 CSS pixels |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Touch targets | Minimum 44x44 CSS pixels |
| Input size | Minimum 16px font to prevent zoom |
| Scroll | Single direction only |
| Keyboard | Adjust layout when keyboard appears |
| Gestures | Tap to focus; swipe to dismiss sheets |

## Do's

- Use single-column layout
- Provide clear labels for all fields
- Show validation errors inline
- Use appropriate input types (email, tel, date)
- Test with screen readers

## Don'ts

- Use multi-column layouts on mobile
- Require horizontal scrolling
- Use tiny touch targets (< 44x44)
- Hide labels as placeholders only
- Use modal dialogs for data entry

---

**Related documents:** See [spec.md](../Architecture/Invoice/spec.md) for field inventory.
