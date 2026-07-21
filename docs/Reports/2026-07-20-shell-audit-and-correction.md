# Shell Audit and Correction Report

**Date:** 2026-07-20
**Task:** docs/Prompts/task1.md

---

## Task

Audit the current shell implementation against the approved design specification (bgd-shell-final-recommendation.md and PRD.md). Identify every deviation and correct the implementation to match the approved specification.

## Approach

1. Read all authoritative references: AGENTS.md, PRD.md, bgd-shell-final-recommendation.md.
2. Audit every shell file: Shell.tsx, all components, screens, styles, hooks, and types.
3. Audit workspace CSS for global leakage.
4. Audit tailwind.config.js and src/index.css for shared design tokens.
5. Compare every implementation decision against the approved specification.
6. Produce a deviation report.
7. Implement corrections.

## Changes

### 1. src/index.css — Remove global CSS overrides

**Before:** Declared `--font-body: 'DM Sans'` on `:root`. Set `overflow-x: hidden`, `max-width: 100vw` on `html, body, #root`. Applied global `input[type="number"]` spin-button removal.

**After:** Removed all global declarations. Kept only `html, body { margin: 0; padding: 0; }` and `#root { min-height: 100vh; }`.

**Reason:** PRD 9.3: "No global CSS overrides are permitted."

### 2. tailwind.config.js — Remove workspace-specific tokens

**Before:** Extended Tailwind with PRAV-specific colors (parchment, ink-black, bone, etc.), DM Sans font family, custom border radii, font sizes, spacing, and animations.

**After:** Removed all extensions. Tailwind config is now a minimal empty extension.

**Reason:** PRD 9.3: "Tailwind configurations must be workspace-specific where applicable." AGENTS.md 5: "Nothing visual is shared."

### 3. src/shell/styles/tokens.css — Fix circular var() references

**Before:** Light theme block used `--shell-color-canvas: var(--shell-color-canvas)` — a circular self-reference that is fragile.

**After:** Both light and dark theme blocks now use direct literal hex values.

**Reason:** CSS spec compliance and correctness.

### 4. src/shell/Shell.tsx — Restore workspace isolation

**Before:** All workspace components were rendered as children of `<div className="bgd-shell">`. This caused shell CSS custom properties, font-family, color, background, and `:focus-visible` rules to cascade into workspace components.

**After:** Workspace views render the shell TopBar inside `.bgd-shell` and the workspace content OUTSIDE `.bgd-shell` as a sibling. Gallery and Settings remain inside `.bgd-shell`. A theme-only wrapper `<div data-theme={resolved}>` provides the theme context for both shell chrome and workspace area.

**Reason:** PRD 9.3: "Removing a workspace must not affect the shell visual appearance." PRD 3.2: "Workspace isolation." ADR-001.

### 5. src/shell/types.ts — Remove unused themeClass

**Before:** `ShellWorkspace` type had a `themeClass` property that was never used by the shell.

**After:** Removed `themeClass` from the interface.

**Reason:** Dead code cleanup.

### 6. src/App.tsx — Remove unused themeClass values

**Before:** Each workspace entry had `themeClass: 'pav-root' | 'sak-root' | 'amr-root'`.

**After:** Removed `themeClass` from all workspace entries.

**Reason:** Follows type change.

### 7. Deleted dead code

- Removed `src/gallery/Gallery.tsx` — old gallery implementation using lucide-react, no longer imported.
- Removed `src/gallery/index.ts` — corresponding export.
- Removed empty `src/shell/components/Dialog/` directory.
- Removed empty `src/shell/screens/Search/` directory.

**Reason:** Dead code and empty directories.

## Verification

| Check | Result |
|-------|--------|
| `bun run build` (tsc -b && vite build) | Succeeded. No type errors. |
| Shell CSS does not cascade into workspaces | Workspace content rendered outside `.bgd-shell`. Shell CSS variables and `:focus-visible` do not reach workspace components. |
| No global CSS overrides in src/index.css | All global declarations removed. |
| No PRAV-specific tokens in tailwind config | Only empty extend remains. |
| tokens.css has no circular var() references | Both theme blocks use direct hex values. |
| No empty component/screen directories | Dialog and Search empty directories removed. |
| No unused type properties | `themeClass` removed from ShellWorkspace. |

## Remaining Issues

| Issue | Status |
|-------|--------|
| Theme persistence uses localStorage instead of SQLite | Requires Capacitor SQLite plugin. Not implemented. |
| Settings is a state switch, not a proper stack navigation | Functionally equivalent for single-level navigation. |
| No responsive sidebar search for tablet+ | Search is full-screen overlay at all breakpoints. |
| Dialog component not implemented | Empty directory was removed; component needs to be built per approved pattern. |
