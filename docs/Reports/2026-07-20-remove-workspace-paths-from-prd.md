# Task Report: Remove Workspace-Specific Paths from PRD

## Task

Execute the instructions in `docs/Prompts/task1.md`. Two prompts:

1. Correct the PRD — remove workspace-specific documentation paths.
2. Update agents.md — replace `docs/Architecture/` with `docs/Workspace-spec/`.

## Approach

1. Read the PRD, ADR-001, and agents.md to understand current state.
2. Identified all references to `docs/Architecture/` in both files.
3. Made targeted edits to remove workspace-specific paths from the PRD.
4. Updated agents.md to use the correct `docs/Workspace-spec/` path.
5. Added scope clarifications and changelog entries.

## Changes

### `docs/bgd-ui-prd/PRD.md`

- Removed `architecture_reference: - "docs/Architecture"` from frontmatter (line 10-11).
- Removed `├── Architecture/` from section 13.3 File Organization (line 619).
- Added changelog entry in section 26 documenting the cleanup.
- Kept section titles that use "Architecture" conceptually (Offline-First Architecture, Information Architecture) — these are not file path references.

### `agents.md`

- Replaced `├── Architecture/` with `├── Workspace-spec/` in directory structure (line 188).
- Added `├── ADR/` to directory structure (line 193).
- Updated workflow step 7: `Architecture → Designs → Masonry-yard → Patterns` to `Workspace-spec → Designs → Masonry-yard → Patterns`.
- Updated folder responsibilities table: `docs/Architecture/` → `docs/Workspace-spec/`.
- Added scope section clarifying that Workspace-spec contains workspace-specific product specs, not system architecture. Platform architecture decisions are in `docs/ADR/`.
- Updated cross-referencing rules to reference Workspace-spec documents.
- Added changelog section at end of file.

## Verification

- Grep for `docs/Architecture/` in PRD — only conceptual references remain (section titles).
- Grep for `docs/Architecture/` in agents.md — zero file path references remain.
- PRD frontmatter no longer has `architecture_reference`.
- PRD section 13.3 no longer lists `Architecture/`.
- agents.md directory structure shows `Workspace-spec/` and `ADR/`.
- agents.md folder responsibilities table references `docs/Workspace-spec/`.
- Both files have changelog entries.

## Issues

- `docs/Architecture/` directory does not exist (was previously removed). The actual workspace specs live in `docs/Workspace-spec/Invoice/`. The PRD was referencing a non-existent directory.
- The PRD's section 13.3 file organization showed `Architecture/` but the real directory is `Workspace-spec/`. This has been corrected.
