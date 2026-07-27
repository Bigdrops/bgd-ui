# Workspace Documentation Standard

## Purpose

Define the mandatory documentation behaviour for all Workspace components in the BGD UI Shell.

A Workspace is not a demo, mockup, or standalone implementation.

A Workspace is a repository-backed view that exposes the component itself, its source code and its design documentation through a consistent interface.

This standard ensures every Workspace provides the same documentation experience and remains aligned with the rest of the repository.

---

# Scope

This standard applies to every Workspace rendered inside the Shell.

It does not define the implementation of individual Workspace components.

It does not replace component documentation standards.

It defines how Workspace documentation must be exposed.

---

# Repository First

The repository is the single source of truth.

Workspace documentation must expose repository assets.

It must never generate replacement assets.

Source code comes from the component registry.

Design documentation comes from:

```text
docs/Designs
```

The Workspace viewer exists only to expose those assets.

---

# Required Workspace Tabs

Every Workspace component must expose the following tabs.

| Tab | Purpose |
|------|----------|
| Preview | Live React/TSX component |
| Code | Repository source files |
| Design.md | Repository design documentation |

These tabs are mandatory.

A Workspace is considered incomplete if any of these are missing.

---

# Preview

The Preview tab renders the actual Workspace component.

Requirements:

- Render the real React component.
- Preserve the original appearance.
- Do not render screenshots.
- Do not render generated HTML.
- Do not simplify the implementation.
- Do not replace the component with a static mock.

The Preview must always represent the actual implementation.

---

# Code

The Code tab exposes the actual repository source.

Requirements:

- Display registered repository source files.
- Support syntax highlighting.
- Support collapsible source files.
- Support per-file Copy.
- Support Copy All.
- Display file names and paths where appropriate.

The Code tab must never:

- generate source code
- create example implementations
- hide repository files that belong to the component
- substitute fake code

Only repository source may be displayed.

---

# Design.md

Every Workspace component must expose its Design.md document.

Design documentation is sourced from:

```text
docs/Designs
```

Requirements:

- Render the original markdown.
- Preserve formatting.
- Support copying the raw markdown.
- Display the repository document exactly as stored.

Agents must never:

- generate Design.md
- rewrite Design.md
- summarise Design.md
- invent documentation
- replace repository documentation

The repository markdown is authoritative.

---

# Component Registry

Workspace documentation is resolved through the shared component registry.

Every Workspace that exposes Code or Design.md must have a registry entry.

Each Workspace must register:

- unique component identifier
- repository source files
- Design.md path

The Workspace viewer must consume the shared registry rather than maintaining its own mapping.

---

# Shared Viewer

There must be a single documentation viewer implementation.

Workspace and Components must reuse the same:

- documentation viewer
- source viewer
- markdown viewer
- syntax highlighting
- copy behaviour
- toolbar
- tabs
- registry lookup

Duplicate implementations are prohibited.

---

# Clipboard Behaviour

Documentation viewers must provide consistent clipboard functionality.

Code viewer requirements:

- Copy selected file
- Copy All source files
- Success feedback after copying

Design viewer requirements:

- Copy raw markdown
- Success feedback after copying

Copy operations must copy repository content exactly.

Rendered HTML or generated text must never be copied.

---

# No Placeholder Behaviour

Workspace documentation must never redirect users elsewhere.

The following behaviours are prohibited:

- "Go to Components"
- "Available elsewhere"
- "Open another page"
- "Coming soon"
- "Documentation unavailable"
- "Source available on another screen"

If repository assets exist, they must be displayed within the current Workspace.

If an asset genuinely does not exist, display a simple inline empty state.

Never redirect the user to another page.

---

# Design Source of Truth

All Workspace design documentation originates from:

```text
docs/Designs
```

Workspace implementations must expose these documents.

They must never generate replacements.

Every Design.md displayed in the Workspace should correspond to an existing repository document.

---

# Future Workspace Requirements

Every new Workspace added to the repository must:

- expose Preview
- expose Code
- expose Design.md
- register itself in the component registry
- map to an existing Design.md document
- reuse the shared documentation viewer

Creating separate documentation systems for individual Workspaces is prohibited.

---

# Definition of Done

A Workspace implementation is not complete until all of the following are true:

- Preview renders the live component.
- Code exposes the actual repository source.
- Design.md exposes the repository markdown.
- Copy works.
- Copy All works.
- Design.md supports copying raw markdown.
- The shared viewer implementation is reused.
- No placeholder or redirect behaviour exists.
- Repository assets are exposed directly.

---

# Related Standards

This standard should be used together with:

- `AGENTS.md`
- Other documents under `docs/Standards`
- `docs/bgd-ui-prd/model-behaviour.html` (visual behaviour reference)

When conflicts arise, repository standards take precedence over ad hoc implementations.