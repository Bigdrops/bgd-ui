# Add Workspace Documentation Standard

## Task

Create the first standard document under `docs/Standards/` to define the Shell workspace viewer tab behavior and documentation conventions.

## Approach

1. Read AGENTS.md to understand folder responsibilities and documentation conventions.
2. Read existing reports to confirm ADS-STE100 writing style.
3. Verified Shell tab implementation via grep to document current behavior accurately.
4. Created the standard file and updated AGENTS.md.

## Changes

### `docs/Standards/workspace-documentation.md` (new)

First standard document. Covers:

- Tab system definition (Preview, Code, Design.md) with icons, sources, and behaviors
- Tab visual appearance (pill-style, border-radius, font-weight)
- Component registry lookup flow (`registryId` → `getComponentById` → `sourceFiles`/`designFile`)
- Shared component usage (`SourceFileList`, `MarkdownViewer`)
- Clipboard behavior (`src/lib/clipboard.ts`)
- Typography reset for workspace Preview mode
- Steps to add tabs to a new workspace

### `AGENTS.md`

Three updates:

1. **Section 10 (Directory Structure)** — Added `docs/Standards/` entry
2. **Section 12 (Folder Responsibilities)** — Added Standards row: "Implementation conventions, tab systems, documentation patterns, code standards"
3. **Changelog** — Added entry for 2026-07-27

## Verification

- `bun run build` — passes (1905 modules, no errors)
- No source code changes — documentation only

## Issues

None.
