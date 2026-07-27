# Fix registry, FAB, and typography regressions

## Task

Fix three regressions:
1. Component registry: incomplete file discovery and missing viewer components.
2. FAB positioning: dashboard "+" button scrolling away.
3. Dashboard typography: base font not matching the template.

## Approach

1. Inspected the component registry file and actual file listing.
2. Rewrote the registry to auto-discover files from the filesystem, remove conceptual components with no source files, and add viewer components.
3. Inspected the dashboard phone-frame height and FAB positioning styles.
4. Compared dashboard implementation with the template for typography differences.
5. Restored the phone-frame to the original fixed height.
6. Added missing `font-graphik` CSS rule.

## Changes

### `src/lib/component-registry.ts`

Replaced the hardcoded registry with an auto-discovered registry.

- Removed conceptual components with no source files: table, input, select, dialog, chart, badge, alert, tabs, sidebar, form.
- Added actual viewer components: carousel, code-viewer, file-explorer, markdown-viewer, component-detail.
- Replaced the `populateFiles` IIFE with `buildRegistry()` that calls `discoverDirFiles` or `discoverSingleFile` for each entry.
- Entries map to their exact source path and files are populated from `import.meta.glob`.

### `src/components/dashboard/index.css`

Added the missing `.dashboard-workspace .font-graphik` CSS rule:

```
font-family: 'Inter', sans-serif;
```

This rule exists in the template `<style>` block but was missing in the implementation.

### `src/pages/components/ComponentsPage.tsx`

- Added `title` attribute to component card buttons for tooltip.
- Added file count badge showing total files for each component.
- Added `component-card__footer` container for the category and file count.

### `src/pages/components/styles.css`

- Added `.component-card__footer` flex layout.
- Added `.component-card__files-badge` pill-style badge.

## Verification

- `bun run build` passes (both tsc and vite).
- Dev server starts without errors.
- Dashboard phone-frame uses `h-[100vh] sm:h-[900px]` matching the template.
- Dashboard "+" button uses `absolute` positioning.
- Registry only includes 8 components with actual source files.
  - Dashboard: 3 files (tsx, ts, css)
  - Button: 1 file
  - Carousel: 1 file
  - Infinite Notification Carousel: 1 file
  - Code Viewer: 1 file
  - File Explorer: 1 file
  - Markdown Viewer: 1 file
  - Component Detail: 1 file

## Issues

- Invoice workspace FABs use `position: fixed` in their CSS and were not modified.
- No workspace FAB regression exists in the invoice workspaces.
- The dashboard was the only workspace with a FAB regression (phone-frame height changed to `min-height` instead of fixed `height`).
