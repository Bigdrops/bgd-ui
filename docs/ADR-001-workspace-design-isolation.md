---
spec_version: "1.0"
document: "ADR"
adr_number: "001"
status: "accepted"
product: "BGD UI"
last_updated: "2026-07-20"
---

# ADR-001: Workspace Design Isolation

## Status

Accepted

## Context

BGD UI is a collection of business workspaces. Each workspace demonstrates a different design language. The application shell hosts all workspaces.

A risk exists that workspace styling leaks into the shell or into other workspaces. This leakage causes visual inconsistency and makes it difficult to add new workspaces.

## Decision

Each workspace owns its own CSS. No shared design tokens exist between workspaces. The shell also owns its own CSS. No CSS is shared between the shell and any workspace.

## Rationale

- Isolation prevents visual coupling.
- Isolation allows each workspace to experiment with its own design language.
- Isolation makes it safe to add or remove workspaces without side effects.
- Isolation aligns with the product vision of a curated collection of diverse mobile business UI.

## Consequences

### Positive

- Workspaces are truly independent.
- Adding a workspace never affects existing workspaces.
- Removing a workspace never breaks the shell.
- Each workspace can use a completely different design language.

### Negative

- Some tokens may be duplicated across workspaces (for example, spacing scales).
- The bundle size may increase if many workspaces include similar tokens.
- Developers must be careful not to introduce global CSS.

## Mitigations

- Use CSS Modules or scoped CSS-in-JS to enforce isolation at the build level.
- Document the isolation rule in AGENTS.md.
- Review all pull requests for CSS leakage.
- Accept the duplication cost as a trade-off for independence.

## Related Decisions

- ADR-002: Shell Design Independence (pending)
- ADR-003: Offline-First Architecture (pending)

## References

- PRD.md, Section 9.3: Workspace Isolation
- Glossary.md: Workspace Isolation
