# Create 3 New Dashboard Workspaces

## Task

Create three new dashboard workspaces based on the existing Modern Web Intelligence Dashboard, each adopting a different design language from the Design Library.

## Design Sources

| Dashboard | Design File | Visual Language |
|-----------|-------------|-----------------|
| Operate | `docs/Designs/Operate.md` | Sage-green data terminal, mono-green family, compact instrument panels, 0.5px hairline borders |
| Slash | `docs/Designs/Slash.md` | Midnight vault, golden accents, Ivy Presto serif, pill-shaped controls, gilded gradient charts |
| Paradigm | `docs/Designs/Paradigm.md` | Dark hero transitioning to light body, pastel status badges, Atacama VAR serif, 4px geometry |

## Approach

1. Read the existing Modern Web Intelligence Dashboard implementation to identify all business capabilities
2. Read the three selected Design.md files to understand their visual languages
3. Create three new dashboard components with their own CSS files
4. Register all three in the component registry with explicit `designFile` paths
5. Register all three workspaces in App.tsx with lazy loading

## Files Added

| File | Purpose |
|------|---------|
| `src/components/dashboard/operate-dashboard.tsx` | Operate-inspired dashboard — sage-green canvas, mono-green family, compact instrument panels |
| `src/components/dashboard/operate.css` | Operate styles — IBM Plex Mono font, 0.5px hairline borders, moss accent |
| `src/components/dashboard/slash-dashboard.tsx` | Slash-inspired dashboard — dark midnight vault, golden accents, serif headings |
| `src/components/dashboard/slash.css` | Slash styles — Playfair Display serif, 9999px pill controls, copper accent |
| `src/components/dashboard/paradigm-dashboard.tsx` | Paradigm-inspired dashboard — dark-to-light transition, pastel badges, research instrument feel |
| `src/components/dashboard/paradigm.css` | Paradigm styles — Lora serif, 4px geometry, electric iris accent, pastel status badges |

## Files Modified

| File | Change |
|------|--------|
| `src/lib/component-registry.ts` | Added 3 registry entries with explicit `designFile` paths, `previewComponent` lazy imports, and source file lists |
| `src/App.tsx` | Added 3 lazy imports and 3 WORKSPACES entries with `registryId` fields |

## Business Capabilities Preserved

All three dashboards preserve the full functionality of the original:

- **4 KPI cards** — Outstanding, Due This Week, Payments Received, Overdue (with live sparklines)
- **LiveSparkline** — Animated SVG sparkline with requestAnimationFrame
- **LiveTelemetryGraph** — Dual-line graph (expected vs collected) with gradient fill
- **Notifications carousel** — Touch-swipeable, auto-advancing every 4.5s
- **Document list** — 6 document types with status badges
- **Cash flow forecast** — Dark panel with telemetry graph and 3-column stats
- **Activity feed** — Timeline with checkmark/eye/truck icons
- **FAB** — Floating action button for document creation
- **Drawer navigation** — Workspace/tenant switcher, 11 core modules, 5 governance modules
- **Bottom nav bar** — 5 tabs: Home, Docs, Dispatch, Projects, More
- **Toast system** — String-based notifications
- **Touch gestures** — Swipe to advance notifications

## Visual Differences

| Aspect | Original (BigDrops) | Operate | Slash | Paradigm |
|--------|---------------------|---------|-------|----------|
| Background | #eef2e3 (pale sage) | #e0e0e0 (sage paper) | #08080a (obsidian) | #ffffff (paper) → #080b12 (hero) |
| Primary accent | #c8f169 (chartreuse) | #85c093 (moss) | #cc9166 (copper) | #0a33ff (electric iris) |
| Typography | Fraunces + Inter | IBM Plex Mono + Inter | Playfair Display + Inter | Lora + Inter |
| Borders | 4px radius, 1px | 4px radius, 0.5px | 9999px pill, 1px | 4px radius, 1px |
| Elevation | Color-stack layering | No shadows, hairline borders | No shadows, 1px borders | White inner-glow on cards |
| Status badges | Filled pill | Cinetype label with bracket | Pill with border | Dark ink on pastel wash |

## Verification

- `npx vite build` — succeeds, 1937 modules transformed
- Each dashboard code-splits into its own JS + CSS chunk
- `bun run build` fails only on pre-existing errors in anchor/mage/model workspaces (not in new dashboards)
- All dashboards appear in Shell under Dashboard category
- All dashboards expose Preview, Code, and Design.md tabs via registry

## Issues

- Pre-existing TypeScript errors in `anchor/`, `mage/`, `model/` workspaces prevent `tsc -b` from passing. These are unrelated to this task.
