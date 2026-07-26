# Task: Add Preview, Code, and Design.md Tabs to the BGD UI Component Library

## Approach

1. Analyzed the existing ComponentsPage and component structure
2. Created a component registry with metadata and auto file discovery via `import.meta.glob`
3. Built reusable UI components: CodeViewer, FileExplorer, MarkdownViewer
4. Built a tabbed ComponentDetail view (Preview/Code/Design.md)
5. Updated ComponentsPage to support navigation into component detail
6. Installed `highlight.js` with selective language registration for syntax highlighting

## Files Added

| File | Purpose |
|------|---------|
| `src/lib/component-registry.ts` | Central registry with component metadata and `import.meta.glob` auto-discovery |
| `src/components/ui/code-viewer.tsx` | Syntax-highlighted code display with line numbers and Copy File |
| `src/components/ui/file-explorer.tsx` | VS Code-style file tree sidebar with file count |
| `src/components/ui/markdown-viewer.tsx` | Markdown viewer with rendered/raw toggle and Copy File |
| `src/components/component-detail.tsx` | Tabbed detail view: Preview, Code, Design.md |

## Files Modified

| File | Change |
|------|--------|
| `src/pages/components/ComponentsPage.tsx` | Replaced hardcoded COMPONENTS array with COMPONENT_REGISTRY; added click-to-detail navigation with back button |
| `src/pages/components/styles.css` | Added ~400 lines of styles for tabs, file explorer, code viewer, markdown viewer, detail layout |
| `src/pages/components/styles.css` | Added responsive breakpoints for mobile detail view |
| `src/components/ui/infinite-notification-carousel.tsx` | Added `export default` for lazy loading compatibility |
| `package.json` | Added `highlight.js@11.11.1` |

## Dependencies

- **Added:** `highlight.js@11.11.1` — syntax highlighting for Code tab
- Only specific languages registered: TypeScript, JavaScript, CSS, JSON, Markdown

## Reusable Components Created

- **CodeViewer** (`src/components/ui/code-viewer.tsx`) — Dark-theme code viewer with highlight.js syntax highlighting, line numbers in gutter, filename/language header, Copy File button
- **FileExplorer** (`src/components/ui/file-explorer.tsx`) — File tree with directory grouping, active file highlight, file count, click-to-select
- **MarkdownViewer** (`src/components/ui/markdown-viewer.tsx`) — Rendered/raw toggle markdown viewer with Copy File; renders headers, code blocks, lists, links, bold, italic
- **ComponentDetail** (`src/components/component-detail.tsx`) — Three-tab layout (Preview, Code, Design.md) with back navigation, component identity header, Suspense for lazy-loaded previews

## Architecture

### Component Registry

The `component-registry.ts` provides:
- `COMPONENT_REGISTRY` — array of all component metadata
- `getComponentById(id)` — look up a component
- `getRawFileContent(path)` — get raw source file content loaded via `import.meta.glob`

### Auto Discovery

Files are loaded at build time via `import.meta.glob('/src/components/**/*.{ts,tsx,css,md}', { query: '?raw', eager: true })`. Components with a registered `dir` field have their source files automatically discovered. The registry is populated before export via an IIFE.

### Tab System

All three tabs (Preview, Code, Design.md) are driven by metadata:
- **Preview** — renders `lazyComponent` if available, or placeholder
- **Code** — shows file explorer + code viewer for registered files
- **Design.md** — shows markdown viewer for discovered `.md` files in the component directory

## Verification

- `bun run build` — zero TypeScript errors, production bundle succeeds
- Main chunk: 368.88 kB (includes highlight.js with selective languages)
- Dashboard code-split: 61.96 kB JS + 0.92 kB CSS (unchanged)
- All existing workspaces continue to build
