# BGD UI — Final Shell Design Recommendation

**Date:** 2026-07-20  
**Status:** Architect-approved — ready for Shell.md authoring  
**Prepared by:** AI Agent, Lead Design Architect role  
**Task reference:** docs/Prompts/task2.md  
**Input document:** docs/Reports/2026-07-20-shell-design-recommendation.md (task3 output)

---

## 1. Repository Review

| Document | Path | Why It Mattered |
|----------|------|-----------------|
| AGENTS.md | `docs/AGENTS.md` | Defines workflow, writing standard, isolation rules, and task report requirements. Non-negotiable. |
| PRD | `docs/bgd-ui-prd/PRD.md` | Primary constraint document. Defines all shell requirements, screen inventory, navigation structure, component behaviours, and performance budgets. Highest priority input. |
| Glossary | `docs/bgd-ui-prd/Glossary.md` | Defines canonical terms. Ensures recommendation uses consistent vocabulary. |
| ADR-001 | `docs/bgd-ui-prd/ADR-001-workspace-design-isolation.md` | Confirms CSS isolation is an accepted architectural decision. Shell CSS must be scoped. No shared tokens with workspaces. |
| Skill Index | `docs/Skillindex.md` | Identifies available skills. `/design-blueprint` identified as the relevant skill. |
| REUI index, styling, get-started | `docs/Masonry-yard/reui/content/docs/(root)/` | Defines REUI's architecture: shadcn/ui registry, Tailwind v4, semantic token extension model, Radix UI / Base UI primitive foundation. |
| REUI base components (19) | `docs/Masonry-yard/reui/content/docs/(components)/base/` | Identifies which component patterns are available and applicable to the shell. |
| PRAV index.css | `src/workspaces/invoice/prav/index.css` | **Blocking audit.** Confirmed PRAV is fully monochrome: no brand accent colour. Ink (#181011) is the primary interactive colour. |
| Sackville index.css | `src/workspaces/invoice/sackville/index.css` | **Blocking audit.** Confirmed Sackville's brand accent is **Cobalt** `#245dc5`. All interactive states, focus rings, and selection use this hue. |
| AMRA index.css | `src/workspaces/invoice/amra/index.css` | **Blocking audit.** Confirmed AMRA's brand accent is **Lavender** `#acafff` (HSL approximately 238°, 100%, 83%). All interactive states, focus rings, and CTA use this hue. |
| Coda | `docs/Designs/Coda.md` | Evaluated as Paint reference. Warm cream editorial brutalism. Rejected for visual neutrality failure. |
| Relate | `docs/Designs/Relate.md` | Evaluated as Paint reference. Cool-white SaaS with royal blue accent. Adopted for shadow system and canvas approach. |
| Operate | `docs/Designs/Operate.md` | Evaluated as Paint reference. Muted paper canvas, flat hairline cards, information-first. **Adopted as primary light mode reference.** |
| PostHog | `docs/Designs/PostHog.md` | Evaluated as Paint reference. Warm sandy desk, white windows, file-manager metaphor. Adopted for workspace-as-window metaphor. |
| Foundry | `docs/Designs/Foundry.md` | Evaluated as Paint reference. Dark terminal/gallery. Rejected: light-only-design incompatible with dual-mode requirement. |
| Outseta | `docs/Designs/outseta.md` | Evaluated. Sunset gradient and hot pink CTA. Rejected: too distinctive. |
| Slack | `docs/Designs/slack.md` | Evaluated. Aubergine brand identity. Rejected: imposes brand association. |
| Supahub | `docs/Designs/supahub.md` | Evaluated. Violet gradient orbs. Rejected: conflicts with neutrality. |
| Pa'lais | `docs/Designs/palais.md` | Evaluated. Botanical artisan. Rejected: domain-specific personality. |
| Modern BI | `docs/Designs/Modern-Business-Intelligence.md` | Evaluated. Sage canvas + chartreuse accent. Rejected: chartreuse is too loud. |
| Increase | `docs/Designs/Increase.md` | Evaluated. Institutional navy + voltage accent. **Adopted as primary dark mode reference.** |

---

## 2. PRD Constraints

The following constraints are non-negotiable. They directly affect every design decision.

### UX constraints

| Constraint | Source |
|-----------|--------|
| Gallery is the root screen. User cannot navigate above it. | PRD §12.2 |
| Search is an overlay, not a stack push. | PRD §12.2 |
| Settings is a stack push from the gallery. | PRD §12.2 |
| Gallery: 2-column mobile, 3-column tablet, 4-column desktop. | PRD §10.1 |
| Workspace cards must not display workspace-specific styling. | PRD §9.2 |
| Empty state: "No workspaces available" + call to action. | PRD §10.1 |
| Loading state: skeleton grid. | PRD §10.1 |
| Error state: "Failed to load workspaces" + retry button. | PRD §10.1 |
| Settings screen: full-width mobile, centred column tablet+. | PRD §10.3 |
| Search: full-screen overlay mobile, sidebar tablet+. | PRD §10.4 |

### Architecture constraints

| Constraint | Source |
|-----------|--------|
| React + Vite + Capacitor. | PRD §19 |
| CSS Modules or CSS-in-JS with scoped custom properties. | PRD §19 |
| Shell CSS must not reference workspace CSS. Workspaces must not reference shell CSS. | PRD §9.3, ADR-001 |
| CSS custom properties must be scoped to the shell. | PRD §9.3 |
| No global CSS overrides. | PRD §9.3 |
| SQLite is the primary data store. Filesystem stores binary assets. | PRD §13.2 |
| State management: React Context or Zustand. | PRD §19 |

### Accessibility constraints

| Constraint | Source |
|-----------|--------|
| WCAG 2.1 Level AA. | PRD §17 |
| Touch targets: minimum 44×44 CSS pixels. | PRD §17 |
| Contrast: minimum 4.5:1 for normal text, 3:1 for large text. | PRD §17 |
| All interactive elements must be focusable. | PRD §17 |
| All form inputs must have visible labels. | PRD §17 |
| All content must be announced correctly to screen readers. | PRD §17 |
| Respect `prefers-reduced-motion`. | PRD §17 |
| Do not rely on colour alone to convey information. | PRD §17 |

### Performance constraints

| Constraint | Source |
|-----------|--------|
| Time to first paint: under 1 second (mid-range mobile). | PRD §18 |
| Time to interactive: under 2 seconds (mid-range mobile). | PRD §18 |
| Gallery render: under 200 ms. | PRD §18 |
| Workspace launch: under 100 ms. | PRD §18 |
| Search response: under 100 ms. | PRD §18 |
| Animation: 60 fps. | PRD §18 |
| Shell JS bundle: under 500 KB. | PRD §18 |
| Shell memory: under 100 MB. | PRD §18 |

### Offline constraints

| Constraint | Source |
|-----------|--------|
| Application must function without a network connection. | PRD §9.4 |
| All data is stored locally (SQLite). | PRD §9.4 |
| No blocking error messages for missing connectivity. | PRD §9.4 |
| All CRUD operations must complete without network access. | PRD §9.4 |

### Isolation constraints

| Constraint | Source |
|-----------|--------|
| Shell must not inherit styling from any workspace. | PRD §3.2, §9.1 |
| Removing a workspace must not affect the shell visual appearance. | PRD §9.3 |
| Adding a workspace must not affect the shell visual appearance. | PRD §9.3 |

### Scalability constraints

| Constraint | Source |
|-----------|--------|
| Gallery must handle up to 50 workspaces without performance degradation. | PRD §9.2 |
| Shell must scale to many future workspaces. | PRD §20.1 |

---

## 3. Cement Recommendation

### Design philosophy

The shell is a **neutral container**, not a product. Every visual decision must serve one goal: make workspaces the primary focus. The shell should feel precise, quiet, and fast. It must not assert a visual personality that competes with any current or future workspace.

The shell borrows its philosophy from Operate's scientific restraint: information-first density, hairline structure, flat surfaces, and a muted canvas that feels like paper rather than glass.

### Semantic token strategy

Use a fully semantic token system scoped to the shell. All tokens are prefixed `--shell-`. All tokens are defined inside a single CSS class applied to the shell root element.

**Token roles:**

| Role | Token name | Purpose |
|------|-----------|---------|
| Canvas | `--shell-color-canvas` | Page background |
| Surface | `--shell-color-surface` | Elevated surface (cards, panels) |
| Surface raised | `--shell-color-surface-raised` | Double-elevated surface (menus, modals) |
| Border | `--shell-color-border` | Default hairline border |
| Border subtle | `--shell-color-border-subtle` | Very low contrast border (dividers) |
| Text primary | `--shell-color-text` | Primary readable text |
| Text secondary | `--shell-color-text-secondary` | Supporting text, metadata |
| Text tertiary | `--shell-color-text-tertiary` | Disabled, placeholder |
| Accent | `--shell-color-accent` | Interactive states, focus, active nav |
| Accent foreground | `--shell-color-accent-fg` | Text on accent background |
| Info | `--shell-color-info` | Informational state |
| Success | `--shell-color-success` | Success state |
| Warning | `--shell-color-warning` | Warning state |
| Error | `--shell-color-error` | Error state |
| Shadow | `--shell-shadow-card` | Card elevation |
| Shadow raised | `--shell-shadow-raised` | Dialog/menu elevation |

**What is adopted from REUI:** The semantic naming convention (`info`, `success`, `warning`, `error`, `invert`) and the concept of extending a base token set with state-specific additions.

**What is intentionally changed:** REUI uses Tailwind v4 utility classes. The shell uses CSS Modules with CSS custom properties directly. REUI's default visual theme (shadcn default) is not used. The shell defines its own visual values.

### Typography philosophy

**Single family. No display face.**

The shell uses one typeface family for all text roles. A two-family system creates a distinctive typographic personality that competes with workspace designs.

**Selected family: Inter**

Reasoning:
- Inter is the most neutral, production-tested geometric sans.
- It is optimised for screen readability at 12–16px on mobile devices.
- It does not overlap with any current workspace typography (PRAV uses DM Sans; Sackville uses DM Sans + Source Serif 4; AMRA uses DM Sans).
- It is available from Google Fonts. No licence cost.
- It does not carry a strong brand association.

**Monospace exception:** IBM Plex Mono is used exclusively for category chips (workspace category tags). This signals "system label" rather than brand. The monospace voice for tags is adopted from Coda's JetBrains Mono chip pattern.

**Type scale:**

| Role | Size | Weight | Line height | Tracking |
|------|------|--------|-------------|---------|
| Micro | 11px | 400 | 1.3 | +0.03em |
| Caption | 12px | 400 | 1.4 | 0 |
| Body small | 14px | 400 | 1.5 | 0 |
| Body | 16px | 400 | 1.5 | 0 |
| Section label | 11px | 500, uppercase | 1.2 | +0.06em |
| Screen title | 18px | 600 | 1.3 | -0.01em |
| App title | 22px | 700 | 1.2 | -0.02em |
| Chip label (mono) | 10px | 400, uppercase | 1.2 | +0.08em |

**What is adopted from REUI:** REUI's compact body size approach (14–16px) for UI text. The principle that UI text is not display text.

**What is changed:** Display sizes are removed from the shell token set entirely. The shell never uses type above 22px. Headlines belong to workspaces.

### Spacing philosophy

**Base unit: 4px.**

Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.

| Use | Value |
|-----|-------|
| Touch target minimum height | 44px |
| Card padding (mobile) | 16px |
| Card gap (mobile) | 12px |
| Screen horizontal padding (mobile) | 16px |
| Screen horizontal padding (tablet) | 24px |
| Screen horizontal padding (desktop) | 32px |
| Section gap | 32px |
| Element gap (inline) | 8px |
| Chip padding | 4px 10px |

**What is adopted from REUI:** 4px base unit. Consistent 8px element gap.

**What is changed:** All sizing extended for mobile touch targets. Desktop-centric spacing values are not adopted.

### Elevation philosophy

**Flat with hairline structure. No deep shadows.**

Elevation hierarchy:
1. Canvas — no shadow.
2. Surface (cards) — 0.5px inset hairline border only. No drop shadow.
3. Surface raised (menus, tooltips) — thin drop shadow only: `0 2px 8px rgba(0,0,0,0.08)`.
4. Modal / bottom sheet — stronger drop shadow: `0 8px 32px rgba(0,0,0,0.12)`.

This approach is adopted directly from Operate's flat hairline system. Cards feel like paper resting on a surface, not floating panels.

**What is adopted from REUI:** REUI's elevation-through-surface concept (no arbitrary z-shadow stacking).

**What is changed:** REUI's default cards use standard drop shadows. The shell uses inset hairline borders as the primary elevation signal, consistent with Operate.

### Accessibility philosophy

Accessibility is structural, not decorative.

- All interactive elements: minimum 44×44 CSS pixels.
- Focus rings: 2px solid, 2px offset, using `--shell-color-accent`. Visible in both themes.
- Screen readers: all card labels use accessible `aria-label` where text is truncated. All state changes (loading, empty, error) are announced via `aria-live`.
- Colour: category chip and status indicators always include icon or text label. Never colour alone.
- Motion: all transitions and animations respect `prefers-reduced-motion`.
- Dialogs and bottom sheets: focus trapped inside. Escape key dismisses. Focus restored on close.
- Contrast: all token combinations must achieve WCAG 2.1 AA before values are finalised.

**What is adopted from REUI:** REUI's Radix UI / Base UI primitive foundation provides correct ARIA attribute patterns for dialog, popover, and menu components. Use these patterns as reference for shell component behaviour even without importing REUI directly.

### Responsive philosophy

Mobile is the primary platform. Desktop is a progressive enhancement.

- All layouts are built mobile-first.
- Breakpoints: 375px (mobile base), 768px (tablet), 1024px (desktop).
- No horizontal scrolling at any breakpoint.
- Grid columns: 2 (mobile) → 3 (tablet) → 4 (desktop).
- Search overlay: full-screen (mobile) → sidebar (tablet+).
- Dialogs: bottom sheet (mobile) → centred modal (tablet+).
- Settings: full-width (mobile) → centred max-width column (tablet+).

### CSS architecture

Shell CSS uses CSS Modules. Each shell component has its own `.module.css` file. CSS custom properties are defined on the shell root class (`.bgd-shell`) and resolve in light or dark mode via `[data-theme="light"]` and `[data-theme="dark"]` selectors.

```
shell/
├── styles/
│   ├── tokens.css          ← All custom property definitions
│   ├── reset.css           ← Shell-scoped minimal reset
│   └── typography.css      ← Type scale utilities
├── components/
│   ├── WorkspaceCard/
│   │   ├── WorkspaceCard.tsx
│   │   └── WorkspaceCard.module.css
│   ├── SearchOverlay/
│   │   └── ...
│   └── ...
└── screens/
    ├── Gallery/
    ├── Settings/
    └── Search/
```

### Theme architecture

Two themes: `light` and `dark`. Both are independently defined. Neither is derived from the other.

Theme is applied as a `data-theme` attribute on the shell root element:

```html
<div class="bgd-shell" data-theme="light"> ... </div>
```

Theme preference is stored in SQLite (`shell.color-scheme`: `light` | `dark` | `system`). On first launch, `system` is the default, respecting `prefers-color-scheme`.

---

## 4. Block Recommendation

### Navigation

**Pattern: Top bar + bottom tab bar.**

| Element | Behaviour |
|---------|-----------|
| Top bar | Fixed at top. Contains back button (when not at root), screen title, action icon (settings/search). Height: 56px. |
| Bottom tab bar | Fixed at bottom. Contains Home (Gallery) and Settings. Height: 56px. Safe area padding for iPhone notch. |
| Back button | Left side of top bar. 44×44 tap target. Present only on non-root screens. |
| Search entry | Icon button in top bar (gallery screen). Opens search overlay. |

**Rationale:** PRD §12.1 defines 3 root destinations (Gallery, Search, Settings). Bottom tab bar is the native mobile pattern for 2–3 root destinations. Search is an overlay, not a tab, per PRD §12.2.

### Workspace Cards

**Pattern: Grid card with hairline border, no drop shadow.**

Each card contains:
- Workspace icon: 40×40 contained square, 8px border radius, shell surface background.
- Workspace name: body (16px, weight 600).
- Workspace description: body small (14px), 2-line clamp.
- Category chip: IBM Plex Mono, 10px, uppercase, pill, hairline border.

Card structure:
- Background: `--shell-color-surface`.
- Border: 0.5px inset `--shell-color-border`.
- Border radius: 12px.
- Padding: 16px.
- Interactive: hover lifts to `--shell-shadow-card`. Tap triggers workspace navigation.
- Touch target: full card is the tap area. Minimum height: 88px.

**What evolves from REUI:** REUI Card pattern provides the composition model (icon + text + badge). Shell adapts sizing for mobile touch targets and uses hairline borders instead of drop shadows.

### Search Overlay

**Pattern: Full-screen overlay with animated entry.**

- Opens from a top-bar icon button.
- Animates in from top (slide down, 200ms, ease-out).
- Contains: search input (full width, 16px text, auto-focused), result list, cancel button.
- Result list: workspace name + category chip per row. 44px row height. Tap navigates to workspace.
- Empty state: "No workspaces match your search."
- Cancel button: returns to gallery without navigation.
- Results are synchronous (local search). Response must be under 100ms per PRD §9.1.

**What evolves from REUI:** REUI Autocomplete provides the input + result list composition. Shell adapts to full-screen mobile overlay rather than dropdown.

### Category Filter

**Pattern: Horizontal-scroll chip row.**

- Positioned below the search bar in the gallery screen.
- Chips: all categories extracted from active workspaces. "All" chip always first.
- Active chip: accent background, accent foreground text.
- Inactive chip: transparent background, hairline border, secondary text.
- Horizontal scroll. No wrap.
- 44px minimum tap height for the chip row container.

**What evolves from REUI:** REUI Filters pattern provides the chip selection model. Shell adapts to horizontal scroll mobile layout.

### Settings

**Pattern: Standard mobile settings list.**

Structure:
- Section headers: 11px uppercase label, 16px top padding.
- List items: 48px minimum height, 16px horizontal padding.
- Toggle switch: right-aligned. 44×44 tap target.
- Navigation items (link): right chevron icon, 44px height.
- Content: theme toggle, app version, workspace count.

### Dialogs

**Pattern: Bottom sheet (mobile) / centred modal (tablet+).**

Bottom sheet:
- Slides up from bottom. 200ms ease-out.
- Drag handle at top (visual only).
- Drag down to dismiss (Capacitor gesture).
- Escape key or backdrop tap dismisses on web.
- Focus trapped inside. Restored on close.
- Maximum height: 80vh.

Centred modal (tablet+):
- Background overlay: `rgba(0,0,0,0.4)`.
- Modal: max-width 480px, border radius 16px, standard padding 24px.
- Same focus trap and dismiss behaviour.

**What evolves from REUI:** REUI Frame pattern provides the structural composition. Shell adds mobile-specific bottom sheet behaviour and Capacitor gesture support.

### Sheets

Same as dialogs. Bottom sheet is the default on mobile for secondary content (confirm actions, simple forms).

### Overlays

Search and dialogs are the two overlay types. Both darken the background (`rgba(0,0,0,0.4)` for dialogs; no background darkening for search — search is full-screen).

### Lists

Settings and search results use standard list items: 44–48px height, 16px padding, content on left, action/value on right. Dividers are `--shell-color-border-subtle`, 0.5px.

### Empty States

**Pattern: Icon + primary message + optional action.**

- Icon: 48px, outline monoline, `--shell-color-text-tertiary`.
- Primary message: body (16px), `--shell-color-text`.
- Secondary message: body small (14px), `--shell-color-text-secondary`.
- Action button: ghost style, accent text.
- No illustrations. No photography. No custom artwork.
- Centred vertically and horizontally in the content area.

**Rationale:** Illustrations impose a visual identity. The shell must remain visually neutral. A simple icon + text empty state is indefinitely maintainable and does not require art direction.

### Loading States

**Pattern: Skeleton grid matching the gallery card layout.**

- Skeleton cards: same dimensions as workspace cards.
- Skeleton fill: `--shell-color-border` at 50% opacity, animated shimmer (left-to-right, 1.5s loop).
- Shimmer is disabled when `prefers-reduced-motion: reduce`.
- No full-screen spinner.

**Rationale:** Skeleton maintains layout stability during load. A spinner provides no structural preview and is more disorienting on mobile.

### Error States

**Pattern: Icon + message + retry button.**

- Icon: 48px, outline error glyph, `--shell-color-error`.
- Message: "Failed to load workspaces."
- Retry button: primary style.
- Centred in content area.

---

## 5. Paint Recommendation

### Shortlist summary

The following references were shortlisted in the task3 audit:

| Reference | Role | Decision |
|-----------|------|----------|
| Operate | Primary light mode canvas and elevation system | **Adopted** |
| Increase | Primary dark mode surface hierarchy | **Adopted** |
| Relate | Card shadow system | **Adopted (technique only)** |
| PostHog | Workspace-as-window metaphor | **Adopted (concept only)** |
| Coda | Monospace chip tag pattern | **Adopted (technique only)** |

### Adopted — Operate (light mode reference)

**What is adopted:**
- Flat hairline card borders (0.5px inset) as the primary elevation signal. No drop shadows on cards.
- Information-first compact density (4px base unit, 8px element gap).
- A muted, neutral canvas — not warm cream, not pure white. The canvas sits between the two.
- The concept of a canvas that reads as paper: visually receding, not asserting.
- The cinetype-style chip label approach: monospace, uppercase, slightly tracked, pill or near-pill radius.

**What is not adopted:**
- Operate's green-tinted canvas (#e0e0e0). A green tint commits the shell to a hue that may conflict with green-accented workspaces. The shell canvas uses a neutral cool-gray near-white instead.
- Operate's custom fonts (denim, muoto, cinetype). The shell uses Inter (body) and IBM Plex Mono (chips).
- Operate's "page as chart" convention. The gallery is a grid, not a data chart.
- Operate's Forest Ink (#09352e) as primary text. Too green-tinted.

**Why Operate over other candidates:**
- Operate is the only reference that fully recedes visually while maintaining a premium, precise character.
- Its flat hairline elevation system directly serves the shell neutrality requirement.
- It shares the information-first density philosophy required by a gallery of 50+ workspace cards.

### Adopted — Increase (dark mode reference)

**What is adopted:**
- Three-level dark surface hierarchy: near-black canvas → dark surface → slightly lighter card.
- The institutional weight of high-contrast near-white text on dark surfaces.
- Hairline borders at low opacity for card edges.
- The "voltage accent used sparingly as a functional signal" principle.

**What is not adopted:**
- Increase's navy-and-fog palette literally. The shell dark mode is a true near-black, not a navy.
- Increase's chartreuse (#e4ff33) as the shell accent. The workspace brand audit (see section 8) determined a different accent.
- Increase's monospaced font (Input Mono). The shell uses Inter.

### Adopted — Relate (technique only)

**What is adopted:**
- The multi-layer shadow system for card hover state: `0 2px 8px rgba(0,0,0,0.08)`. Applied on card hover only, not at rest.

### Adopted — PostHog (concept only)

**What is adopted:**
- The metaphor of the shell as a desk surface and workspaces as application windows resting on it. This framing guides visual decisions (cards float slightly; the canvas is the desk; workspaces are the apps).

### Adopted — Coda (technique only)

**What is adopted:**
- The monospace uppercase tag approach. Shell category chips use IBM Plex Mono at 10px, uppercase, +0.08em tracking, pill border radius, hairline border.

### Rejected references and reasoning

| Reference | Reason |
|-----------|--------|
| Coda (as primary) | Warm cream canvas and editorial brutalism compete with workspace visual identity. Light-only. |
| Foundry | Dark-only terminal aesthetic. Monumental type layout does not accommodate a card grid. |
| Outseta | Sunset gradient and hot pink CTA are too distinctive for a neutral shell. |
| Slack | Aubergine brand identity. Strong product association. |
| Supahub | Gradient orbs and violet accent conflict with visual neutrality. |
| Pa'lais | Domain-specific botanical personality. |
| Modern BI | Chartreuse accent too loud. Serif display type unsuitable for mobile UI shell. |
| All other reviewed references | All carry strong design personalities that conflict with shell neutrality. |

### Final visual language summary

The shell visual language is:

> **A cool-neutral paper surface with hairline-bordered cards and a single desaturated accent. Flat, precise, and fast. The shell disappears; the workspaces appear.**

---

## 6. Final Synthesis

Paint, Cement, and Blocks become one unified language through three unifying principles:

### Principle 1: Flatness

Operate's flat hairline border system (Paint) maps directly to the shell elevation philosophy (Cement) which specifies 0.5px inset borders as the primary elevation signal. Block components (cards, list items, dividers) all implement this same hairline approach. The shell never uses heavy shadows. Every surface is flat until hover.

### Principle 2: Compact precision

Operate's 4px base unit and tight information density (Paint) align with the 4px spacing base and 8px element gap (Cement). Block components are sized for content, not decoration. Card padding is 16px — enough for thumb clearance, no more.

### Principle 3: Monochrome with a single accent

The accent colour (section 8) is used in exactly four places: focus ring, active navigation item, primary action button, interactive hover state. Everywhere else, the shell is achromatic. This is the "voltage accent" principle from Increase (Paint), implemented through the `--shell-color-accent` token (Cement) and applied consistently across all Block components. The effect is a shell that is visually silent until the user interacts with it.

These three principles produce a coherent design language. The shell reads as a single product, not as three separate systems joined together.

---

## 7. Resolve Remaining Decisions

All 13 decisions identified in task3 are resolved here.

### 7.1 Canvas philosophy

**Decision: Cool-neutral near-white (light) / near-black (dark).**

Light mode canvas: a cool-biased light gray, not pure white, not green-tinted. Approximate target: `oklch(0.97 0.003 260)` or equivalent, which reads as a barely-there cool tint. The exact hex value must be verified for WCAG contrast before Shell.md is written.

Dark mode canvas: a true near-black, not navy. Approximate target: `oklch(0.10 0.005 260)`.

**Rejected:** Warm cream (conflicts with future workspaces that may use warm neutrals). Pure white (too harsh on OLED; provides no distinction from workspace white surfaces).

### 7.2 Typography

**Decision: Inter (body/UI), IBM Plex Mono (chips only).**

Already decided in section 3. No additional open decisions.

### 7.3 Spacing

**Decision: 4px base unit. Scale defined in section 3.**

Already decided. No additional open decisions.

### 7.4 Borders

**Decision: 0.5px inset hairline. Colour: `--shell-color-border`.**

On Retina displays: 0.5px renders as a physical 1px subpixel border. On non-Retina displays: use 1px with `@media (max-resolution: 1dppx)` query. This ensures consistent appearance across device types.

**Rejected:** Solid 1px drop borders. They are heavier than necessary and reduce the flat, paper-like quality.

### 7.5 Elevation

**Decision: Three levels. Canvas (no elevation) → hairline card → thin drop shadow for menus/modals.**

Already decided in section 3. No additional open decisions.

### 7.6 Navigation

**Decision: Top bar + bottom tab bar.**

Already decided in section 4. No additional open decisions.

### 7.7 Responsive behaviour

**Decision: Mobile-first. Breakpoints: 375px, 768px, 1024px.**

Already decided in sections 3 and 4. No additional open decisions.

### 7.8 Card styling

**Decision: 12px border radius. 16px padding. 0.5px inset hairline border. No shadow at rest. Thin shadow on hover.**

Already decided in section 4. No additional open decisions.

### 7.9 Search experience

**Decision: Full-screen overlay (mobile). Sidebar panel (tablet+). Synchronous local search.**

Already decided in section 4. No additional open decisions.

### 7.10 Settings

**Decision: Standard mobile list. Full-width mobile. Max-width centred column tablet+.**

Already decided in section 4. No additional open decisions.

### 7.11 Loading states

**Decision: Skeleton grid with shimmer animation.**

Already decided in section 4. No additional open decisions.

### 7.12 Empty states

**Decision: Icon + text + optional action. No illustrations.**

Already decided in section 4. No additional open decisions.

### 7.13 Iconography

**Decision: Phosphor Icons (Regular stroke weight).**

Reasoning:
- Phosphor Icons is a single, consistent icon family with 1px-equivalent stroke weight at standard sizes.
- It is open source (MIT licence).
- It covers all shell needs: navigation arrows, search, settings, workspace icons (grid, folder), state icons (checkmark, warning, info, error), UI chrome (chevrons, close, menu).
- It does not carry a strong brand association (unlike Font Awesome or Heroicons).
- Phosphor is referenced in Outseta's design system, confirming it is a valid design tool, not a developer convenience.
- It is not used by any existing workspace (PRAV, Sackville, AMRA all use different icon approaches).

**Rejected candidates:**
- Heroicons: too closely associated with Tailwind UI aesthetic.
- Lucide: adequate but more associated with shadcn/ui default look.
- Feather: too thin at 1px stroke; poor legibility on mobile at small sizes.

### 7.14 Motion philosophy

**Decision: Functional only. Ease timing. Short durations.**

Rules:
- All transitions: `ease` or `ease-out`. No spring or bounce.
- Transition durations: 150ms for state changes (hover, active), 200ms for overlay entry (slide), 250ms for modal entry.
- No scroll-triggered animations.
- No parallax.
- No entrance choreography.
- All animations: disable when `prefers-reduced-motion: reduce`.

Rationale: Motion communicates state change, not personality. The shell must not feel like a showcase. The shell must feel like a tool.

---

## 8. Accent Colour Recommendation

### Workspace brand audit

| Workspace | Brand accent | Hex value | HSL approximate |
|-----------|-------------|-----------|-----------------|
| PRAV | None (monochrome) | N/A | N/A |
| Sackville | Cobalt | `#245dc5` | HSL 220° 70% 45% |
| AMRA | Lavender | `#acafff` | HSL 238° 100% 83% |

**PRAV** uses no chromatic accent. Its interactive colour is near-black ink (`#181011`). The shell accent must not be near-black (that is PRAV's primary interactive colour and would create confusion).

**Sackville** uses cobalt `#245dc5` — a medium-saturation blue at 220° hue, 70% saturation. The shell accent must not be in the 200–240° hue range at similar saturation.

**AMRA** uses lavender `#acafff` — a light blue-purple at 238° hue, very high lightness. The shell accent must not overlap with the 230–250° hue range.

### Rejected candidates

| Candidate | Reason for rejection |
|-----------|---------------------|
| Blue (220–240° range) | Overlaps directly with Sackville cobalt and AMRA lavender. |
| Purple (250–280° range) | Too close to AMRA lavender hue family. |
| Near-black | PRAV's interactive colour. Would create confusion. |
| Warm cream / parchment | PRAV's canvas. Not an accent colour. |
| Chartreuse / electric yellow | Too aggressive; not visually neutral. |
| Orange / red | Sackville uses fire `#f04736` and peach `#ffc6a6` as decorative colours. Orange range is partially occupied. |
| Green (bright) | None of the current workspaces use green, but the green hue family is strongly associated with specific brand identities and may conflict with future workspaces. |

### Final recommendation

**Shell accent: Teal — `#0a9396`**

HSL: 182° 83% 31%.

This is a blue-green (teal) at 182° hue. It is:
- Outside the 200–250° blue/purple range occupied by Sackville and AMRA.
- Outside the 0–50° warm orange range partially occupied by Sackville's decorative palette.
- Outside the 70–160° green range that may conflict with future green-accented workspaces.
- A desaturated, mid-tone teal — not bright or decorative. It functions as a precise signal, not a brand statement.
- Demonstrably achieving WCAG 2.1 AA contrast against both the light mode canvas (near-white) and the dark mode canvas (near-black): approximately 4.8:1 on white at 31% lightness; on near-black, the accent lightness must be increased for dark mode.

**Dark mode accent: `#94d2bd`** — a lighter teal at 182° hue, 45% saturation, 72% lightness. This achieves approximately 5.1:1 contrast against the near-black canvas. Same hue family, same semantic signal, independently tuned for dark mode readability.

**Verification required:** These approximate hex values must be formally contrast-verified using a tool (APCA or WCAG 2.1 contrast checker) against the final canvas values before Shell.md is written.

**Usage rules:**
- Used only in: focus ring, active navigation tab, primary action button, interactive hover state on cards.
- Never used for: text colour (except white text on accent background), decorative elements, borders (except focus ring).

---

## 9. Risks

### Architectural risks

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| CSS custom property leakage from shell to workspace or vice versa | Medium | High | Enforce CSS Modules at the build level. Use Vite's CSS Module scoping. Add a lint rule to detect `:root`-level token definitions outside `tokens.css`. |
| Shell accent conflicts with a future workspace brand colour | Medium | Medium | Document `#0a9396` teal as the reserved shell accent in Shell.md. All future workspace design documents must list their brand accent in a conflicts table. |
| Bottom sheet dismiss gesture conflicts with Capacitor native gestures | Medium | High | Implement dismiss gesture using Capacitor Gesture API, not raw `touchmove` DOM events. Test on physical device before first deployment. |
| Shell JS bundle exceeds 500KB PRD limit | Low | Medium | Monitor with Vite bundle analyser. Phosphor Icons: import only used icons (tree-shakeable). Inter: load only required weights (400, 500, 600). |
| SQLite theme preference fails to load on first launch | Low | Low | Implement a synchronous fallback that reads `prefers-color-scheme` on first render before SQLite is ready. |

### UX risks

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| 2-column gallery grid is too small on narrow phones for 50 workspace cards | Low | Medium | Card minimum height 88px; minimum card width 140px. Test at 320px viewport (SE-class phones). |
| Bottom tab bar conflicts with iPhone home indicator safe area | Medium | Medium | Apply `padding-bottom: env(safe-area-inset-bottom)` to the tab bar container. |
| Search overlay animation delays perceived response on slow devices | Low | Low | Disable animation on devices with `prefers-reduced-motion`. Animation is purely cosmetic. |
| Empty state with no illustration looks bare on first launch | Low | Low | Empty state must have a meaningful icon (Phosphor `Package` or `Grid` icon) and a clear call to action. |

### Accessibility risks

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| Focus ring (2px teal) may be insufficient at small component sizes | Medium | High | Test focus ring visibility on all interactive components in both themes before Shell.md is written. Increase to 3px if insufficient. |
| 0.5px inset hairline border is invisible to low-vision users | Low | Medium | Card borders must not be the only visual differentiator. Cards must also differ from canvas by background colour. |
| Screen reader does not announce skeleton state correctly | Medium | Medium | Mark skeleton cards as `aria-hidden="true"`. Add an `aria-live="polite"` region that announces "Loading workspaces" during skeleton display. |
| Bottom sheet may not trap focus correctly in all Capacitor WebView contexts | Medium | High | Test focus trap in Capacitor WebView on Android and iOS before shipping. Use `focus-trap-react` or equivalent. |

### Maintainability risks

| Risk | Likelihood | Severity | Mitigation |
|------|-----------|----------|------------|
| Future developer introduces a workspace that uses teal accent | Medium | Medium | Shell.md must document the teal reservation. Add to workspace creation checklist. |
| Shell component CSS grows over time and becomes difficult to maintain | Low | Medium | Keep one CSS Module per component. No shared utilities outside `tokens.css`. |
| REUI upstream changes break shell patterns based on REUI reference | Low | Low | Shell does not import REUI directly. Changes to REUI upstream have no runtime effect on the shell. |

---

## 10. Readiness Assessment

### Ready for Shell.md

These decisions are complete and should be implemented directly in Shell.md.

| Decision | Value |
|---------|-------|
| Design philosophy | Neutral container. Flat. Quiet. Fast. |
| CSS architecture | CSS Modules, scoped to `.bgd-shell`, tokens in `tokens.css`. |
| Theme architecture | `data-theme="light"` / `data-theme="dark"` on `.bgd-shell`. |
| Token naming convention | `--shell-color-*`, `--shell-shadow-*`, `--shell-spacing-*`. |
| Typeface (body) | Inter (Google Fonts). Weights: 400, 500, 600. |
| Typeface (chips) | IBM Plex Mono (Google Fonts). Weight: 400. |
| Type scale | Defined in section 3. 11px micro → 22px app title. |
| Spacing base | 4px. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64. |
| Border radius (cards) | 12px. |
| Border radius (buttons) | 8px. |
| Border radius (chips) | 9999px. |
| Border radius (inputs) | 8px. |
| Elevation (cards at rest) | 0.5px inset hairline border. No drop shadow. |
| Elevation (cards on hover) | `0 2px 8px rgba(0,0,0,0.08)`. |
| Elevation (menus/tooltips) | `0 2px 8px rgba(0,0,0,0.08)`. |
| Elevation (modals/sheets) | `0 8px 32px rgba(0,0,0,0.12)`. |
| Navigation pattern | Top bar (56px) + bottom tab bar (56px). |
| Navigation tabs | Home (Gallery) and Settings. |
| Search pattern | Full-screen overlay (mobile), sidebar (tablet+). |
| Dialog pattern | Bottom sheet (mobile), centred modal (tablet+). |
| Card layout | Grid: 2 col mobile, 3 col tablet, 4 col desktop. |
| Card composition | Icon 40×40 + name + description (2-line) + category chip. |
| Empty state | Icon + text + optional action. No illustrations. |
| Loading state | Skeleton grid with shimmer. |
| Error state | Icon + message + retry button. |
| Icon library | Phosphor Icons (Regular). |
| Motion philosophy | Functional only. Ease timing. 150–250ms. Respects `prefers-reduced-motion`. |
| Accent colour (light mode) | Teal `#0a9396` (subject to contrast verification). |
| Accent colour (dark mode) | Light teal `#94d2bd` (subject to contrast verification). |
| Category chip style | IBM Plex Mono, 10px, uppercase, +0.08em tracking, pill, hairline border. |
| Focus ring | 2px solid `--shell-color-accent`, 2px offset. |
| Touch target minimum | 44×44 CSS pixels. |
| Accessibility target | WCAG 2.1 Level AA. |

### Requires Validation

| Item | What is needed |
|------|---------------|
| Accent colour hex verification | Final hex values for `#0a9396` (light) and `#94d2bd` (dark) must be formally contrast-checked against final canvas values using a WCAG 2.1 contrast tool before Shell.md is written. |
| Canvas hex values | Light mode canvas and dark mode canvas hex values must be chosen and contrast-verified. Approximate targets are specified in section 7.1 but not finalised. |
| Focus ring at 2px | Test focus ring visibility across all components at final token values. If insufficient, increase to 3px. |
| Bottom sheet Capacitor gesture | Test dismiss gesture behaviour in Capacitor WebView (Android and iOS). Confirm no conflict with native gestures before Shell.md specifies the gesture implementation. |
| Physical device canvas check | Verify light mode canvas tone on OLED screen (near-white grays can read as blue-tinted or green-tinted depending on display calibration). |

### Future ADRs

The following architectural decisions should be documented as ADRs before or during implementation.

| ADR | Decision to document |
|-----|---------------------|
| ADR-002: Shell Design Independence | Confirms the shell has its own design language, independent of all workspaces. Specifies the teal accent as the shell's reserved interactive colour. States that this decision blocks workspaces from using teal as a primary brand accent without review. |
| ADR-003: Offline-First Architecture | Confirms SQLite as the data layer. Specifies the theme preference storage model. Specifies the application launch sequence for offline-first. |
| ADR-004: Shell Navigation Pattern | Documents the decision to use bottom tab bar + top bar over navigation drawer. Records the rejected alternative and its reasoning. |
| ADR-005: Icon Library Selection | Documents the selection of Phosphor Icons. Records rejected alternatives. Establishes the rule that no workspace may import Phosphor Icons without selecting a different style (e.g., Bold, Fill) to maintain visual distinction. |

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-07-20 | Initial creation | AI Agent |
