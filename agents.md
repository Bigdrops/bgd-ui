# AGENTS

## Engineering Handbook for AI Development

This document is the authoritative reference for every AI agent making changes to this repository. Read it before writing code. Follow it without exception.

---

## 1. Repository Philosophy

This repository is a **gallery of independent invoice workspace implementations**.

Every workspace is intentionally independent. Every workspace should look like it came from a different company. The value of this repository comes from **diversity**, not consistency.

- Do **not** try to create one reusable design system.
- Do **not** create a shared theme layer.
- Do **not** move styling into shared folders.
- Do **not** create reusable design tokens.
- Do **not** attempt to standardize visual design.
- **The goal is exploration.**

---

## 2. Architecture

```
src/
├── App.tsx                  ← Gallery + workspace switching
├── main.tsx
├── index.css                ← Tailwind/base reset only
├── gallery/
│   └── Gallery.tsx
├── types/
│   └── invoice.ts           ← Shared business types only
├── lib/
│   ├── calculations.ts
│   ├── mock-data.ts
│   └── utils.ts
└── workspaces/
    └── invoice/
        ├── prav/
        ├── sackville/
        └── <new-workspace>/
```

### What can be shared

Only business logic:

- TypeScript invoice types (`src/types/invoice.ts`)
- Calculation helpers (`src/lib/calculations.ts`)
- Currency formatting, ID generation (`src/lib/utils.ts`)
- Mock data factories (`src/lib/mock-data.ts`)

### What must NOT be shared

- CSS
- Colors
- Typography
- Spacing
- Border radius
- Shadows
- Animations
- Component styling
- Design tokens

Each workspace owns all of its visual decisions.

---

## 3. Design References

Every new workspace begins by selecting **one** design reference from:

```
docs/Designs/
```

That document becomes the design inspiration for the entire workspace. Rules:

- Do **not** mix multiple design documents.
- Do **not** combine PRAV with Sackville.
- Do **not** combine AMRA with CONVEX.
- **One workspace. One design language.**

---

## 4. Component Usage

The components inside `docs/Masonry-yard/reui/` are building blocks. Reuse them whenever appropriate. Compose them differently to match the selected design language.

- Never recreate the REUI library.
- Never change another workspace because a new workspace needs something different.
- Use REUI as **reference** for architecture and patterns, not as a direct import.

---

## 5. Workspace Rules

Every workspace owns:

| Asset | Shared? |
|-------|---------|
| Colors | No |
| Spacing | No |
| Typography | No |
| Border radius | No |
| Borders | No |
| Shadows | No |
| Animations | No |
| Interactions | No |
| Icons | No |
| Layout | No |
| CSS | No |
| `index.css` | No — each workspace's own |

Nothing visual is shared. Only business logic may be shared.

---

## 6. Adding a New Workspace

1. Pick one random `docs/Designs/` file.
2. Read it completely.
3. Build an original invoice workspace inspired by it.
4. Place everything inside `src/workspaces/invoice/<workspace-name>/`.
5. Register it in the gallery (`src/App.tsx`).

That is all. Nothing else should be required.

---

## 7. Mobile-First Mandate

Mobile is the primary platform. Desktop is a progressive enhancement.

- No horizontal scrolling
- No spreadsheet layouts
- Touch targets minimum 44×44 CSS pixels
- One-handed usage
- Inline editing everywhere
- No modal-first workflows

---

## 8. Code Standards

- TypeScript strict mode. No `any`.
- Named exports only.
- One component per file.
- Each workspace has its own `index.css` with its own design tokens.
- Tailwind CSS for utility classes within each workspace.
- `docs/Masonry-yard/reui` components as reference for architecture.

---

## 9. Validation

Before completing any task:

1. Run `bun run build` — no type errors
2. Run `bun run build` — production bundle succeeds
3. Verify responsive at 375px, 768px, 1024px
4. Each workspace must compile into its own isolated CSS and JS chunk

---

## 10. Directory Structure

```
.
├── agents.md
├── Readme.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── gallery/
│   ├── lib/
│   ├── types/
│   └── workspaces/invoice/
├── docs/
│   ├── Architecture/      Product specifications
│   ├── Designs/           Visual language references
│   ├── Masonry-yard/      Reusable implementation assets
│   │   ├── reui/          Local REUI snapshot
│   │   └── reui-upstream/ Upstream reference
│   └── DESIGNMD/          Legacy — use Designs/
└── dist/
```

---

## 11. Documentation Writing Standard

This project adopts **ADS-STE100 Simplified Technical English** as the required writing standard for all technical documentation.

This requirement applies to:

- Architecture documents
- Design documents
- Pattern documents
- READMEs
- Specifications
- API documentation
- Developer guides
- Contribution guides
- AI-generated documentation
- Any future documentation added to the repository

### Writing Rules

When writing documentation, agents must follow these rules:

- Use ADS-STE100 Simplified Technical English.
- Use short, direct sentences.
- Use active voice.
- Use consistent terminology throughout the repository.
- Define technical terms before using them.
- Explain concepts before implementation details.
- Use one idea per paragraph.
- Prefer bullet lists and tables over long prose.
- Remove unnecessary adjectives and filler.
- Do not use marketing language.
- Do not use conversational language.
- Do not use AI-style phrases or hedging.
- Avoid repetition.
- Make documents easy to scan.
- Write for engineers, designers, and product teams.

Documentation should read like professional engineering documentation, not AI-generated content.

This standard is mandatory for every agent working in this repository.

---

## 12. Documentation Workflow

Before creating or modifying documentation, agents must:

1. Inspect the existing documentation.
2. Identify the authoritative source document.
3. Extend existing documentation before creating a new document.
4. Cross-reference related documents instead of duplicating information.
5. Keep terminology consistent across the repository.
6. Update links when files move.
7. Preserve the Architecture → Designs → Masonry-yard → Patterns separation of responsibilities.

### Folder Responsibilities

| Folder | Defines | Source of Truth For |
|--------|---------|---------------------|
| `docs/Architecture/` | Behaviour | Business rules, calculations, workflows, interaction specifications, navigation, state management, validation |
| `docs/Designs/` | Appearance | Colour systems, typography, spacing, surfaces, borders, radii, elevation, component styling, visual language |
| `docs/Masonry-yard/` | Implementation assets | Component libraries, layouts, templates, hooks, utilities, interaction primitives |
| `docs/Patterns/` | UX solutions | Floating save, mobile forms, image picker, confirmation dialog, totals panel, line item card |

### Cross-Referencing

Agents must cross-reference existing documentation whenever possible.

- Reference Architecture documents when implementing behaviour.
- Reference Design documents when implementing visual styles.
- Reference Masonry-yard documents when using reusable components.
- Reference Pattern documents when implementing recurring UI solutions.

Duplicate documentation is considered a defect.
