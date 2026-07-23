# Task: Execute Task2.md — Gallery, Settings, and Shell Migration to Moving Parts

## Task

Execute the plan in `docs/Prompts/task2.md` with user modifications:
- Keep the topic drill-down flow (workspace → topic → workspace list).
- Remove the search button from TopBar.
- Add an `accentColor` field to each workspace for preview swatches.

## Approach

1. Read the task specification and the project's current state.
2. Load the brainstorming skill and explore the codebase.
3. Confirm design decisions with the user.
4. Implement changes in order: types → data → Gallery → Settings → Shell → TopBar → cleanup.
5. Run the build to verify.

## Changes

| File | Action | Description |
|------|--------|-------------|
| `src/shell/types.ts` | Modified | Added `accentColor?: string` to `ShellWorkspace` |
| `src/App.tsx` | Modified | Added `accentColor` to all 5 workspace entries |
| `src/shell/screens/Gallery/Gallery.tsx` | Rewritten | Uses Moving Parts classes (`mp-shot-grid`, `mp-shot`, `mp-search`, `mp-categories`, `mp-category-pill`, `shot-preview`, `shot-meta`). Two views: topic cards list and workspace cards per topic |
| `src/shell/screens/Settings/Settings.tsx` | Rewritten | Uses `mp-section`, `mp-section-label`, `btn-ghost`, `--mp-*` tokens. No `AppWindow`/`SidebarNav` |
| `src/shell/Shell.tsx` | Modified | Simplified Gallery props — removed `themeMode`, `resolved`, `onToggleTheme` |
| `src/shell/components/TopBar/TopBar.tsx` | Modified | Removed `#components` and `#docs` nav links. Removed search button. Removed `Search` lucide import |
| `src/shell/components/AppWindow/` | Deleted | Entire component directory |
| `src/shell/components/SidebarNav/` | Deleted | Entire component directory |
| `src/shell/components/WorkspaceCard/` | Deleted | Entire component directory |
| `src/shell/components/EmptyState/` | Deleted | Entire component directory |
| `src/shell/components/LoadingState/` | Deleted | Entire component directory |
| `src/shell/components/GradientOrb/` | Deleted | Entire component directory |
| `src/shell/screens/Gallery/Gallery.module.css` | Deleted | Unused CSS module |
| `src/shell/screens/Settings/Settings.module.css` | Deleted | Unused CSS module |

## Verification

- `bun run build` passed with zero type errors and zero build warnings.
- `tsc -b` completed without errors.
- Production bundle built successfully with code-split workspace chunks.
- Verified all 6 dead component directories are removed from the filesystem.
- Verified no remaining imports of deleted components anywhere in `src/`.

## Issues

None. The topic drill-down step was kept as requested (user chose not to remove it). The Gallery renders topic cards first, then workspace cards for the selected topic — both using the Moving Parts shot-grid pattern.
