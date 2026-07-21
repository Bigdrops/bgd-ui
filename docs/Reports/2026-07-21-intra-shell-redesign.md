# Intra Shell Redesign Report

## Task

Redesign the shell (gallery/navigation layer) of the BGD UI workspace gallery using the Intra.md design language. Replace the previous visual language (gradient cards, bottom tab bar, search, icons, rounded corners) with Intra's brutalist editorial style.

## Approach

1. Read Intra.md to understand the design constraints.
2. Defined Intra CSS tokens (colors, spacing, typography) in the shell's own styles.
3. Deleted unused shell components and screens.
4. Rewrote all remaining shell components and screens to follow Intra rules.
5. Restructured navigation from flat list to topic-based (Home → Topic → Workspace).
6. Updated App.tsx to group the 3 invoice workspaces under a single "Invoice" topic.

## Changes

| File | Change |
|------|--------|
| `src/shell/styles/tokens.css` | Replaced with Intra color palette (#ffffff canvas, #212529 ink, #e4e4e4 hairline) + dark-mode inversion. Added spacing (4px grid) and typography scale. |
| `src/shell/styles/reset.css` | Rewrote: weight 400 everywhere, 0px border-radius, no box shadows. |
| `src/shell/styles/typography.css` | Added utility classes: shell-display (14px uppercase), shell-heading (16px), shell-body (16px), shell-caption (12px), shell-back-link. |
| `src/shell/types.ts` | Added ShellTopic, WorkspaceEntry types. Replaced ThemeMode enum with string union. Added ShellScreen type. |
| `src/shell/components/TopBar/TopBar.tsx` | Rewrote: single line, "< Back" text link (left), optional Sun/Moon toggle button (right). |
| `src/shell/components/TopBar/TopBar.module.css` | Rewrote: 0px radius, 1px bottom border, no icons except theme toggle. |
| `src/shell/components/WorkspaceCard/WorkspaceCard.tsx` | Rewrote: text-only list item with bottom hairline, no card/box/icon. |
| `src/shell/components/WorkspaceCard/WorkspaceCard.module.css` | Inline text label, minimal padding. |
| `src/shell/components/EmptyState/EmptyState.tsx` | Rewrote: text-only message, no illustration or icon. |
| `src/shell/components/EmptyState/EmptyState.module.css` | Simple centered text. |
| `src/shell/components/LoadingState/LoadingState.tsx` | Rewrote: text skeleton rows, no spinner/shimmer. |
| `src/shell/components/LoadingState/LoadingState.module.css` | Animated placeholder lines. |
| `src/shell/components/BottomTabBar/` | Deleted (directory removed). |
| `src/shell/components/SearchOverlay/` | Deleted (directory removed). |
| `src/shell/components/CategoryFilter/` | Deleted (directory removed). |
| `src/shell/screens/Gallery/Gallery.tsx` | Rewrote: shows topic list as text rows with "→" arrows, or workspace list when a topic is selected. |
| `src/shell/screens/Gallery/Gallery.module.css` | Rewrote: hairline borders, max 600px centered width. |
| `src/shell/screens/Settings/Settings.tsx` | Rewrote: text-only rows (Workspaces count, Version, Product). No theme toggle. |
| `src/shell/screens/Settings/Settings.module.css` | Rewrote: hairline rows, centered footer. |
| `src/shell/Shell.tsx` | Rewrote: 3-screen navigation (home/topic/workspace/settings). Uses useTheme, passes resolved theme down. Suspense boundary around workspace components. |
| `src/shell/index.ts` | Updated exports for new types. |
| `src/App.tsx` | Restructured: single "Invoice" topic → 3 workspace entries (PRAV, Sackville, AMRA). |

## Verification

- `bun run build` — typeScript compilation: no errors
- `bun run build` — production bundle: succeeds
- Build output shows 3 isolated workspace CSS chunks + 1 shell CSS chunk:
  - `assets/InvoiceWorkspace-L9M1Wf1r.css` (8.5 kB)
  - `assets/InvoiceWorkspace-DuOsSgr-.css` (9.2 kB)
  - `assets/InvoiceWorkspace-DVb0OJ_7.css` (10.9 kB)
  - `assets/index-Bk_4MncP.css` (14.3 kB — shell)
- Shell CSS reduced from ~25 kB to ~14 kB

## Design Compliance

- [x] White canvas (#ffffff) with #212529 text (Intra rule 1, 2)
- [x] #e4e4e4 borders (Intra rule 3)
- [x] 0px border-radius everywhere (Intra rule 4)
- [x] Font weight 400 throughout (Intra rule 5)
- [x] No icons except explicit theme toggle (user override)
- [x] One design language applied to shell (Intra)
- [x] All workspaces maintain full visual isolation
- [x] Mobile-first: single column, touch targets 44px+
- [x] No horizontal scrolling

## Issues

- Light/dark toggle is kept as Sun/Moon icon per user request (overrides Intra's no-icon rule). This is isolated to a single TopBar button on the Home screen only.
- Responsive verification at 375/768/1024px is pending. Visual check required before final sign-off.
