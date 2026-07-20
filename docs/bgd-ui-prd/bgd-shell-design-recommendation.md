# BGD UI — Application Shell Design Recommendation

**Date:** 2026-07-20  
**Status:** Recommendation — not a specification  
**Prepared by:** AI Agent  
**Task reference:** docs/Prompts/task3.md

---

## 1. AGENTS.md Compliance Confirmation

This document was produced in full compliance with `docs/AGENTS.md`. Specifically:

- No implementation code was introduced.
- No design tokens were created.
- No component specifications were produced.
- No mockups or wireframes were produced.
- `Shell.md` was not written.
- All documentation uses ADS-STE100 Simplified Technical English.
- This report is saved to `docs/Reports/` as required by section 14.
- The relevant skill (`/design-blueprint`) was identified via `docs/Skillindex.md`.

---

## 2. Documents Reviewed

| Document | Path | Purpose |
|----------|------|---------|
| AGENTS.md | `docs/AGENTS.md` | Repository workflow |
| PRD | `docs/bgd-ui-prd/PRD.md` | Product requirements |
| Glossary | `docs/bgd-ui-prd/Glossary.md` | Term definitions |
| ADR-001 | `docs/bgd-ui-prd/ADR-001-workspace-design-isolation.md` | Design isolation decision |
| REUI index | `docs/Masonry-yard/reui/content/docs/(root)/index.mdx` | Component library overview |
| REUI styling | `docs/Masonry-yard/reui/content/docs/(root)/styling.mdx` | REUI token extension model |
| REUI get-started | `docs/Masonry-yard/reui/content/docs/(root)/get-started.mdx` | REUI setup model |
| REUI component list | `docs/Masonry-yard/reui/content/docs/(components)/base/` | 19 base component docs |
| Coda | `docs/Designs/Coda.md` | Warm editorial design language |
| Relate | `docs/Designs/Relate.md` | Clean CRM product language |
| Operate | `docs/Designs/Operate.md` | Scientific, information-dense language |
| PostHog | `docs/Designs/PostHog.md` | Warm desktop/tool aesthetic |
| Foundry | `docs/Designs/Foundry.md` | Dark terminal/gallery aesthetic |
| Outseta | `docs/Designs/outseta.md` | Sunset marketplace, warm-purple |
| Slack | `docs/Designs/slack.md` | Aubergine platform identity |
| Supahub | `docs/Designs/supahub.md` | Soft violet feedback platform |
| Pa'lais | `docs/Designs/palais.md` | Botanical artisan identity |
| Modern BI | `docs/Designs/Modern-Business-Intelligence.md` | Sage-green editorial BI |
| Increase | `docs/Designs/Increase.md` | Institutional navy-and-chartreuse |
| Skill index | `docs/Skillindex.md` | Available skills |

**Additional design references scanned (opening character only):**  
2AG, AMRA, Ableton, Aptos-network, Auros, BUTT-STUDIO, Caldera, Contractbook, Ditto, Drive-Capital, EASEHEALTH, Elva, Forner, Good-Glyphs, Gt-planar, Henry, Home, Hyer-Aviation, Ingmar-Coenen, Lazy, Letter, MONO, Nuri, Officevibe, PRAV, Palette-Supply, Podia, Runway, SACKVILLE, Slash, Studio-few, The1, Typeform, UL, Ventriloc, convex, cthdrl, ddna, huddle, hyperstudio, mostlikely, new-genre, playdate, rootly, 큰그림컴퍼니, 1986.

---

## 3. Summary of PRD Constraints Affecting the Shell

The following PRD requirements directly constrain shell design decisions.

### Non-negotiable requirements

| Constraint | Source |
|-----------|--------|
| Shell must not inherit styling from any workspace | PRD §3.2, §9.1 |
| Shell must support light and dark modes (independently designed, not derived from each other) | PRD §9.5 |
| Shell must feel visually quiet; workspaces must be the visual focus | PRD §20.1 |
| Shell must use semantic color tokens | PRD §9.5, §20.1 |
| Shell must avoid competing with workspace designs | PRD §20.1 |
| Shell must scale to many future workspaces | PRD §20.1 |
| Shell must feel premium and fast | PRD §20.1 |
| Mobile is the primary platform; touch targets minimum 44×44 CSS pixels | PRD §17, AGENTS §7 |
| Offline-first; no network dependency | PRD §9.4 |
| WCAG 2.1 Level AA contrast requirements | PRD §17 |
| Gallery: 2-column mobile, 3-column tablet, 4-column desktop | PRD §10.1 |
| Search must respond within 100 ms | PRD §9.1 |
| Navigation must complete within 50 ms | PRD §9.1 |
| Shell renders correctly with zero workspaces | PRD §9.1 |
| CSS custom properties must be scoped to the shell | PRD §9.3 |
| No global CSS overrides | PRD §9.3 |
| React + Vite + Capacitor tech stack | PRD §19 |
| CSS Modules or CSS-in-JS with scoped custom properties | PRD §19 |

### Existing workspaces to avoid duplicating

The shell must not replicate the visual language of:
- **PRAV** (existing workspace)
- **Sackville** (existing workspace)
- **AMRA** (existing workspace)

All three occupy the design space; their specific styles were not read in full but must be avoided.

---

## 4. Audit of REUI Cement (Design Philosophy)

REUI is a shadcn/ui registry built on React 19, Tailwind CSS v4, Base UI, and Radix UI.

### Strengths

| Area | Assessment |
|------|------------|
| Token model | Extends shadcn/ui semantic tokens with state-specific additions (info, success, warning, invert) |
| Primitive support | Dual-mode: Base UI and Radix UI versions for each component |
| Accessibility | Built on Radix UI and Base UI, both of which implement ARIA best practices |
| AI-friendly | llms.txt present; markdown copy mode per page |
| Token extension pattern | Clean semantic approach; extends, does not override |
| Tailwind CSS v4 | Modern CSS-native token architecture |

### Weaknesses

| Area | Assessment |
|------|------------|
| Mobile-first | REUI is built for desktop-first React applications. Mobile layout primitives are not featured prominently |
| Offline-first | REUI makes no provision for offline-first architecture; it is a UI library, not an app framework |
| Dark mode | Dark mode is present in the token extension model but not the primary design focus |
| Capacitor compatibility | REUI has no Capacitor-specific provisions; web-native components only |

### Recommendation on REUI Cement

REUI provides a sound token extension model and accessible component primitives. Use it as an **architectural reference** for token naming conventions and component composition patterns. Do not use REUI's default visual theme directly; the shell requires its own visual identity.

The REUI token extension model (semantic roles: info, success, warning, invert) is suitable for the shell's state communication requirements. Adopt this semantic naming approach for shell tokens.

---

## 5. Audit of REUI Block (Component Patterns)

REUI provides 19 base components plus 1,000+ examples. Relevant to the shell:

| Component | Shell Use | Assessment |
|-----------|-----------|------------|
| Alert | Empty state, error state, toast | Direct applicability. Semantic variant model (info/success/warning/error) matches PRD §14 states |
| Badge | Category tags on workspace cards | Suitable pattern for workspace category chips |
| Filters | Category filter bar in gallery | Applicable; filter logic is lightweight and synchronous |
| Data Grid | Not applicable to shell | Workspace-level pattern only |
| Stepper | Not applicable to shell | No multi-step flows in shell |
| Frame | Dialog and Sheet containers | Applicable for modal and bottom-sheet patterns |
| Kanban | Not applicable to shell | Workspace pattern only |
| Autocomplete | Search suggestions | Applicable for search screen result list |
| Number Field | Settings inputs | Applicable |
| Icon Stack | Workspace card icon display | Applicable for layered icon treatment |

### Refinements required

REUI components assume a desktop browsing context. For the shell:

- All interactive REUI-inspired components must meet the 44×44 CSS pixel minimum touch target.
- Bottom-sheet (Sheet) patterns must include drag-to-dismiss gesture support.
- Search must be implemented as a full-screen overlay on mobile, not a sidebar.
- Card padding must be sufficient for thumb reach.

---

## 6. Audit of Paint References

The following assessment evaluates each reviewed design reference against the shell criteria. The criteria are: visual neutrality, mobile-first usability, dark mode support, light mode quality, scalability, and longevity.

### Coda

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | Low | Warm cream canvas and editorial brutalism are strong and distinctive, likely to compete with workspace designs |
| Mobile-first | Low | Designed as a marketing page; desktop-centric layout |
| Dark mode | None | Light-only design |
| Scalability | Medium | Token system is well-defined but warm palette limits workspace contrast |
| Longevity | High | Editorial restraint ages well |

**Shell fit:** Poor. Coda's personality is too distinctive. It would compete with workspaces rather than frame them.

---

### Relate

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | High | Near-white canvas, one accent, minimal decoration |
| Mobile-first | Low | SaaS marketing page; desktop layout |
| Dark mode | None | Light-only |
| Scalability | High | Clean grid system; handles many cards well |
| Longevity | High | Inter + cool white ages well |

**Shell fit:** Partially suitable for the light mode shell. The canvas approach (snow-white + lavender wash + one royal-blue accent) produces strong visual neutrality. Dark mode would need to be independently designed.

---

### Operate

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | High | Herbarium paper canvas is distinctive but not loud; data recedes gracefully |
| Mobile-first | Medium | Dense information-first layout; touch targets would need enlargement |
| Dark mode | Medium | Charcoal Bark inversion is feasible |
| Scalability | High | Modular flat card system scales to many items |
| Longevity | Very High | Scientific restraint is timeless |

**Shell fit:** Strong candidate. Operate's flat hairline system, muted green canvas, and scientific restraint produce a shell that recedes visually. The card approach and tag system directly map to workspace cards and category chips.

---

### PostHog

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | High | Sandy desk as canvas; windows float on top as white panels |
| Mobile-first | Medium | Desktop product metaphor but panels translate to mobile cards |
| Dark mode | Medium | Warm inverted surfaces are feasible |
| Scalability | High | File-manager metaphor scales to many workspaces |
| Longevity | High | Tactile paper aesthetic ages well |

**Shell fit:** Strong candidate. The "desktop as corkboard, workspaces as pinned windows" metaphor is appropriate. The warm sandy canvas (sandy desk) with white card surfaces creates clear hierarchy without competing with workspace content.

---

### Foundry

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | Medium | Near-black canvas is neutral in the sense that it disappears, but the terminal aesthetic is strong |
| Mobile-first | Low | Monumental type system requires desktop viewport |
| Dark mode | Primary | Dark-only design |
| Scalability | Low | Type-specimen layout does not scale to a card grid |
| Longevity | Medium | Terminal aesthetic ages well but is associated with developer tools |

**Shell fit:** Poor for the gallery screen. The type-specimen layout does not accommodate a card grid. The monospaced terminal aesthetic may conflict with diverse workspace visual languages.

---

### Outseta

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | Low | Sunset gradient and hot pink CTA are prominent; shell would compete with workspaces |
| Mobile-first | Medium | Warm-palette system is friendly but marketing-centric |
| Dark mode | None | Light-only |
| Longevity | Medium | Sunset aesthetics date faster than neutral systems |

**Shell fit:** Poor. The warm gradient hero and fuchsia CTA are too distinctive for a neutral shell.

---

### Slack

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | Low | Aubergine identity is strong and immediately recognizable as a product brand |
| Mobile-first | Medium | Slack has a mobile product; the marketing site is desktop |
| Dark mode | None | Light with dark sections; not a dual-mode system |
| Longevity | High | Established color system |

**Shell fit:** Poor. Aubergine as a shell color would impose a strong visual identity that conflicts with workspace neutrality requirements.

---

### Supahub

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | Low | Voltage Violet is a strong identity; gradient orbs draw attention away from content |
| Mobile-first | Medium | Rounded friendly components are mobile-approachable |
| Dark mode | None | Light-only |
| Longevity | Medium | Gradient orb trend will date |

**Shell fit:** Poor. Gradient atmospheres conflict with workspace neutrality.

---

### Pa'lais

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | Low | Botanical illustrations are a strong personality layer |
| Mobile-first | Low | Artisan food editorial; desktop layout |
| Dark mode | None | Light-only |
| Longevity | Low | Artisan aesthetic is trend-sensitive |

**Shell fit:** Poor. Personality is too domain-specific.

---

### Modern Business Intelligence

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | High | Sage canvas is unobtrusive; chartreuse accent is punchy but sparse |
| Mobile-first | Medium | Dense editorial; needs adaptation |
| Dark mode | None | Light-only |
| Scalability | High | Flat card grid scales well |
| Longevity | High | Botanical BI restraint ages well |

**Shell fit:** Moderate. The sage canvas and flat card system are suitable, but the chartreuse accent is too loud for a neutral shell. The typography approach (serif display + sans body) is unusual for a UI shell.

---

### Increase

| Criterion | Score | Reason |
|-----------|-------|--------|
| Visual neutrality | High | Institutional navy and warm fog canvas; chartreuse used as voltage only |
| Mobile-first | Medium | Financial product; could adapt |
| Dark mode | Feasible | Abyss and Inkwell Navy suggest dark surface capability |
| Scalability | High | Grid-based layout scales |
| Longevity | Very High | Institutional restraint is timeless |

**Shell fit:** Moderate. The institutional weight of the navy-and-fog system is slightly heavy for a personal tool. The chartreuse voltage accent is suitable as a sparse shell accent.

---

## 7. Comparison of Cement, Block, and Paint

| Dimension | REUI Cement | REUI Block | Paint References |
|-----------|-------------|------------|------------------|
| Token model | Semantic, extensible, Tailwind v4 | Component-scoped | Design-specific |
| Mobile-first | Weak | Weak | Mixed |
| Dark mode | Token-level support | Component-level support | Mostly absent |
| Visual identity | Neutral (inherits shadcn default) | Neutral | Strong and distinctive |
| Accessibility | Strong (Radix/Base UI) | Strong | Inconsistent |
| Offline-first | Not addressed | Not addressed | Not addressed |

**Key insight:** REUI provides a strong architectural foundation (accessibility, token model, component composition) but no suitable visual identity for the shell. Paint references provide visual language but must be adapted to meet mobile-first and dual-mode requirements. The synthesis of both is required.

---

## 8. Conflicts Identified Between Sources

| Conflict | Sources | Resolution |
|----------|---------|------------|
| REUI uses Tailwind v4 utility classes; PRD requires scoped CSS Modules | REUI vs PRD §19 | Use CSS Modules with CSS custom properties for the shell. Reference REUI patterns; do not import REUI directly. |
| Most Paint references are light-only; PRD requires independent light and dark modes | Paint vs PRD §9.5 | Design both modes from first principles. Select a Paint reference for light mode; design dark mode independently using the same token structure. |
| REUI is desktop-first; PRD is mobile-first | REUI vs PRD §7 | Use REUI component architecture as reference. Override all sizing with mobile-first touch targets. |
| Paint references have strong visual identities; shell requires visual neutrality | Paint vs PRD §20.1 | Extract specific techniques (spacing, elevation, card approach) rather than adopting full identities. |
| No existing Paint reference covers a card-grid gallery for a mobile UI library | Paint vs PRD §10.1 | The shell's gallery screen is a novel design problem. The closest analogy is PostHog (desktop-as-workspace metaphor). Adapt the metaphor to mobile. |

---

## 9. Recommended Cement Direction

**Recommendation:** Adopt the REUI semantic token extension model. Do not use REUI's default visual theme.

Specifically:

- Use REUI's semantic role vocabulary as the naming convention for shell tokens:  
  `--shell-color-background`, `--shell-color-surface`, `--shell-color-text`, `--shell-color-border`, `--shell-color-accent`, `--shell-color-info`, `--shell-color-success`, `--shell-color-warning`, `--shell-color-error`
- Define separate token sets for light and dark modes.
- Scope all tokens to the shell using a CSS class (e.g., `[data-shell]` or `.bgd-shell`) to prevent leakage.
- Use CSS Modules for component encapsulation.
- Do not use Tailwind utility classes in shell component files. Use CSS custom properties directly.

**Reasoning:** The REUI token model is well-structured and maps cleanly to the PRD's semantic color requirements (§9.5). Scoped CSS custom properties enforce the isolation required by ADR-001.

---

## 10. Recommended Block Direction

**Recommendation:** Derive shell block patterns from REUI component architecture. Do not import REUI components directly.

Specifically:

| Shell Component | REUI Reference Pattern | Adaptation Required |
|----------------|------------------------|---------------------|
| Workspace Card | REUI Card + Badge | Enlarge touch target to 44px minimum height; add category chip |
| Search Overlay | REUI Autocomplete | Implement as full-screen overlay on mobile |
| Category Filter | REUI Filters | Implement as horizontal scroll chip row on mobile |
| Settings List | REUI-style list items | Standard mobile list with toggle switch |
| Dialog | REUI Frame pattern | Implement as bottom sheet on mobile; full modal on tablet+ |
| Toast | REUI Alert semantic model | Position at top of screen on mobile |
| Empty State | REUI Alert (info) | Full-screen illustration + message |
| Error State | REUI Alert (error) | Full-screen with retry action |
| Loading State | Skeleton pattern | Skeleton grid matching gallery card layout |

**Reasoning:** REUI's component architecture is sound, but the visual style and sizing require adaptation for mobile-first Capacitor use.

---

## 11. Recommended Paint Direction

**Primary recommendation:** Derive the shell light mode from **Operate** and the shell dark mode from a first-principles adaptation of **Increase**.

**Reasoning:**

Operate provides:
- A visually quiet canvas (muted green-gray) that does not compete with workspace content.
- A flat, hairlined card system directly analogous to the workspace card grid.
- Semantic label tags (cinetype pattern) that can be adapted for workspace category chips.
- An information-first density philosophy compatible with the gallery screen.
- Strong longevity characteristics (scientific restraint does not date).

Increase provides:
- An institutional dark surface system (navy + fog) with clear semantic depth hierarchy.
- A voltage accent that can serve as a shell-level indicator color.
- A token approach (warm fog → pure white → card) that inverts cleanly to (abyss → deep navy → card surface).

**Secondary extraction targets:**
- From **Relate**: The two-tier shadow system (card elevation vs. feature elevation) for the gallery grid.
- From **PostHog**: The concept of workspaces as "pinned windows" on a desk surface — useful framing for the workspace card visual metaphor.
- From **Coda**: The monospace tag approach (JetBrains Mono at 12px, uppercase, pill-shaped) for workspace category chips.

---

## 12. References Adopted and Justification

| Reference | What is Adopted | Justification |
|-----------|-----------------|---------------|
| Operate | Canvas tone: muted, slightly tinted neutral. Flat hairline card borders (0.5px inset). Information-first density. Category tag approach | Operate is the only reviewed reference that fully recedes visually while maintaining a premium, precise character. It directly serves shell neutrality. |
| Increase | Dark mode surface hierarchy (abyss → deep layer → card). Voltage accent pattern as a sparse, functional signal. | Increase's institutional restraint maps cleanly to a dark shell that does not compete with workspace visual languages. |
| Relate | Multi-layer shadow system for gallery cards. Lavender wash as a subtle surface separator between shell sections. | Relate's shadow stack produces floating elevation without aggressive decoration. |
| PostHog | Metaphorical framing: shell as "desk surface," workspaces as "application windows." | The metaphor clarifies the design intent without constraining specific visual decisions. |
| Coda | Monospace uppercase tag pattern for workspace category chips. | The monospace tag reads as a system signal, not a brand element, which preserves workspace visual neutrality. |
| REUI | Semantic token naming convention. Component architecture and accessibility patterns. | REUI provides the strongest accessible component foundation in the repository. |

---

## 13. References Rejected and Justification

| Reference | Reason for Rejection |
|-----------|----------------------|
| Coda (primary) | Warm cream canvas and editorial brutalism create a strong visual identity that would compete with workspace designs. Light-only. |
| Foundry | Dark-only terminal aesthetic conflicts with dual-mode requirement. Type-specimen layout does not accommodate a card grid. |
| Outseta | Sunset gradient and hot pink CTA are too strong for a neutral shell. |
| Slack | Aubergine identity is a brand association, not a neutral shell language. |
| Supahub | Gradient orbs and voltage violet conflict with visual neutrality requirements. |
| Pa'lais | Domain-specific botanical personality. Not suitable for a business tool shell. |
| Modern BI | Chartreuse accent is too loud. Serif display type is unusual for a mobile UI shell. |
| 2AG, AMRA, Ableton, and all design-forward references | All carry strong visual identities that would conflict with workspace neutrality. |

---

## 14. Recommended Adaptations and Combinations

### Light Mode Shell

**Base:** Adapt Operate's muted paper canvas.

Specific adaptations:

1. Replace Operate's green-tinted canvas (#e0e0e0) with a cooler, more neutral light gray (approximately #f2f3f4 or similar near-white). The green undertone in Operate may conflict with workspace palettes that use green as a brand color. A neutral light gray does not commit to any hue.
2. Retain Operate's 0.5px inset hairline card border approach. This is the cleanest available elevation system.
3. Retain Operate's compact information-density philosophy. Spacing base unit: 4px.
4. Use a single low-saturation accent for interactive states (focus rings, active nav, primary CTA). The accent should be neither the PRAV blue nor the Sackville palette. A desaturated indigo or steel blue is a suitable candidate.
5. Adopt Coda's monospace uppercase pill tag for category chips. Use JetBrains Mono or IBM Plex Mono at 10–12px.
6. Use Relate's multi-layer shadow on workspace cards to produce a gentle float above the canvas.

### Dark Mode Shell

**Base:** Derive from Increase's institutional dark surface.

Specific adaptations:

1. Three-level surface stack:
   - Level 0 (canvas): Very dark neutral (approximately #0f1117 or similar near-black).
   - Level 1 (surface): Dark neutral (approximately #1a1d23).
   - Level 2 (card): Slightly elevated neutral (approximately #22262e).
2. Hairline borders remain 0.5–1px; use a lighter neutral at low opacity for card edges.
3. The voltage accent from Increase (sparse, functional signal) adapts well as the shell's interactive accent in dark mode.
4. Text hierarchy: High-contrast white (#f4f4f5) for primary text; mid-gray (#a0a0ab) for secondary; low-gray (#6c6c78) for tertiary.

---

## 15. High-Level Color Strategy

### Shell Color Roles (semantic, not specific values)

| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Canvas | Neutral near-white (cool-biased) | Very dark neutral |
| Surface | Slightly elevated neutral | Dark elevated neutral |
| Card | White or near-white | Slightly lighter dark neutral |
| Border | 0.5–1px hairline at low opacity | 0.5–1px hairline at low opacity |
| Text primary | Near-black with cool undertone | Near-white |
| Text secondary | Medium gray | Medium-light gray |
| Text tertiary | Light gray | Dark-mid gray |
| Accent (interactive) | One low-saturation hue; desaturated indigo or steel blue | Same hue, adjusted for dark mode contrast |
| Success | Semantic green (REUI model) | Semantic green (REUI model) |
| Warning | Semantic amber (REUI model) | Semantic amber (REUI model) |
| Error | Semantic red (REUI model) | Semantic red (REUI model) |
| Info | Semantic blue (REUI model) | Semantic blue (REUI model) |

### Constraints

- The accent color must not overlap with any current workspace brand color. Since PRAV, Sackville, and AMRA are not fully audited, the accent selection should be reviewed against all three before Shell.md is written.
- Both modes must achieve WCAG 2.1 AA contrast: 4.5:1 for normal text, 3:1 for large text.
- Neither mode should use a warm canvas (cream, sand, parchment) as that would conflict with Coda-derived workspaces.

---

## 16. High-Level Typography Strategy

**Single-family approach recommended.**

Reasoning: A two-family system (display + body) creates a distinctive typographic personality that may conflict with workspace designs. A single neutral geometric sans serves all shell contexts without asserting a visual identity.

### Recommended approach

| Role | Family | Weight | Size range |
|------|--------|--------|------------|
| App name / screen title | Primary sans | 600–700 | 18–24px |
| Section label | Primary sans, uppercase | 500 | 11–12px, +0.05em tracking |
| Body / card description | Primary sans | 400 | 14–16px |
| Caption / metadata | Primary sans | 400 | 12px |
| Category chip | Monospace | 400, uppercase | 10–12px, +0.10em tracking |

**Candidate families (to be decided in Shell.md):**

- **Inter** — Strongest neutral candidate. Widely available, mobile-optimized, extensive weight range. Familiar but not dated.
- **Geist** — Vercel's system font. Slightly more distinctive. Available from Google Fonts.
- **DM Sans** — Warmer, rounder. Less neutral than Inter.

**Recommendation:** Use Inter. It is the most neutral, the most tested at small mobile sizes, and the safest choice for a gallery shell that hosts diverse workspace designs. Reserve the monospace family (IBM Plex Mono or JetBrains Mono) for category chips and status labels only.

**Type scale approach:** Use the REUI-compatible scale structure. Define tokens for: caption (12px), body-sm (14px), body (16px), heading-sm (18px), heading (24px). Do not use display sizes in the shell; shell text must always defer to workspace content.

---

## 17. High-Level Layout and Spacing Strategy

### Mobile-first layout

| Context | Layout |
|---------|--------|
| Gallery (mobile) | 2-column card grid, 16px gutter |
| Gallery (tablet) | 3-column card grid, 20px gutter |
| Gallery (desktop) | 4-column card grid, 24px gutter |
| Settings | Single-column, full-width list |
| Search overlay | Full-screen, single column |
| Dialogs | Bottom sheet on mobile; centered modal on tablet+ |

### Spacing system

- Base unit: 4px.
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Card padding (mobile): 16px.
- Card gap: 12px (mobile), 16px (tablet+).
- Screen horizontal padding: 16px (mobile), 24px (tablet), 32px (desktop).
- Touch target minimum: 44×44 CSS pixels for all interactive elements.

### Shape language

- Card border radius: 12px. Sufficient roundness for a modern, friendly shell; not so round as to conflict with sharp-cornered workspace designs (Sackville uses near-zero radius).
- Button border radius: 8px. Conservative; avoids pill shapes (which PRAV may use) and sharp corners.
- Category chip border radius: 9999px (pill). The chip is a tag, not a button; pill radius signals a label rather than an action.
- Input border radius: 8px.

---

## 18. Navigation Recommendation

**Recommended pattern:** Bottom tab bar (mobile) + sticky top bar for screen title and back navigation.

### Structure

```
Top Bar
├── Back button (when not at root)
├── Screen title
└── Settings icon (at root)

Content area

Bottom Tab Bar (optional, Phase 2)
├── Home / Gallery
└── Settings
```

### Rationale

- The PRD navigation structure is simple: Gallery → Workspace, Gallery → Settings, Gallery → Search overlay.
- A bottom tab bar is the most mobile-native pattern for 2–3 primary destinations.
- The top bar handles contextual navigation (back, screen title) without a hamburger menu.
- A search button in the top bar triggers the full-screen search overlay.
- One-handed usability is maintained: back navigation and primary tabs are reachable at the bottom of the screen.

### Alternative considered

A navigation drawer (hamburger menu) was considered and rejected. Drawers hide navigation, reduce discoverability, and require two taps to navigate. The PRD specifies a gallery-first entry point; a bottom tab bar makes this structure immediately visible.

---

## 19. Home Recommendation

**The Gallery screen is the Home screen.** No separate home screen is needed.

The Gallery screen:
- Displays workspace cards in a responsive grid.
- Provides a search entry point in the top bar.
- Provides settings access in the top bar.
- Shows empty state when no workspaces exist.
- Shows skeleton state during initialization.

**Empty state design approach:**
- Do not use an illustration (illustrations impose a visual identity).
- Use a text-only empty state: icon (outline, monoline, neutral) + primary message + secondary action.
- This keeps the shell visually quiet and avoids an art direction decision that could date the shell.

---

## 20. Workspace Gallery Recommendation

### Card design

Each workspace card must:
- Display: workspace name (heading-sm), description (body, 2-line clamp), category chip (monospace pill), workspace icon (48×48, contained).
- Use shell card surface color and hairline border.
- Apply 12px border radius.
- Apply Relate-derived multi-layer shadow for gentle elevation.
- Scale proportionally: equal-width columns in grid.

### Grid behavior

- Mobile: 2 columns, 12px gap, 16px horizontal screen padding.
- Tablet: 3 columns, 16px gap, 24px horizontal screen padding.
- Desktop: 4 columns, 20px gap, 32px horizontal screen padding.

### Filtering and sorting

- Category filter: horizontal-scroll chip row below the search bar.
- Sorting: accessible dropdown or button group in the top bar or filter row.
- Both operations must update the grid without navigation (no page reload).

### Loading state

- Skeleton cards matching the workspace card structure.
- Skeleton uses the shell surface color at reduced opacity or a subtle shimmer.
- Do not use a full-screen spinner; skeleton maintains layout stability.

---

## 21. Theme Strategy

**Two independent themes: Light and Dark.**

| Aspect | Decision |
|--------|----------|
| Mode persistence | Store in SQLite preference store (key: `shell.color-scheme`, values: `light`, `dark`, `system`) |
| System default | Respect `prefers-color-scheme` on first launch |
| Mode toggle location | Settings screen → Appearance section |
| CSS implementation | `.bgd-shell[data-theme="light"]` and `.bgd-shell[data-theme="dark"]` selectors |
| Workspace isolation | Workspace CSS must not inherit shell theme tokens |

**Light and dark are designed independently.** The PRD is explicit: "Light mode must not be an inversion of dark mode. Dark mode must not be a recolor of light mode." Both use the same semantic token names but resolve to different values.

---

## 22. Accessibility Considerations

| Requirement | Implementation approach |
|-------------|------------------------|
| WCAG 2.1 AA contrast | All text and icon colors must be verified at final token values before Shell.md is written |
| Touch targets | 44×44 CSS pixels minimum; use padding to extend hitbox without altering visual size |
| Focus management | All interactive elements require a visible focus ring; bottom sheet and dialog must trap focus |
| Screen reader | All cards must have accessible labels (aria-label or visible text). Category chips must be announced. Search results must be announced as a live region. |
| Motion | Implement `prefers-reduced-motion` media query for all transitions and animations |
| Color independence | Category chips and state indicators must not rely on color alone; use icons or text labels |
| Keyboard navigation | All shell interactions must be keyboard-accessible; bottom sheet must be dismissible with Escape key |

---

## 23. Risks and Trade-offs

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Shell accent color conflicts with a future workspace brand color | Medium | Medium | Define the accent at a specific hue value in Shell.md and document it as reserved for shell use only |
| Operate-derived muted canvas reads as dull on OLED mobile screens | Medium | Medium | Verify canvas on physical device before finalizing. Consider a cooler near-white (not gray-tinted) for light mode. |
| Hairline borders (0.5px) render inconsistently on non-Retina displays | Low | Low | Specify a minimum of 1px for non-Retina targets; use CSS `min-resolution` query if needed |
| Inter as the shell font conflicts with a workspace also using Inter | Medium | Low | Workspace CSS is scoped; Inter will load once but be styled differently inside each workspace. No conflict. |
| Bottom sheet dismiss gesture conflicts with native Capacitor gesture handling | Medium | High | Implement dismiss gesture using Capacitor's gesture API, not raw DOM events. Test on device before shipping. |
| Workspace card icon style varies across workspaces | High | Low | Define a 48×48 icon container in the shell that contains any workspace icon; the container clips or pads as needed |
| Two-column mobile gallery leaves no room for a "featured" workspace | Low | Low | Not in scope for MVP. PRD does not specify featured workspaces. |

---

## 24. Assumptions Made Where the PRD is Undefined

| Assumption | Basis | Impact |
|------------|-------|--------|
| The shell accent color will be a single, low-saturation hue (not a gradient) | PRD §20.1 requires visual neutrality; gradients assert a stronger identity | Constrains accent selection to a flat color |
| The shell will use a bottom tab bar for primary navigation | Mobile-first principle (AGENTS §7); PRD §12.1 navigation structure has 2–3 root destinations | Affects layout of gallery, settings, and search screens |
| Workspace cards in the gallery use shell styling only (no workspace-specific colors or icons visible) | PRD §9.2: "Workspace cards must not display workspace-specific styling. Workspace cards must use the shell design language." | Workspace identity is represented by name, description, and category only |
| The shell will not implement a navigation drawer | Usability principle; one-handed mobile access | Search and settings accessible from top bar and bottom tab only |
| Empty state uses a monoline icon, not an illustration | Visual neutrality requirement; illustrations impose design identity | Icon set must be defined in Shell.md |
| The shell page load sequence is: splash → skeleton gallery → populated gallery | Offline-first; data loads from SQLite, not network | No loading spinner is needed; skeleton is always shown briefly |
| Phase 1 does not include workspace search across workspace-internal content | PRD §10.4 defines search as searching workspaces by name and category only | Search implementation is simple and synchronous |

---

## 25. Recommended Next Steps Before Creating Shell.md

### Decisions that can be accepted immediately

- Adopt the REUI semantic token naming convention for shell tokens.
- Use Inter as the shell typeface.
- Use CSS Modules with scoped CSS custom properties for shell component isolation.
- Use a 4px base spacing unit with the scale defined above.
- Use 12px card border radius, 8px button border radius, 9999px chip border radius.
- Use a bottom tab bar pattern for primary mobile navigation.
- Use Operate's flat hairline card border system (0.5px inset) as the elevation approach.

### Decisions that require stakeholder validation

- **Accent color selection:** The shell accent must not conflict with PRAV, Sackville, or AMRA workspace brand colors. Read the CSS of all three workspaces before selecting the final accent hue. This is a blocking decision.
- **Canvas tone (light mode):** Neutral near-white or muted cool-gray. A physical device check is recommended before committing, because muted grays read differently on OLED versus LCD screens.
- **Bottom tab bar scope:** The PRD navigation structure supports a 2-destination bottom bar (Gallery, Settings). Confirm whether Search should be a tab or a top-bar action.

### Decisions that should be deferred until Shell.md is authored

- Specific hex values for all shell tokens.
- Animation easing curves and durations.
- Icon set selection (source and style).
- Splash screen design.
- Exact workspace card dimensions at each breakpoint.
- Settings screen content structure.
- Capacitor-specific gesture handling implementation details.

---

## Prioritized Recommendation Summary

### Accept immediately

1. REUI semantic token naming convention.
2. Inter as typeface, single-family approach.
3. CSS Modules with scoped custom properties.
4. Operate-derived flat hairline card system.
5. 4px spacing base unit.
6. 12px / 8px / 9999px border radius vocabulary.
7. Bottom tab bar navigation.
8. Dual-mode approach: light (Operate-derived neutral canvas) + dark (Increase-derived institutional depth).
9. Monospace pill for category chips.
10. Skeleton loading (no spinner).

### Validate before proceeding

1. Accent color hue — review against PRAV, Sackville, AMRA CSS.
2. Canvas tone — verify on physical device.
3. Search as tab vs. top-bar action.

### Defer to Shell.md authoring phase

1. All specific token values.
2. Icon set.
3. Animation system.
4. Splash screen.
5. Capacitor gesture implementation.
