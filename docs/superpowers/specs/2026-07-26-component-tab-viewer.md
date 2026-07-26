# Component Tab Viewer

Add Preview, Code, and Design.md tabs to every component in the BGD UI component library.

## Architecture

### Component Registry

A central metadata registry defines each component:

```
interface ComponentMeta {
  id: string
  name: string
  category: string
  description: string
  badge?: string
  icon: string
  dir: string
  files: ComponentFile[]
  designFile: string | null
}
```

File discovery uses Vite `import.meta.glob` with `?raw` query to load all source files as strings at build time:

```
const sourceFiles = import.meta.glob('/src/components/**/*.{ts,tsx,css,md}', {
  query: '?raw',
  import: 'default',
  eager: true,
})
```

Files are grouped by component directory (e.g., all files under `src/components/dashboard/` are grouped into the dashboard component).

Language detection maps file extensions: `.tsx` → TypeScript JSX, `.ts` → TypeScript, `.css` → CSS, `.md` → Markdown.

### New Files

| File | Purpose |
|------|---------|
| `src/lib/component-registry.ts` | Component metadata definitions and auto-discovery logic |
| `src/components/ui/code-viewer.tsx` | Syntax-highlighted code display with line numbers, Copy File, Copy All |
| `src/components/ui/file-explorer.tsx` | File tree sidebar showing component source files |
| `src/components/ui/markdown-viewer.tsx` | Markdown renderer with rendered/raw toggle |
| `src/components/component-detail.tsx` | Three-tab detail view (Preview, Code, Design.md) |

### Modified Files

| File | Change |
|------|--------|
| `src/pages/components/ComponentsPage.tsx` | Click component card → navigate to detail view with back button |
| `src/pages/components/styles.css` | Styles for detail view, tabs, file explorer, code viewer |
| `package.json` | Add `highlight.js` dependency |

### Dependency

- **Add:** `highlight.js` — syntax highlighting for Code tab
- No other new dependencies

### Tab Navigation

Three tabs at the top of the detail view:

1. **Preview** — renders the component in an iframe-less container (current live rendering)
2. **Code** — file explorer sidebar + code viewer with syntax highlighting, line numbers, Copy File, Copy All
3. **Design.md** — renders the component's `design.md` file from the repository, with rendered/raw toggle

### Code Tab Layout

```
┌──────────────────┬──────────────────────────────────┐
│ File Explorer    │ Code Viewer                      │
│                  │                                  │
│ src/             │ filename.tsx                     │
│  components/     │ Language: TypeScript JSX         │
│   dashboard/     │ ┌──────────────────────────────┐ │
│    ├── index.ts  │ │  1 │ import { useState }... │ │
│    ├── dashboard │ │  2 │                         │ │
│    │   .tsx     │ │  3 │ function Component()... │ │
│    ├── styles    │ │  4 │   return <div>...</div> │ │
│    │   .css      │ │  5 │ }                       │ │
│    └── types.ts  │ └──────────────────────────────┘ │
│                  │ [Copy File] [Copy All Files]      │
│  4 files         │                                  │
└──────────────────┴──────────────────────────────────┘
```

### Copy All Files Format

```
========================================
src/components/dashboard/index.ts

<file contents>

========================================
src/components/dashboard/dashboard.tsx

<file contents>
```

### Design.md Tab

- Renders the `design.md` file from the component directory
- Toggle between rendered markdown and raw source
- If no `design.md` exists: display a message

### Interaction

- Clicking a component card in the grid opens the inline detail view
- A back button returns to the grid
- No routing changes — simple state switching
