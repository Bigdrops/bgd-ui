# Supahub + Auros Shell Redesign Report

## Task

Replace the Intra shell design language with a Supahub (light) + Auros (dark) hybrid. Make the shell glossy, vibrant, and structurally richer.

## Approach

1. Married Supahub's white canvas + violet accent + gradient orb aesthetic with Auros' dark teal + bioluminescent gradient dark mode.
2. Replaced Intra's brutalist 0px-radius / no-shadow / weight-400-only with a pill-rounded / shadowed / gradient-decorated system.
3. Changed structure: added GradientOrb decorative component, card-based grid with shadows, pill-style navigation.
4. Typography: Space Grotesk (Bricolage substitute) for display, Inter for body.

## The Marriage

| Layer | Supahub (Light) | Auros (Dark) |
|-------|----------------|--------------|
| Canvas | `#ffffff` | `#012624` (Liquid Abyss) |
| Surface | `#ffffff` | `#003734` (Liquid Kelp) |
| Text | `#111827` (Midnight Ink) | `#ffffff` |
| Secondary | `#6b7589` (Slate) | `#bbc7c6` (Silver Mist) |
| Accent | `#862fe7` (Voltage Violet) | `#862fe7` |
| Background | Violet/pink/amber gradient orbs | Teal/cyan/lavender bioluminescent orbs |
| Shadows | Violet-tinted elevated shadow | Deeper dark shadow |

## Changes

| File | Change |
|------|--------|
| `src/shell/styles/tokens.css` | Complete rewrite: Supahub+Auros color tokens, Space Grotesk + Inter fonts, pill radii (12/20/24/9999px), shadow system, gradient orb variables, dark mode. |
| `src/shell/styles/reset.css` | Updated focus-visible with border-radius, added tap-highlight removal. |
| `src/shell/styles/typography.css` | Space Grotesk for display/heading classes, Inter for body. Added `.shell-meta`, `.shell-heading-sm`, `.shell-subheading`.  |
| `src/shell/components/GradientOrb/GradientOrb.tsx` | **New** — fixed-position radial gradient decoration for atmospheric depth. 3 variants (violet, pink, teal). |
| `src/shell/components/TopBar/TopBar.tsx` | Pill-shaped back button with chevron SVG, centered title, pill theme toggle. |
| `src/shell/components/TopBar/TopBar.module.css` | Sticky top bar, pill-radius buttons, accent color hover states. |
| `src/shell/components/WorkspaceCard/WorkspaceCard.tsx` | Card with chevron arrow, shadow, border radius. |
| `src/shell/components/WorkspaceCard/WorkspaceCard.module.css` | 24px radius, shadow, accent border on hover, press scale effect. |
| `src/shell/components/EmptyState/EmptyState.tsx` | Minimal text, no structural changes. |
| `src/shell/components/EmptyState/EmptyState.module.css` | Updated spacing tokens. |
| `src/shell/components/LoadingState/LoadingState.tsx` | Card skeleton with pill-radius lines. |
| `src/shell/components/LoadingState/LoadingState.module.css` | Card border, pill-radius skeleton lines. |
| `src/shell/screens/Gallery/Gallery.tsx` | Card-based grid with GradientOrb decoration, hero section with subtitle, pill-style topic cards, settings link with gear icon. |
| `src/shell/screens/Gallery/Gallery.module.css` | Card grid (24px radius, shadow), wrapper with relative positioning for orbs. |
| `src/shell/screens/Settings/Settings.tsx` | Card container with dividers, pill-style. |
| `src/shell/screens/Settings/Settings.module.css` | 24px radius card, interior dividers. |
| `src/shell/Shell.tsx` | Added GradientOrb to workspace view, Suspense fallback uses shell-caption class. |

## Verification

- `bun run build` — TypeScript: no errors
- `bun run build` — production bundle: succeeds
- Isolated workspace chunks maintained (3 CSS chunks)
- Shell CSS: 19.32 kB (up from 14 kB due to richer tokens + gradients)

## Design Notes

- GradientOrb uses `position: fixed` with `pointer-events: none` — purely decorative, no layout impact.
- Theme toggle keeps Sun/Moon icons per user preference.
- All workspace isolation maintained — each workspace visual identity preserved.
- Berlin Biennale design saved to `docs/Designs/Berlin-Biennale.md`.
- Intra.md restored after accidental deletion.
