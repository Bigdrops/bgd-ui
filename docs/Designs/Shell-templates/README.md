# BGD UI

BGD UI is a personal-first, offline-first mobile application. It is a curated collection of mobile-friendly screens, workspaces, components, and interaction patterns for business applications.

The application runs completely offline. It does not require a backend. It does not require hosting. The primary deployment target is Capacitor. Web is useful for development, but the mobile application is the primary experience.

The product is built primarily for the author. Others are welcome to use it if they like the approach. It is a curated collection, not a SaaS product.

---

## What This Is

| What | What It Is Not |
|------|----------------|
| A curated collection of mobile business workspaces | A single application with themes |
| Independent design explorations | A shared component library |
| Production-ready React components and screens | Mockups or prototypes |
| An offline-first reference library | A hosted SaaS product |
| A platform that hosts diverse workspaces | A workspace itself |

---

## Current Workspaces

| Workspace | Design Language | Business Domain |
|-----------|----------------|-----------------|
| **PRAV** | Engineering dossier on warm parchment | Invoice |
| **Sackville** | Editorial risograph zine on cream | Invoice |
| **AMRA** | Monochrome minimal with lavender accent | Invoice |

---

## Planned Workspaces

| Workspace | Status | Business Domain |
|-----------|--------|-----------------|
| CRM | Planned | Customer Relationship Management |
| Inventory | Planned | Inventory Management |
| Quotations | Planned | Sales Quotations |

---

## Architecture

```
src/
├── shell/               ← Application shell (gallery, navigation, settings, search)
│   ├── components/      ← Shell components (cards, bars, overlays)
│   ├── screens/         ← Shell screens (gallery, settings)
│   ├── styles/          ← Shell CSS Modules with scoped --shell-* tokens
│   └── hooks/           ← Shell logic (theme, navigation)
├── workspaces/
│   └── invoice/
│       ├── prav/        ← PRAV workspace (own CSS, own components)
│       ├── sackville/   ← Sackville workspace (own CSS, own components)
│       └── amra/        ← AMRA workspace (own CSS, own components)
├── shared/
│   └── logic/           ← Business logic shared across workspaces
└── lib/
    └── database/        ← SQLite data layer
```

**Rules:**

- The shell is the platform. Workspaces are independent products inside it.
- The shell has its own design language. It does not inherit styling from any workspace.
- Each workspace is fully self-contained.
- Each workspace owns its own CSS, colors, typography, spacing, animations.
- No shared design tokens exist between workspaces or between a workspace and the shell.
- Only business logic (types, calculations, data operations) is shared.
- A change in one workspace never affects another.
- A change in the shell never affects any workspace.

---

## Design References

The application shell has its own design specification: `docs/bgd-ui-prd/bgd-shell-final-recommendation.md`.

Each workspace selects one design reference from `docs/Designs/`. That document becomes the design inspiration — one workspace, one design language.

---

## How to Run

```bash
# Install dependencies
bun install

# Development server
bun run dev

# Production build
bun run build
```

The application opens into the workspace gallery. Select any workspace to explore it.

---

## How to Create a New Workspace

1. Pick one `docs/Designs/` file.
2. Read it completely.
3. Build a new workspace inspired by it.
4. Place it in `src/workspaces/<domain>/<name>/`.
5. Register it in the workspace registry.

That is it. No shared theme updates. No design token registration. No component library changes.

---

## Tech Stack

- React 19
- TypeScript 5.9
- Vite 7
- Capacitor (deployment target)
- SQLite (primary data store)
- CSS Modules with scoped custom properties (shell styling)
- Inter + IBM Plex Mono (shell typography)
- Phosphor Icons (shell iconography)

---

## Documentation

| Document | Purpose |
|----------|---------|
| `docs/bgd-ui-prd/PRD.md` | Product requirements |
| `docs/bgd-ui-prd/Glossary.md` | Shared vocabulary |
| `docs/bgd-ui-prd/ADR/` | Architecture decision records |
| `docs/Designs/` | Design language collection (paint references) |
| `docs/Masonry-yard/` | Reusable implementation patterns (blocks) |
| `docs/Workspace-spec/` | Workspace-specific product specifications |
| `docs/AGENTS.md` | AI development guide |

---

## Principles

- Offline-first. Local data is the source of truth.
- Mobile-first. The primary experience is a mobile application.
- Workspace isolation. Each workspace owns its own visual identity.
- Shell neutrality. The shell must not compete with workspace designs.
- Documentation as source code. All technical documentation follows ADS-STE100 Simplified Technical English.

---

## License

Internal use only.
