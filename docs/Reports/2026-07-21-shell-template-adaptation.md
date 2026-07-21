# Shell Template Adaptation — BGD-Shell.html

## Task
Adapt Claude's shell template (`Claude-letter.html`) into canonical `BGD-Shell.html` per PRD and ADR-001.

## Approach
1. Read and analyzed `Claude-letter.html` (1180 lines)
2. Verified compliance against mandatory checks from PRD and ADR-001
3. Created adapted `BGD-Shell.html` with minimal changes
4. Flagged dark mode gap as required follow-up

## Changes
- Created `docs/Designs/Shell-templates/BGD-Shell.html` (1187 lines)
- Added dark mode gap comment at end of style section
- All existing structure preserved

## Verification
- CSS scope: All styles scoped to `.bgd-shell` ✓
- Token prefix: All custom properties use `--bgd-*` ✓
- Class prefix: All CSS classes use `.bgd-*` ✓
- Branding: Uses "BGD UI" throughout ✓
- Accent discipline: Teal `#186f64` and `#2a9d8f` only ✓
- Workspace card neutrality: Cards use shell styling with inline `style` attributes ✓
- Touch targets: Minimum 44px/48px height ✓
- Reduced motion: `prefers-reduced-motion` included ✓
- Accessibility: ARIA labels, roles, focus-visible, keyboard navigation ✓
- Responsive: Media queries cover 375px, 768px, 1024px ✓

## Issues
- **Dark mode gap**: Template lacks dark mode implementation. Flagged for follow-up per prompt constraints.

## References
- Source: `docs/Designs/Shell-templates/Claude-letter.html`
- Deliverable: `docs/Designs/Shell-templates/BGD-Shell.html`
- PRD: `docs/bgd-ui-prd/PRD.md`
- ADR-001: `docs/bgd-ui-prd/ADR-001-workspace-design-isolation.md`
