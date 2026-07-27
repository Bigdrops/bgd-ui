# Workspace Documentation Standard

## Purpose

Define the tab system and documentation viewer behavior for the BGD UI Shell workspace view.

## Scope

This standard covers the Shell workspace viewer tabs (Preview, Code, Design.md). It does not cover invoice workspace implementation or the Components page detail view.

---

## Tab System

The Shell workspace view exposes three tabs below the workspace title and back navigation.

| Tab | Icon | Source | Behavior |
|-----|------|--------|----------|
| Preview | `Eye` (lucide-react) | Workspace React component | Renders the workspace component inside a typography-reset wrapper |
| Code | `Code` (lucide-react) | Component registry source files | Shows `SourceFileList` with file explorer and syntax-highlighted code |
| Design.md | `FileText` (lucide-react) | Component registry design file | Renders `MarkdownViewer` with copy-to-clipboard support |

### Tab Appearance

- Pill-style tabs matching `model-behaviour.html` reference
- Border-radius: `100px`
- Font-weight: `600`
- Active tab: filled background
- Inactive tab: transparent background
- Tab CSS: `src/shell/workspace-preview.css`

---

## Component Registry

The Shell workspace viewer resolves files through the component registry.

### Registry Lookup

1. Each workspace in the `WORKSPACES` array declares an optional `registryId` field.
2. On workspace selection, Shell calls `getComponentById(registryId)`.
3. The returned `ComponentMeta` provides `sourceFiles`, `designFile`, and other metadata.

### Registry Fields Used by Shell

| Field | Used By | Purpose |
|-------|---------|---------|
| `sourceFiles` | Code tab | Array of source file paths for `SourceFileList` |
| `designFile` | Design.md tab | Path to design markdown file, or `null` |

### Registration

Each workspace that wants Code/Design.md tabs must:

1. Have an entry in `src/lib/component-registry.ts` with a unique `id`.
2. Set `registryId` in the `WORKSPACES` array in `src/App.tsx` to match the registry entry `id`.

---

## Shared Components

The Shell workspace viewer uses these shared components:

| Component | Location | Used By |
|-----------|----------|---------|
| `SourceFileList` | `src/components/ui/source-file-list.tsx` | Code tab |
| `MarkdownViewer` | `src/components/ui/markdown-viewer.tsx` | Design.md tab |

### SourceFileList

- Displays source files with syntax highlighting (highlight.js)
- Internal clipboard logic via `src/lib/clipboard.ts`
- Per-file "Copied" feedback (2 seconds)
- Copy All button with success state
- Shows "N/A" for missing files

### MarkdownViewer

- Renders markdown content (headers, code blocks, lists, links, bold, italic)
- Copy button for raw markdown content
- "Copied" feedback (2 seconds)

---

## Clipboard

All copy operations use `src/lib/clipboard.ts`:

- Primary: `navigator.clipboard.writeText()`
- Fallback: `document.execCommand('copy')`
- Returns `boolean` for success/failure

---

## Typography Reset

The Shell applies a typography reset to workspace components rendered in Preview mode:

```css
.workspace-preview h1, .workspace-preview h2, ...
{ all: revert; font-size: inherit; }
```

This prevents Shell heading styles from overriding workspace heading sizes.

---

## Adding Tabs to a New Workspace

1. Add a registry entry to `src/lib/component-registry.ts` with `id`, `sourceFiles`, and `designFile`.
2. Add `registryId: '<registry-entry-id>'` to the workspace entry in `src/App.tsx`.
3. The Shell automatically shows Code and Design.md tabs when `registryId` resolves to a valid entry.

---

## Related Documents

- `docs/bgd-ui-prd/model-behaviour.html` — Tab visual reference
- `AGENTS.md` — Section 8 (Code Standards), Section 12 (Documentation Workflow)
