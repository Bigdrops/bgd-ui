# Image Picker Pattern

## Purpose

Provide a consistent structure for image selection and upload across all workspaces.

## Structure

```
Image Picker Container
├── Upload area
├── Preview
├── Remove button
└── Loading state
```

## Required Fields

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Upload area | Button | Yes | Tap to select image |
| Preview | Display | Conditional | Shows uploaded image |
| Remove button | Button | Conditional | Shows when image present |
| Loading spinner | Display | Conditional | Shows during upload |

## States

| State | Description |
|-------|-------------|
| Empty | No image selected |
| Uploading | Image being uploaded |
| Uploaded | Image displayed with preview |
| Error | Upload failed |

## Behaviors

| Behavior | Rule |
|----------|------|
| Trigger | Tap to open image picker |
| Upload | Background upload with preview |
| Remove | Tap to remove; requires confirmation |
| Format | Accept common image formats |

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Label | aria-label="Upload image" |
| Preview | alt text for uploaded image |
| Remove | Clear remove action |
| Touch | Minimum 44x44 target |

## Mobile Considerations

| Consideration | Rule |
|---------------|------|
| Picker | Native image picker |
| Camera | Allow camera capture |
| Gallery | Allow gallery selection |
| Size | Limit file size |
| Preview | Show inline preview |

## Do's

- Use native image picker
- Show preview after upload
- Allow removal with confirmation
- Show loading during upload
- Accept common formats

## Don'ts

- Use drag-only upload
- Hide preview
- Allow removal without confirmation
- Hide loading state
- Accept unusual formats
