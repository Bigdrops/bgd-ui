# Moving Parts Shell Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current Caldera-inspired shell and landing page with a Moving Parts design language — electric blue accent, oversized card radii, heavy shadows, phone mockups, dark sections, and conic sphere hero.

**Architecture:** Burn existing shell tokens, landing styles, and navigation components. Rebuild from `Deep-moving-parts.html` as the design source of truth. All CSS scoped to `.moving-parts-shell` class. Lucide React for all icons.

**Tech Stack:** React 19, Tailwind CSS v3, lucide-react, CSS Modules for shell components

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Create | `src/shell/styles/moving-parts-tokens.css` | Moving Parts design tokens |
| Create | `src/shell/styles/moving-parts-reset.css` | Scoped reset |
| Create | `src/shell/styles/moving-parts-typography.css` | Type system |
| Create | `src/shell/styles/moving-parts-components.css` | Component styles |
| Modify | `src/App.tsx` | New navigation structure |
| Modify | `src/shell/Shell.tsx` | Moving Parts shell wrapper |
| Modify | `src/shell/components/TopBar/TopBar.tsx` | New navigation bar |
| Create | `src/shell/components/PhoneMockup/PhoneMockup.tsx` | Phone mockup component |
| Create | `src/shell/components/ConicSphere/ConicSphere.tsx` | Hero accent sphere |
| Create | `src/shell/components/YellowPanel/YellowPanel.tsx` | Dark section accent |
| Modify | `src/landing/Landing.tsx` | Moving Parts landing |
| Modify | `src/landing/Hero.tsx` | Phone mockup hero |
| Modify | `src/landing/Workspaces.tsx` | Oversized card grid |
| Modify | `src/landing/Header.tsx` | New navigation |
| Modify | `src/landing/Footer.tsx` | Updated footer |
| Delete | `src/landing/styles.css` | Replace with moving parts |
| Delete | `src/shell/styles/tokens.css` | Replace with moving parts |
| Delete | `src/shell/styles/reset.css` | Replace with moving parts |
| Delete | `src/shell/styles/typography.css` | Replace with moving parts |

---

## Task 1: Create Moving Parts Tokens

**Files:**
- Create: `src/shell/styles/moving-parts-tokens.css`

- [ ] **Step 1: Create the tokens file**

```css
.moving-parts-shell {
  /* ── Colors ── */
  --mp-color-electric: #0000ff;
  --mp-color-onyx: #000000;
  --mp-color-pure: #ffffff;
  --mp-color-carbon: #121212;
  --mp-color-slate: #1e1e1e;
  --mp-color-fog: #bcc1c7;
  --mp-color-ash: #999999;
  --mp-color-smoke: #cfcfcf;
  --mp-color-bone: #efefef;
  --mp-color-chalk: #f4f4f4;
  --mp-color-yellow: #fffc52;

  /* ── Typography ── */
  --mp-font-display: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  --mp-font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
  --mp-font-serif: 'Fraunces', ui-serif, 'Times New Roman', serif;

  /* ── Spacing ── */
  --mp-space-4: 4px;
  --mp-space-8: 8px;
  --mp-space-12: 12px;
  --mp-space-16: 16px;
  --mp-space-20: 20px;
  --mp-space-24: 24px;
  --mp-space-32: 32px;
  --mp-space-40: 40px;
  --mp-space-48: 48px;
  --mp-space-56: 56px;
  --mp-space-68: 68px;
  --mp-space-80: 80px;

  /* ── Layout ── */
  --mp-max-width: 1200px;
  --mp-section-gap: 80px;
  --mp-card-padding: 30px;

  /* ── Border Radius ── */
  --mp-radius-hero: 76px;
  --mp-radius-pill: 9999px;
  --mp-radius-cards: 90px;
  --mp-radius-buttons: 18px;
  --mp-radius-large-cards: 106px;
  --mp-radius-small: 3px;

  /* ── Shadows ── */
  --mp-shadow-xl: 0 15px 20px 30px rgba(0, 0, 0, 0.3);

  /* ── Surfaces ── */
  --mp-surface-canvas: #ffffff;
  --mp-surface-carbon: #121212;
  --mp-surface-slate: #1e1e1e;
  --mp-surface-yellow: #fffc52;
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls src/shell/styles/moving-parts-tokens.css`
Expected: File exists

- [ ] **Step 3: Commit**

```bash
git add src/shell/styles/moving-parts-tokens.css
git commit -m "feat: add Moving Parts design tokens"
```

---

## Task 2: Create Moving Parts Reset

**Files:**
- Create: `src/shell/styles/moving-parts-reset.css`

- [ ] **Step 1: Create the reset file**

```css
.moving-parts-shell,
.moving-parts-shell * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.moving-parts-shell {
  font-family: var(--mp-font-display);
  background: var(--mp-surface-canvas);
  color: var(--mp-color-onyx);
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.moving-parts-shell ::selection {
  background: var(--mp-color-electric);
  color: var(--mp-color-pure);
}

.moving-parts-shell :focus-visible {
  outline: 2px solid var(--mp-color-electric);
  outline-offset: 2px;
}

.moving-parts-shell button,
.moving-parts-shell .clickable,
.moving-parts-shell [role="button"] {
  touch-action: manipulation;
}

@media (prefers-reduced-motion: reduce) {
  .moving-parts-shell * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

.moving-parts-shell ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.moving-parts-shell ::-webkit-scrollbar-track {
  background: var(--mp-surface-canvas);
}

.moving-parts-shell ::-webkit-scrollbar-thumb {
  background: var(--mp-color-onyx);
  border-radius: 3px;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shell/styles/moving-parts-reset.css
git commit -m "feat: add Moving Parts scoped reset"
```

---

## Task 3: Create Moving Parts Typography

**Files:**
- Create: `src/shell/styles/moving-parts-typography.css`

- [ ] **Step 1: Create the typography file**

```css
.moving-parts-shell h1,
.moving-parts-shell h2,
.moving-parts-shell h3,
.moving-parts-shell h4,
.moving-parts-shell h5,
.moving-parts-shell h6 {
  font-family: var(--mp-font-display);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 0.96;
  color: var(--mp-color-onyx);
}

.moving-parts-shell h1 {
  font-size: clamp(48px, 10vw, 94px);
}

.moving-parts-shell h2 {
  font-size: clamp(32px, 5vw, 56px);
}

.moving-parts-shell h3 {
  font-size: clamp(24px, 3vw, 36px);
}

.moving-parts-shell p {
  font-family: var(--mp-font-display);
  font-weight: 400;
  font-size: clamp(18px, 1.8vw, 24px);
  line-height: 1.4;
  color: var(--mp-color-onyx);
  opacity: 0.7;
}

.moving-parts-shell .mp-mono {
  font-family: var(--mp-font-mono);
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--mp-color-ash);
}

.moving-parts-shell .mp-serif {
  font-family: var(--mp-font-serif);
  font-weight: 100;
  font-style: italic;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shell/styles/moving-parts-typography.css
git commit -m "feat: add Moving Parts typography system"
```

---

## Task 4: Create Moving Parts Component Styles

**Files:**
- Create: `src/shell/styles/moving-parts-components.css`

- [ ] **Step 1: Create the component styles file**

```css
/* ══════════════════════════════════════════════════════════════
   NAVIGATION
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--mp-space-16) var(--mp-space-24);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: var(--mp-surface-canvas);
  border-bottom: 1px solid var(--mp-color-smoke);
}

@media (min-width: 768px) {
  .moving-parts-shell .mp-nav {
    padding: var(--mp-space-16) var(--mp-space-32);
  }
}

@media (min-width: 1024px) {
  .moving-parts-shell .mp-nav {
    padding: var(--mp-space-16) var(--mp-space-48);
  }
}

.moving-parts-shell .mp-brand {
  font-family: var(--mp-font-display);
  font-weight: 700;
  font-size: 22px;
  letter-spacing: -0.02em;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--mp-space-12);
  color: var(--mp-color-onyx);
}

.moving-parts-shell .mp-brand-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: var(--mp-color-electric);
  border-radius: var(--mp-radius-small);
  flex-shrink: 0;
  color: var(--mp-color-pure);
  font-weight: 700;
  font-size: 14px;
  font-family: var(--mp-font-mono);
}

.moving-parts-shell .mp-nav-links {
  display: none;
  align-items: center;
  gap: var(--mp-space-24);
}

@media (min-width: 768px) {
  .moving-parts-shell .mp-nav-links {
    display: flex;
  }
  .moving-parts-shell .mp-hamburger {
    display: none !important;
  }
}

.moving-parts-shell .mp-nav-link {
  font-family: var(--mp-font-display);
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: var(--mp-color-onyx);
  transition: color 0.2s ease, border-bottom 0.2s ease;
  padding: var(--mp-space-8) 0;
  border-bottom: 2px solid transparent;
}

.moving-parts-shell .mp-nav-link:hover,
.moving-parts-shell .mp-nav-link:focus {
  color: var(--mp-color-electric);
  border-bottom-color: var(--mp-color-electric);
}

.moving-parts-shell .mp-nav-link.active {
  color: var(--mp-color-electric);
  border-bottom-color: var(--mp-color-electric);
}

.moving-parts-shell .mp-nav-actions {
  display: flex;
  align-items: center;
  gap: var(--mp-space-12);
}

/* ══════════════════════════════════════════════════════════════
   BUTTONS
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .btn-ghost {
  background: transparent;
  color: var(--mp-color-onyx);
  border: 1px solid var(--mp-color-onyx);
  border-radius: var(--mp-radius-buttons);
  padding: 10px 24px;
  font-family: var(--mp-font-display);
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
  touch-action: manipulation;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  min-height: 48px;
  gap: var(--mp-space-8);
}

.moving-parts-shell .btn-ghost:hover,
.moving-parts-shell .btn-ghost:focus {
  background: var(--mp-color-onyx);
  color: var(--mp-color-pure);
}

.moving-parts-shell .btn-electric {
  background: var(--mp-color-electric);
  color: var(--mp-color-pure);
  border: none;
  border-radius: var(--mp-radius-buttons);
  padding: 10px 24px;
  font-family: var(--mp-font-display);
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
  touch-action: manipulation;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  min-height: 48px;
  gap: var(--mp-space-8);
}

.moving-parts-shell .btn-electric:hover,
.moving-parts-shell .btn-electric:focus {
  opacity: 0.85;
  transform: scale(0.98);
}

.moving-parts-shell .btn-electric:active {
  transform: scale(0.96);
}

/* ══════════════════════════════════════════════════════════════
   CONTAINER
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-container {
  max-width: var(--mp-max-width);
  margin: 0 auto;
  padding: 0 var(--mp-space-16);
  width: 100%;
}

@media (min-width: 768px) {
  .moving-parts-shell .mp-container {
    padding: 0 var(--mp-space-32);
  }
}

@media (min-width: 1024px) {
  .moving-parts-shell .mp-container {
    padding: 0 var(--mp-space-48);
  }
}

/* ══════════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-hero {
  background: var(--mp-surface-canvas);
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding: 100px var(--mp-space-16) 64px;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--mp-color-smoke);
}

@media (min-width: 768px) {
  .moving-parts-shell .mp-hero {
    padding: 120px var(--mp-space-32) 80px;
  }
}

@media (min-width: 1024px) {
  .moving-parts-shell .mp-hero {
    padding: 140px var(--mp-space-48) 100px;
  }
}

.moving-parts-shell .mp-hero-inner {
  display: grid;
  gap: var(--mp-space-40);
  width: 100%;
  align-items: center;
  position: relative;
}

@media (min-width: 1024px) {
  .moving-parts-shell .mp-hero-inner {
    grid-template-columns: 1fr 1fr;
    gap: var(--mp-space-64);
  }
}

.moving-parts-shell .mp-hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--mp-space-16);
  max-width: 600px;
}

.moving-parts-shell .mp-hero-eyebrow {
  font-family: var(--mp-font-mono);
  font-weight: 500;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--mp-color-ash);
  display: flex;
  align-items: center;
  gap: var(--mp-space-12);
}

.moving-parts-shell .mp-hero-eyebrow .dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--mp-color-electric);
  border-radius: 50%;
  flex-shrink: 0;
}

.moving-parts-shell .mp-hero h1 .highlight {
  color: var(--mp-color-electric);
}

.moving-parts-shell .mp-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--mp-space-16);
  margin-top: var(--mp-space-8);
}

/* ══════════════════════════════════════════════════════════════
   PHONE MOCKUP
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-hero-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 340px;
}

.moving-parts-shell .phone-frame {
  width: 100%;
  max-width: 320px;
  aspect-ratio: 9 / 19;
  border-radius: var(--mp-radius-hero);
  background: var(--mp-color-electric);
  border: 1px solid var(--mp-color-onyx);
  overflow: hidden;
  position: relative;
  box-shadow: var(--mp-shadow-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--mp-space-24);
}

.moving-parts-shell .phone-frame .screen-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--mp-space-12);
  color: var(--mp-color-pure);
}

.moving-parts-shell .phone-frame .screen-content .bar {
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.25);
  width: 80%;
}

.moving-parts-shell .phone-frame .screen-content .bar.w-60 {
  width: 60%;
}

.moving-parts-shell .phone-frame .screen-content .bar.w-40 {
  width: 40%;
}

.moving-parts-shell .phone-frame .screen-content .price {
  font-family: var(--mp-font-display);
  font-weight: 700;
  font-size: 32px;
  color: var(--mp-color-pure);
  margin-top: var(--mp-space-8);
}

/* ══════════════════════════════════════════════════════════════
   CONIC SPHERE
   ══════════════════════════════════════════════════════════════ */
@keyframes mpFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-16px) rotate(2deg); }
}

.moving-parts-shell .conic-sphere {
  position: absolute;
  bottom: -20px;
  left: -30px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(
    rgb(87, 192, 241) 0%,
    rgb(74, 166, 232) 13%,
    rgb(134, 57, 162) 26%,
    rgb(239, 137, 159) 42%,
    rgb(234, 57, 42) 55%,
    rgb(239, 115, 53) 62%,
    rgb(245, 192, 68) 73%,
    rgb(245, 255, 84) 84%,
    rgb(160, 218, 83) 95%,
    rgb(87, 192, 241) 100%
  );
  animation: mpFloat 6s ease-in-out infinite;
  z-index: -1;
  opacity: 0.6;
  filter: blur(8px);
}

@media (min-width: 768px) {
  .moving-parts-shell .conic-sphere {
    width: 220px;
    height: 220px;
    bottom: -30px;
    left: -40px;
    filter: blur(12px);
  }
}

@media (min-width: 1024px) {
  .moving-parts-shell .conic-sphere {
    width: 300px;
    height: 300px;
    bottom: -40px;
    left: -60px;
    filter: blur(16px);
  }
}

/* ══════════════════════════════════════════════════════════════
   HERO STATS
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-hero-stats {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: var(--mp-space-32);
  margin-top: var(--mp-space-32);
  padding-top: var(--mp-space-24);
  border-top: 1px solid var(--mp-color-smoke);
  max-width: fit-content;
}

.moving-parts-shell .mp-hero-stats dt {
  font-family: var(--mp-font-mono);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--mp-color-ash);
  margin-bottom: 4px;
}

.moving-parts-shell .mp-hero-stats dd {
  font-family: var(--mp-font-display);
  font-weight: 700;
  font-size: clamp(24px, 3vw, 36px);
  color: var(--mp-color-onyx);
}

.moving-parts-shell .mp-hero-stats dd .electric {
  color: var(--mp-color-electric);
}

/* ══════════════════════════════════════════════════════════════
   SECTIONS
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-section {
  padding: var(--mp-space-64) 0;
}

@media (min-width: 768px) {
  .moving-parts-shell .mp-section {
    padding: var(--mp-space-80) 0;
  }
}

.moving-parts-shell .mp-section-alt {
  background: var(--mp-color-bone);
}

.moving-parts-shell .mp-section-dark {
  background: var(--mp-surface-carbon);
  color: var(--mp-color-pure);
}

.moving-parts-shell .mp-section-dark h2 {
  color: var(--mp-color-pure);
}

.moving-parts-shell .mp-section-dark .mp-section-label span {
  color: var(--mp-color-fog);
}

/* ══════════════════════════════════════════════════════════════
   YELLOW ACCENT PANEL
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-yellow-panel {
  background: var(--mp-surface-yellow);
  border-radius: var(--mp-radius-cards);
  padding: var(--mp-space-48) var(--mp-space-40);
  color: var(--mp-color-onyx);
  display: flex;
  flex-direction: column;
  gap: var(--mp-space-16);
  max-width: 600px;
}

.moving-parts-shell .mp-yellow-panel h2 {
  font-family: var(--mp-font-display);
  font-weight: 700;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.moving-parts-shell .mp-yellow-panel p {
  font-family: var(--mp-font-display);
  font-weight: 400;
  font-size: 20px;
  line-height: 1.4;
  opacity: 0.8;
  color: var(--mp-color-onyx);
}

/* ══════════════════════════════════════════════════════════════
   SECTION LABEL
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-section-label {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-bottom: var(--mp-space-16);
  border-bottom: 1px solid var(--mp-color-smoke);
  margin-bottom: var(--mp-space-24);
}

.moving-parts-shell .mp-section-label span {
  font-family: var(--mp-font-mono);
  font-weight: 400;
  font-size: 14px;
  color: var(--mp-color-ash);
  letter-spacing: 0.01em;
}

/* ══════════════════════════════════════════════════════════════
   SHOT GRID
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-shot-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--mp-space-32);
}

@media (min-width: 560px) {
  .moving-parts-shell .mp-shot-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .moving-parts-shell .mp-shot-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--mp-space-40);
  }
}

/* ══════════════════════════════════════════════════════════════
   SHOT CARD
   ══════════════════════════════════════════════════════════════ */
@keyframes mpScaleIn {
  0% { opacity: 0; transform: scale(0.96); }
  100% { opacity: 1; transform: scale(1); }
}

.moving-parts-shell .mp-shot {
  background: var(--mp-surface-canvas);
  border-radius: var(--mp-radius-cards);
  border: 1px solid var(--mp-color-smoke);
  overflow: hidden;
  cursor: pointer;
  touch-action: manipulation;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  box-shadow: var(--mp-shadow-xl);
  display: flex;
  flex-direction: column;
}

.moving-parts-shell .mp-shot:hover,
.moving-parts-shell .mp-shot:focus-visible {
  transform: translateY(-6px);
  box-shadow: 0 20px 30px 30px rgba(0, 0, 0, 0.35);
}

.moving-parts-shell .mp-shot:active {
  transform: translateY(-3px) scale(0.99);
}

.moving-parts-shell .shot-preview {
  position: relative;
  aspect-ratio: 4 / 3;
  background: var(--shot-bg, var(--mp-color-chalk));
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--mp-color-smoke);
  overflow: hidden;
}

.moving-parts-shell .shot-preview .product-mock {
  width: 100%;
  max-width: 80%;
  aspect-ratio: 9 / 16;
  border-radius: var(--mp-radius-hero);
  background: var(--shot-accent, var(--mp-color-electric));
  border: 1px solid var(--mp-color-onyx);
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mp-color-pure);
  font-family: var(--mp-font-mono);
  font-size: 14px;
  font-weight: 500;
  padding: var(--mp-space-16);
  text-align: center;
  box-shadow: var(--mp-shadow-xl);
  opacity: 0.7;
}

.moving-parts-shell .shot-preview .product-mock .mock-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.moving-parts-shell .shot-preview .product-mock .mock-content .line {
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.25);
}

.moving-parts-shell .shot-preview .product-mock .mock-content .line.w-80 {
  width: 80%;
}

.moving-parts-shell .shot-preview .product-mock .mock-content .line.w-60 {
  width: 60%;
}

.moving-parts-shell .shot-preview .product-mock .mock-content .line.w-40 {
  width: 40%;
}

.moving-parts-shell .shot-preview .status-dot {
  position: absolute;
  top: 16px;
  right: 20px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--shot-accent, var(--mp-color-electric));
  box-shadow: 0 0 0 4px rgba(0, 0, 255, 0.1);
}

.moving-parts-shell .shot-preview .status-dot.planned {
  background: transparent;
  border: 2px dashed var(--mp-color-ash);
  box-shadow: none;
}

.moving-parts-shell .shot-meta {
  padding: var(--mp-space-24) var(--mp-space-28) var(--mp-space-28);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.moving-parts-shell .shot-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2px;
}

.moving-parts-shell .shot-status {
  font-family: var(--mp-font-mono);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--mp-color-electric);
}

.moving-parts-shell .shot-status.is-planned {
  color: var(--mp-color-ash);
}

.moving-parts-shell .shot-palette {
  display: flex;
  gap: 4px;
}

.moving-parts-shell .shot-palette i {
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.moving-parts-shell .shot-name {
  font-family: var(--mp-font-display);
  font-weight: 700;
  font-size: 28px;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--mp-color-onyx);
}

.moving-parts-shell .shot-domain {
  font-family: var(--mp-font-display);
  font-weight: 400;
  font-size: 18px;
  color: var(--mp-color-onyx);
  opacity: 0.6;
}

/* ══════════════════════════════════════════════════════════════
   COLOPHON
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-colophon {
  display: grid;
  gap: var(--mp-space-32);
  padding: var(--mp-space-48) 0;
  border-top: 1px solid var(--mp-color-smoke);
}

@media (min-width: 768px) {
  .moving-parts-shell .mp-colophon {
    grid-template-columns: 1fr 1fr;
    gap: var(--mp-space-48);
  }
}

.moving-parts-shell .mp-colophon h3 {
  font-family: var(--mp-font-mono);
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--mp-color-ash);
  margin-bottom: var(--mp-space-8);
}

.moving-parts-shell .mp-colophon p {
  font-family: var(--mp-font-display);
  font-weight: 400;
  font-size: 18px;
  line-height: 1.6;
  color: var(--mp-color-onyx);
  opacity: 0.7;
  max-width: 48ch;
}

/* ══════════════════════════════════════════════════════════════
   FOOTER
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-footer {
  border-top: 1px solid var(--mp-color-smoke);
  padding: var(--mp-space-32) 0 var(--mp-space-48);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--mp-space-16);
}

.moving-parts-shell .mp-footer-text {
  font-family: var(--mp-font-display);
  font-weight: 400;
  font-size: 16px;
  color: var(--mp-color-ash);
  text-align: center;
}

.moving-parts-shell .mp-footer-text .brand {
  font-weight: 600;
  color: var(--mp-color-onyx);
}

.moving-parts-shell .mp-footer-text .electric {
  color: var(--mp-color-electric);
}

.moving-parts-shell .mp-footer-links {
  display: flex;
  align-items: center;
  gap: var(--mp-space-24);
}

.moving-parts-shell .mp-footer-links a {
  font-family: var(--mp-font-display);
  font-weight: 400;
  font-size: 16px;
  color: var(--mp-color-ash);
  text-decoration: none;
  transition: color 0.2s ease;
}

.moving-parts-shell .mp-footer-links a:hover,
.moving-parts-shell .mp-footer-links a:focus {
  color: var(--mp-color-onyx);
}

/* ══════════════════════════════════════════════════════════════
   SEARCH
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-search {
  position: relative;
  margin-bottom: var(--mp-space-16);
  display: none;
}

.moving-parts-shell .mp-search.visible {
  display: block;
}

.moving-parts-shell .mp-search input {
  width: 100%;
  padding: 16px 20px 16px 52px;
  background: var(--mp-surface-canvas);
  border: 1px solid var(--mp-color-smoke);
  border-radius: var(--mp-radius-buttons);
  font-family: var(--mp-font-display);
  font-weight: 400;
  font-size: 18px;
  color: var(--mp-color-onyx);
  outline: none;
  transition: border-color 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

.moving-parts-shell .mp-search input::placeholder {
  color: var(--mp-color-ash);
}

.moving-parts-shell .mp-search input:focus {
  border-color: var(--mp-color-electric);
}

.moving-parts-shell .mp-search-icon {
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--mp-color-ash);
  pointer-events: none;
}

.moving-parts-shell .mp-search-icon svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  stroke-width: 1.75;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* ══════════════════════════════════════════════════════════════
   CATEGORY FILTER
   ══════════════════════════════════════════════════════════════ */
.moving-parts-shell .mp-categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--mp-space-8);
  padding: var(--mp-space-8) 0 var(--mp-space-24);
}

.moving-parts-shell .mp-category-pill {
  background: transparent;
  border: 1px solid var(--mp-color-smoke);
  border-radius: var(--mp-radius-pill);
  padding: 8px 24px;
  font-family: var(--mp-font-display);
  font-weight: 400;
  font-size: 17px;
  color: var(--mp-color-onyx);
  cursor: pointer;
  transition: all 0.2s ease;
  touch-action: manipulation;
  opacity: 0.6;
}

.moving-parts-shell .mp-category-pill:hover {
  opacity: 1;
  border-color: var(--mp-color-onyx);
}

.moving-parts-shell .mp-category-pill.active {
  background: var(--mp-color-electric);
  color: var(--mp-color-pure);
  border-color: var(--mp-color-electric);
  opacity: 1;
  font-weight: 500;
}

/* ══════════════════════════════════════════════════════════════
   ANIMATIONS
   ══════════════════════════════════════════════════════════════ */
@keyframes mpFadeUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

.moving-parts-shell .animate-fade-up {
  animation: mpFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  opacity: 0;
}

.moving-parts-shell .animate-fade-up.d1 { animation-delay: 0.05s; }
.moving-parts-shell .animate-fade-up.d2 { animation-delay: 0.12s; }
.moving-parts-shell .animate-fade-up.d3 { animation-delay: 0.19s; }

.moving-parts-shell .mp-shot-grid > .mp-shot {
  animation: mpScaleIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  opacity: 0;
}

.moving-parts-shell .mp-shot-grid > .mp-shot:nth-child(1) { animation-delay: 0.04s; }
.moving-parts-shell .mp-shot-grid > .mp-shot:nth-child(2) { animation-delay: 0.09s; }
.moving-parts-shell .mp-shot-grid > .mp-shot:nth-child(3) { animation-delay: 0.14s; }
.moving-parts-shell .mp-shot-grid > .mp-shot:nth-child(4) { animation-delay: 0.19s; }
.moving-parts-shell .mp-shot-grid > .mp-shot:nth-child(5) { animation-delay: 0.24s; }
.moving-parts-shell .mp-shot-grid > .mp-shot:nth-child(6) { animation-delay: 0.29s; }
.moving-parts-shell .mp-shot-grid > .mp-shot:nth-child(n+7) { animation-delay: 0.32s; }

/* ══════════════════════════════════════════════════════════════
   RESPONSIVE TWEAKS
   ══════════════════════════════════════════════════════════════ */
@media (max-width: 374px) {
  .moving-parts-shell .shot-meta {
    padding: var(--mp-space-16);
  }
  .moving-parts-shell .shot-name {
    font-size: 22px;
  }
  .moving-parts-shell .mp-hero h1 {
    font-size: 40px;
  }
}

@media (min-width: 768px) {
  .moving-parts-shell .shot-meta {
    padding: var(--mp-space-28) var(--mp-space-32);
  }
}

@media (min-width: 1024px) {
  .moving-parts-shell .shot-meta {
    padding: var(--mp-space-32) var(--mp-space-36);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shell/styles/moving-parts-components.css
git commit -m "feat: add Moving Parts component styles"
```

---

## Task 5: Update Shell Entry Point

**Files:**
- Modify: `src/shell/Shell.tsx`

- [ ] **Step 1: Update Shell.tsx to use Moving Parts styles**

```tsx
import { useState, useCallback, Suspense } from 'react'
import type { ShellWorkspace, ShellTopic } from './types'
import { useTheme } from './hooks/useTheme'
import { Gallery } from './screens/Gallery/Gallery'
import { Settings } from './screens/Settings/Settings'
import { TopBar } from './components/TopBar/TopBar'

import './styles/moving-parts-tokens.css'
import './styles/moving-parts-reset.css'
import './styles/moving-parts-typography.css'
import './styles/moving-parts-components.css'

type ShellScreen = 'home' | 'topic' | 'workspace' | 'settings'

interface ShellProps {
  topics: ShellTopic[]
  workspaces: ShellWorkspace[]
  loading?: boolean
}

export function Shell({ topics, workspaces, loading }: ShellProps) {
  const { mode, resolved, setMode } = useTheme()
  const [screen, setScreen] = useState<ShellScreen>('home')
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null)

  const activeWorkspace = activeWorkspaceId
    ? workspaces.find((w) => w.id === activeWorkspaceId)
    : null

  const WorkspaceComponent = activeWorkspace?.component

  const handleToggleTheme = useCallback(() => {
    setMode(resolved === 'dark' ? 'light' : 'dark')
  }, [resolved, setMode])

  const handleSelectTopic = useCallback((topicId: string) => {
    setActiveTopicId(topicId)
    setScreen('topic')
  }, [])

  const handleSelectWorkspace = useCallback((id: string) => {
    setActiveWorkspaceId(id)
    setScreen('workspace')
  }, [])

  const handleBackToTopics = useCallback(() => {
    setActiveTopicId(null)
    setScreen('home')
  }, [])

  const handleBackToTopicList = useCallback(() => {
    setActiveWorkspaceId(null)
    setScreen('topic')
  }, [])

  const handleOpenSettings = useCallback(() => {
    setScreen('settings')
  }, [])

  const handleBackFromSettings = useCallback(() => {
    setScreen('home')
  }, [])

  if (screen === 'workspace' && WorkspaceComponent) {
    return (
      <div className="moving-parts-shell" data-theme={resolved}>
        <TopBar onToggleTheme={handleToggleTheme} themeIsDark={resolved === 'dark'} />
        <div className="mp-container" style={{ paddingTop: 'var(--mp-space-12)', paddingBottom: 'var(--mp-space-12)' }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={handleBackToTopicList}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--mp-space-4)' }}
          >
            ← {activeWorkspace?.name}
          </button>
        </div>
        <Suspense
          fallback={
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
            }}>
              <span className="mp-mono">Loading workspace...</span>
            </div>
          }
        >
          <WorkspaceComponent />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="moving-parts-shell" data-theme={resolved} style={{ minHeight: '100vh' }}>
      <TopBar onToggleTheme={handleToggleTheme} themeIsDark={resolved === 'dark'} />
      <div className="mp-container" style={{ paddingTop: 'var(--mp-space-16)' }}>
        {screen === 'settings' ? (
          <Settings
            workspaceCount={workspaces.length}
            onBack={handleBackFromSettings}
          />
        ) : (
          <Gallery
            topics={topics}
            workspaces={workspaces}
            loading={loading}
            themeMode={mode}
            resolved={resolved}
            onToggleTheme={handleToggleTheme}
            onSelectTopic={handleSelectTopic}
            onSelectWorkspace={handleSelectWorkspace}
            onOpenSettings={handleOpenSettings}
            onBackToTopics={handleBackToTopics}
            activeTopicId={screen === 'topic' ? activeTopicId : null}
          />
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shell/Shell.tsx
git commit -m "feat: switch shell to Moving Parts design system"
```

---

## Task 6: Update TopBar Navigation

**Files:**
- Modify: `src/shell/components/TopBar/TopBar.tsx`

- [ ] **Step 1: Update TopBar.tsx**

```tsx
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface TopBarProps {
  onToggleTheme?: () => void
  themeIsDark?: boolean
  onNavigate?: (page: string) => void
  currentPage?: string
}

export function TopBar({ onToggleTheme, themeIsDark, onNavigate, currentPage }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="mp-nav" id="mp-nav">
        <a href="/" className="mp-brand">
          <span className="mp-brand-icon">□△</span>
          BGD UI
        </a>

        <div className="mp-nav-links">
          <a
            href="#workspaces"
            className={`mp-nav-link ${currentPage === 'workspaces' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavigate?.('workspaces') }}
          >
            Gallery
          </a>
          <a
            href="#components"
            className={`mp-nav-link ${currentPage === 'components' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavigate?.('components') }}
          >
            Components
          </a>
          <a
            href="#docs"
            className={`mp-nav-link ${currentPage === 'docs' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); onNavigate?.('docs') }}
          >
            Docs
          </a>
        </div>

        <div className="mp-nav-actions">
          <button className="btn-ghost" style={{ minWidth: 44, minHeight: 44, padding: '0 12px' }}>
            <Search size={18} />
          </button>
          <a href="#workspaces" className="btn-ghost" onClick={(e) => { e.preventDefault(); onNavigate?.('workspaces') }}>
            Explore
          </a>
          <button
            className="mp-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(0, 0, 0, 0.3)',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu */}
      <nav
        id="mp-mobile-menu"
        aria-label="Mobile navigation"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: 340,
          height: '100vh',
          zIndex: 100,
          background: 'var(--mp-surface-canvas)',
          borderLeft: '1px solid var(--mp-color-smoke)',
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--mp-space-4)',
          overflowY: 'auto',
        }}
      >
        <button
          className="btn-ghost"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation menu"
          style={{ position: 'absolute', top: '1rem', right: '1rem', minWidth: 44, minHeight: 44 }}
        >
          <X size={18} />
        </button>

        <div style={{ marginTop: 'var(--mp-space-48)', display: 'flex', flexDirection: 'column', gap: 'var(--mp-space-4)' }}>
          <a
            href="#workspaces"
            className="mp-nav-link"
            style={{ fontSize: 20, padding: '14px 0', borderBottom: '1px solid var(--mp-color-smoke)', display: 'block' }}
            onClick={(e) => { e.preventDefault(); onNavigate?.('workspaces'); setMobileMenuOpen(false) }}
          >
            Gallery
          </a>
          <a
            href="#components"
            className="mp-nav-link"
            style={{ fontSize: 20, padding: '14px 0', borderBottom: '1px solid var(--mp-color-smoke)', display: 'block' }}
            onClick={(e) => { e.preventDefault(); onNavigate?.('components'); setMobileMenuOpen(false) }}
          >
            Components
          </a>
          <a
            href="#docs"
            className="mp-nav-link"
            style={{ fontSize: 20, padding: '14px 0', borderBottom: '1px solid var(--mp-color-smoke)', display: 'block' }}
            onClick={(e) => { e.preventDefault(); onNavigate?.('docs'); setMobileMenuOpen(false) }}
          >
            Docs
          </a>
          <hr style={{ border: 'none', borderTop: '1px solid var(--mp-color-smoke)', margin: 'var(--mp-space-12) 0' }} />
          <div style={{ marginTop: 'var(--mp-space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--mp-space-8)' }}>
            <a
              href="#workspaces"
              className="btn-electric"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={(e) => { e.preventDefault(); onNavigate?.('workspaces'); setMobileMenuOpen(false) }}
            >
              Explore
            </a>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--mp-space-16)', borderTop: '1px solid var(--mp-color-smoke)', fontFamily: 'var(--mp-font-display)', fontSize: 16, color: 'var(--mp-color-ash)' }}>
          <span>BGD UI Shell</span>
          <span style={{ display: 'block', marginTop: 4, opacity: 0.5 }}>v2.1 · 2026</span>
        </div>
      </nav>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/shell/components/TopBar/TopBar.tsx
git commit -m "feat: update TopBar to Moving Parts navigation"
```

---

## Task 7: Update App.tsx Navigation

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Update App.tsx**

```tsx
import { lazy, useState, useCallback } from 'react'
import { Shell } from './shell'
import type { ShellWorkspace, ShellTopic } from './shell'
import { Landing } from './landing'
import { ComponentsPage } from './pages/components'
import { WorkspacesPage } from './pages/workspaces'
import { DocsPage } from './pages/docs'

const PRAVInvoice = lazy(() => import('./workspaces/invoice/prav/InvoiceWorkspace'))
const SackvilleInvoice = lazy(() => import('./workspaces/invoice/sackville/InvoiceWorkspace'))
const AMRAInvoice = lazy(() => import('./workspaces/invoice/amra/InvoiceWorkspace'))

const WORKSPACES: ShellWorkspace[] = [
  {
    id: 'invoice-prav',
    name: 'PRAV',
    description: 'Engineering dossier | warm parchment, ink-black hierarchy, 4px radius',
    icon: 'receipt',
    category: 'Invoice',
    status: 'active',
    component: PRAVInvoice,
  },
  {
    id: 'invoice-sackville',
    name: 'Sackville',
    description: 'Editorial risograph | cream paper, cobalt ink, oval outlined actions',
    icon: 'file-text',
    category: 'Invoice',
    status: 'active',
    component: SackvilleInvoice,
  },
  {
    id: 'invoice-amra',
    name: 'AMRA',
    description: 'Monochrome minimal | white canvas, lavender accent, 44px radius',
    icon: 'grid',
    category: 'Invoice',
    status: 'active',
    component: AMRAInvoice,
  },
]

const TOPICS: ShellTopic[] = [
  {
    id: 'invoice',
    name: 'Invoice',
    workspaces: WORKSPACES.map((w) => ({ id: w.id, name: w.name, description: w.description })),
  },
]

type Page = 'landing' | 'components' | 'workspaces' | 'docs' | 'shell'

export default function App() {
  const [page, setPage] = useState<Page>('landing')

  const navigateToShell = useCallback(() => setPage('shell'), [])
  const navigateToLanding = useCallback(() => setPage('landing'), [])
  const navigateToComponents = useCallback(() => setPage('components'), [])
  const navigateToWorkspaces = useCallback(() => setPage('workspaces'), [])
  const navigateToDocs = useCallback(() => setPage('docs'), [])

  if (page === 'landing') {
    return <Landing onNavigateToShell={navigateToShell} />
  }

  if (page === 'components') {
    return (
      <ShellPage
        currentPage="components"
        onNavigateToLanding={navigateToLanding}
        onNavigate={setPage}
      >
        <ComponentsPage />
      </ShellPage>
    )
  }

  if (page === 'workspaces') {
    return (
      <ShellPage
        currentPage="workspaces"
        onNavigateToLanding={navigateToLanding}
        onNavigate={setPage}
      >
        <WorkspacesPage />
      </ShellPage>
    )
  }

  if (page === 'docs') {
    return (
      <ShellPage
        currentPage="docs"
        onNavigateToLanding={navigateToLanding}
        onNavigate={setPage}
      >
        <DocsPage />
      </ShellPage>
    )
  }

  return (
    <ShellPage
      currentPage="shell"
      onNavigateToLanding={navigateToLanding}
      onNavigate={setPage}
    >
      <Shell topics={TOPICS} workspaces={WORKSPACES} />
    </ShellPage>
  )
}

interface ShellPageProps {
  currentPage: string
  onNavigateToLanding: () => void
  onNavigate: (page: Page) => void
  children: React.ReactNode
}

function ShellPage({ currentPage, onNavigateToLanding, onNavigate, children }: ShellPageProps) {
  return (
    <div className="moving-parts-shell" style={{ minHeight: '100vh' }}>
      <ShellPageHeader
        currentPage={currentPage}
        onNavigateToLanding={onNavigateToLanding}
        onNavigate={onNavigate}
      />
      {children}
    </div>
  )
}

interface ShellPageHeaderProps {
  currentPage: string
  onNavigateToLanding: () => void
  onNavigate: (page: Page) => void
}

function ShellPageHeader({ currentPage, onNavigateToLanding, onNavigate }: ShellPageHeaderProps) {
  return (
    <nav className="mp-nav">
      <a href="/" className="mp-brand" onClick={(e) => { e.preventDefault(); onNavigateToLanding() }}>
        <span className="mp-brand-icon">□△</span>
        BGD UI
      </a>

      <div className="mp-nav-links">
        <a
          href="#workspaces"
          className={`mp-nav-link ${currentPage === 'workspaces' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate('workspaces') }}
        >
          Gallery
        </a>
        <a
          href="#components"
          className={`mp-nav-link ${currentPage === 'components' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate('components') }}
        >
          Components
        </a>
        <a
          href="#docs"
          className={`mp-nav-link ${currentPage === 'docs' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); onNavigate('docs') }}
        >
          Docs
        </a>
      </div>

      <div className="mp-nav-actions">
        <button className="btn-ghost" onClick={onNavigateToLanding}>
          Home
        </button>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: update App.tsx to Moving Parts navigation"
```

---

## Task 8: Update Landing Hero

**Files:**
- Modify: `src/landing/Hero.tsx`

- [ ] **Step 1: Update Hero.tsx**

```tsx
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  onNavigateToShell?: () => void
}

export function Hero({ onNavigateToShell }: HeroProps) {
  return (
    <section className="mp-hero" id="hero" aria-label="Hero">
      <div className="mp-container" style={{ padding: 0 }}>
        <div className="mp-hero-inner">
          <div className="mp-hero-content animate-fade-up d1">
            <div className="mp-hero-eyebrow">
              <span className="dot"></span>
              BGD UI · Offline-first shell
            </div>
            <h1>
              Six workspaces.<br />
              <span className="highlight">One blueprint.</span>
            </h1>
            <p>
              The Moving Parts terminal holds every screen BIGDROPS ships — invoicing,
              quotations, inventory, CRM. The shell is neutral by design; each workspace
              below builds its own identity from scratch.
            </p>
            <div className="mp-hero-actions">
              <a href="#workspaces" className="btn-electric" onClick={(e) => { e.preventDefault(); onNavigateToShell?.() }}>
                Browse the gallery
                <ArrowRight size={18} />
              </a>
              <a href="#colophon" className="btn-ghost">
                How this works
              </a>
            </div>

            <dl className="mp-hero-stats">
              <div>
                <dt>Live</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>In development</dt>
                <dd>3</dd>
              </div>
              <div>
                <dt>Categories</dt>
                <dd>4</dd>
              </div>
            </dl>
          </div>

          {/* Hero Visual: Phone mockup + conic sphere */}
          <div className="mp-hero-visual animate-fade-up d2">
            <div className="phone-frame">
              <div className="screen-content">
                <div className="bar"></div>
                <div className="bar w-60"></div>
                <div className="bar w-40"></div>
                <div className="price">$299</div>
                <div style={{ marginTop: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 12, fontSize: 12 }}>Pro</span>
                  <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 12, fontSize: 12 }}>2025</span>
                </div>
              </div>
            </div>
            <div className="conic-sphere" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/landing/Hero.tsx
git commit -m "feat: update Hero to Moving Parts phone mockup design"
```

---

## Task 9: Update Landing Workspaces

**Files:**
- Modify: `src/landing/Workspaces.tsx`

- [ ] **Step 1: Update Workspaces.tsx**

```tsx
import { ArrowRight } from 'lucide-react'

interface WorkspacesProps {
  onNavigateToShell?: () => void
}

const WORKSPACES = [
  {
    name: 'PRAV',
    domain: 'Invoice',
    description: 'Warm parchment dossier',
    status: 'live',
    category: 'invoice',
    style: { '--shot-bg': '#F3ECDD', '--shot-accent': '#8B5E34' } as React.CSSProperties,
  },
  {
    name: 'Sackville',
    domain: 'Invoice',
    description: 'Cream risograph zine',
    status: 'live',
    category: 'invoice',
    style: { '--shot-bg': '#FBF6EE', '--shot-accent': '#FF6B4A' } as React.CSSProperties,
  },
  {
    name: 'AMRA',
    domain: 'Invoice',
    description: 'Monochrome + lavender accent',
    status: 'live',
    category: 'invoice',
    style: { '--shot-bg': '#FAFAFA', '--shot-accent': '#B8A6FF' } as React.CSSProperties,
  },
  {
    name: 'CRM',
    domain: 'Customer Relationship',
    description: 'Modern utility',
    status: 'planned',
    category: 'crm',
    style: { '--shot-bg': '#EEF2F6', '--shot-accent': '#3E5C76' } as React.CSSProperties,
  },
  {
    name: 'Inventory',
    domain: 'Inventory',
    description: 'Teal terminal',
    status: 'planned',
    category: 'inventory',
    style: { '--shot-bg': '#0A0E0C', '--shot-accent': '#00E68A' } as React.CSSProperties,
  },
  {
    name: 'Quotations',
    domain: 'Sales',
    description: 'Warm amber',
    status: 'planned',
    category: 'sales',
    style: { '--shot-bg': '#FDF3E4', '--shot-accent': '#D98E36' } as React.CSSProperties,
  },
]

export function Workspaces({ onNavigateToShell }: WorkspacesProps) {
  return (
    <section className="mp-section mp-section-alt" id="workspaces" aria-label="Workspaces">
      <div className="mp-container">
        <div className="mp-section-label animate-fade-up d1">
          <h2>Workspace Gallery</h2>
          <span>6 shots</span>
        </div>

        <div className="mp-categories animate-fade-up d2">
          <button className="mp-category-pill active">All</button>
          <button className="mp-category-pill">Invoice</button>
          <button className="mp-category-pill">CRM</button>
          <button className="mp-category-pill">Inventory</button>
          <button className="mp-category-pill">Sales</button>
        </div>

        <div className="mp-shot-grid" role="list">
          {WORKSPACES.map((ws) => (
            <article
              key={ws.name}
              className="mp-shot"
              role="listitem"
              tabIndex={0}
              style={ws.style}
              onClick={onNavigateToShell}
            >
              <div className="shot-preview">
                <div className="product-mock">
                  <div className="mock-content">
                    <div className="line w-80"></div>
                    <div className="line w-60"></div>
                    <div className="line w-40"></div>
                    <div style={{ fontFamily: 'var(--mp-font-mono)', fontSize: 12, marginTop: 8, opacity: 0.6 }}>
                      {ws.name.toUpperCase()}
                    </div>
                  </div>
                </div>
                <span className={`status-dot ${ws.status === 'planned' ? 'planned' : ''}`}></span>
              </div>
              <div className="shot-meta">
                <div className="shot-top">
                  <span className={`shot-status ${ws.status === 'planned' ? 'is-planned' : ''}`}>
                    {ws.status === 'live' ? 'Live' : 'In development'}
                  </span>
                  <span className="shot-palette" aria-hidden="true">
                    <i style={{ background: String(ws.style['--shot-bg']) }}></i>
                    <i style={{ background: String(ws.style['--shot-accent']) }}></i>
                  </span>
                </div>
                <h3 className="shot-name">{ws.name}</h3>
                <p className="shot-domain">{ws.domain} · {ws.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/landing/Workspaces.tsx
git commit -m "feat: update Workspaces to Moving Parts shot grid"
```

---

## Task 10: Update Landing Header

**Files:**
- Modify: `src/landing/Header.tsx`

- [ ] **Step 1: Update Header.tsx**

```tsx
import { Search } from 'lucide-react'

interface HeaderProps {
  onNavigateToShell?: () => void
}

export function Header({ onNavigateToShell }: HeaderProps) {
  return (
    <nav className="mp-nav">
      <a href="/" className="mp-brand">
        <span className="mp-brand-icon">□△</span>
        BGD UI
      </a>

      <div className="mp-nav-links">
        <a href="#workspaces" className="mp-nav-link active">Gallery</a>
        <a href="#components" className="mp-nav-link">Components</a>
        <a href="#docs" className="mp-nav-link">Docs</a>
      </div>

      <div className="mp-nav-actions">
        <button className="btn-ghost" style={{ minWidth: 44, minHeight: 44, padding: '0 12px' }}>
          <Search size={18} />
        </button>
        <a href="#workspaces" className="btn-ghost">Explore</a>
        <button className="btn-electric" onClick={onNavigateToShell}>Launch</button>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/landing/Header.tsx
git commit -m "feat: update Header to Moving Parts navigation"
```

---

## Task 11: Update Landing Footer

**Files:**
- Modify: `src/landing/Footer.tsx`

- [ ] **Step 1: Update Footer.tsx**

```tsx
export function Footer() {
  return (
    <footer className="mp-footer" role="contentinfo">
      <div className="mp-footer-links">
        <a href="#workspaces">Gallery</a>
        <a href="#components">Components</a>
        <a href="#docs">Docs</a>
      </div>
      <p className="mp-footer-text">
        <span className="brand">BGD UI</span> · <span className="electric">Shell v2.1</span> · Offline-first
      </p>
      <p className="mp-footer-text" style={{ fontSize: 14, opacity: 0.5 }}>
        Built for BIGDROPS · Workspaces are independent products
      </p>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/landing/Footer.tsx
git commit -m "feat: update Footer to Moving Parts style"
```

---

## Task 12: Update Landing Styles Entry

**Files:**
- Modify: `src/landing/Landing.tsx`

- [ ] **Step 1: Update Landing.tsx to use Moving Parts styles**

```tsx
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Header } from './Header'
import { Hero } from './Hero'
import { Workspaces } from './Workspaces'
import { Components } from './Components'
import { Trust } from './Trust'
import { CTA } from './CTA'
import { Footer } from './Footer'
import '../shell/styles/moving-parts-tokens.css'
import '../shell/styles/moving-parts-reset.css'
import '../shell/styles/moving-parts-typography.css'
import '../shell/styles/moving-parts-components.css'

interface LandingProps {
  onNavigateToShell?: () => void
}

export function Landing({ onNavigateToShell }: LandingProps) {
  return (
    <div className="moving-parts-shell">
      <Header onNavigateToShell={onNavigateToShell} />
      <main>
        <Hero onNavigateToShell={onNavigateToShell} />
        <Workspaces onNavigateToShell={onNavigateToShell} />
        <Components onNavigateToShell={onNavigateToShell} />
        <Trust />
        <CTA onNavigateToShell={onNavigateToShell} />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/landing/Landing.tsx
git commit -m "feat: update Landing to use Moving Parts styles"
```

---

## Task 13: Delete Old Styles

**Files:**
- Delete: `src/landing/styles.css`
- Delete: `src/shell/styles/tokens.css`
- Delete: `src/shell/styles/reset.css`
- Delete: `src/shell/styles/typography.css`

- [ ] **Step 1: Delete old style files**

```bash
rm src/landing/styles.css
rm src/shell/styles/tokens.css
rm src/shell/styles/reset.css
rm src/shell/styles/typography.css
```

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "feat: remove old Caldera style files"
```

---

## Task 14: Build and Verify

**Files:**
- None (verification step)

- [ ] **Step 1: Run build**

```bash
bun run build
```

Expected: Build completes with no errors

- [ ] **Step 2: Run dev server**

```bash
bun run dev
```

Expected: Dev server starts, pages load correctly

- [ ] **Step 3: Verify responsive at 375px, 768px, 1024px**

Open browser dev tools and verify:
- 375px: Mobile layout, hamburger menu visible
- 768px: Tablet layout, nav links visible
- 1024px: Desktop layout, full hero with phone mockup

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Moving Parts shell overhaul"
```

---

## Verification Checklist

- [ ] All CSS scoped to `.moving-parts-shell`
- [ ] Electric blue (#0000ff) as sole accent color
- [ ] Oversized card radii (90px, 106px)
- [ ] Heavy shadows on cards
- [ ] Phone mockup in hero
- [ ] Conic gradient sphere accent
- [ ] Dark sections with yellow panels
- [ ] Lucide React icons throughout
- [ ] Responsive at 375px, 768px, 1024px
- [ ] Build passes with no errors
- [ ] All navigation works correctly
