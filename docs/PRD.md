---
spec_version: "1.0"
document: "PRD"
status: "draft"
product: "BGD UI"
owner: "Bigdrops"
priority: "high"
style_reference:
  - "docs/Designs"
architecture_reference:
  - "docs/Architecture"
agent_reference:
  - "AGENTS.md"
last_updated: "2026-07-20"
---

# BGD UI — Product Requirements Document

## 1. Metadata

| Field | Value |
|-------|-------|
| Product | BGD UI |
| Type | Offline-first mobile UI reference library |
| Status | Draft |
| Last updated | 2026-07-20 |

## 2. Executive Summary

BGD UI is a personal-first, offline-first mobile application. It is a curated collection of mobile-friendly screens, workspaces, components, and interaction patterns for business applications. It plays a similar role to sites like shadcn/ui, but instead of being a component registry, it is a growing library of complete mobile experiences and design explorations.

The application runs completely offline. It does not require a backend. It does not require hosting. The primary deployment target is Capacitor. Web is useful for development, but the mobile application is the primary experience.

The product is built primarily for the author. Others are welcome to use it if they like the approach. It is a curated collection, not a SaaS product.

## 3. Product Vision

### 3.1 Mission

Create a high-quality, offline-first reference library of mobile business UI. Every workspace, screen, and component must work without a network connection. The library must demonstrate that mobile business applications can be fast, beautiful, and completely local.

### 3.2 Principles

| Principle | Description |
|-----------|-------------|
| Offline-first | The application must function without a network connection. Local data is the source of truth. |
| Mobile-first | The primary experience is a mobile application. Tablet and desktop are secondary. |
| Workspace isolation | Each workspace owns its own visual identity. No shared design tokens exist between workspaces. |
| Shell neutrality | The application shell must not inherit styling from any workspace. The shell has its own design language. |
| Curated collection | Content is selected and refined, not generated automatically. Quality is more important than quantity. |
| Personal-first | The product is built for the author. External users are welcome but not the primary driver. |
| Documentation as source code | All technical documentation follows ADS-STE100 Simplified Technical English. |

### 3.3 Non-Goals

The following items are explicitly out of scope:

- Team collaboration or multi-user support.
- Cloud synchronization in the MVP.
- A backend server or hosted service.
- A plugin or extension architecture.
- Enterprise permissions or role-based access control.
- Real-time data feeds.
- Social features or sharing.

## 4. Problem Statement

Most existing UI libraries and component registries focus on desktop experiences. Mobile business UI is often an afterthought. Existing solutions typically require a backend, a network connection, or a subscription. There is no high-quality, offline-first reference library for complete mobile business workspaces.

BGD UI solves this by providing a curated collection of complete, self-contained mobile business UI experiences that run entirely on the device.

## 5. Success Criteria

The product is successful when:

- The application runs completely offline on a mobile device.
- The application shell has a distinct visual identity that does not conflict with any workspace.
- At least three complete workspaces exist in the library.
- Each workspace demonstrates a different design language.
- The codebase is well-documented and follows ADS-STE100.
- The application deploys successfully through Capacitor.

## 6. Goals

| Goal | Priority | Status |
|------|----------|--------|
| Define the application shell design language | High | Open |
| Implement the application shell (gallery, navigation, settings) | High | Not started |
| Port the invoice workspace (PRAV) into the isolated workspace model | High | Partial |
| Create additional workspaces (CRM, Inventory, Quotations) | Medium | Not started |
| Establish the Masonry-yard as a reusable pattern library | Medium | Not started |
| Document every workspace, screen, and component | High | In progress |

## 7. Users

### 7.1 Primary Persona: The Author

| Attribute | Description |
|-----------|-------------|
| Role | Experienced software engineer |
| Goal | Build a personal reference library of high-quality mobile business UI |
| Technical skill | Expert |
| Devices | Mobile phone for testing, desktop for development |
| Primary workflow | Evaluate design references, implement workspaces, document patterns |
| Pain points | Existing UI libraries are desktop-centric; mobile business UI is fragmented |

### 7.2 Secondary Persona: The Adopter

| Attribute | Description |
|-----------|-------------|
| Role | Software developer or designer |
| Goal | Find inspiration or reusable patterns for mobile business applications |
| Technical skill | Intermediate to expert |
| Devices | Mobile phone, desktop browser |
| Primary workflow | Browse the gallery, inspect workspaces, copy patterns |
| Pain points | Difficulty finding complete, offline-ready mobile business UI examples |

## 8. Domain Model

### 8.1 Business Entities

**Workspace**

A workspace is a complete, self-contained business application module. It contains screens, components, styles, and logic specific to one business domain.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| description | string | Short description |
| icon | string | Icon identifier |
| category | string | Business category |
| status | enum | active, draft, archived |
| design_reference | string | Path to design document in docs/Designs/ |
| screens | array | List of screen identifiers |
| components | array | List of component identifiers |

**Screen**

A screen is a single view within a workspace.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| workspace_id | string | Parent workspace |
| name | string | Display name |
| route | string | Navigation route |
| purpose | string | Functional purpose |
| states | array | Supported states (loading, empty, error, success) |

**Component**

A component is a reusable UI element.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| type | enum | shell, workspace, shared |
| workspace_id | string | Parent workspace, or null for shell components |
| states | array | Supported states |
| accessibility | object | Accessibility requirements |

**Pattern**

A pattern is a reusable interaction behavior documented in the Masonry-yard.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| category | string | Interaction category |
| implementation | string | Code reference or description |
| workspaces | array | Workspaces that use this pattern |

### 8.2 Relationships

- A workspace contains many screens.
- A workspace contains many components.
- A screen contains many components.
- A pattern can be used by many workspaces.
- The application shell contains shell components.
- Shell components are not part of any workspace.

### 8.3 Ownership

- The author owns all content.
- Workspaces are owned by the author.
- The shell is owned by the author.
- Patterns in the Masonry-yard are owned by the author.

### 8.4 Lifecycles

**Workspace Lifecycle**

1. draft: The workspace is in development.
2. active: The workspace is complete and visible in the gallery.
3. archived: The workspace is hidden from the gallery but retained in the codebase.

**Screen Lifecycle**

1. draft: The screen is in development.
2. active: The screen is complete and reachable through navigation.
3. deprecated: The screen is replaced by a newer version.

## 9. Functional Specification

### 9.1 Feature: Application Shell

**Description**

The application shell provides the container for all workspaces. It includes the gallery, navigation, search, settings, and system chrome.

**User Story**

As a user, I want to open the application and see a gallery of available workspaces, so that I can select and launch the workspace I need.

**Requirements**

- The shell must display a gallery of all active workspaces.
- The shell must provide navigation between workspaces.
- The shell must provide a search function to find workspaces.
- The shell must provide a settings screen.
- The shell must support light and dark modes.
- The shell must display empty states when no workspaces exist.
- The shell must display loading states during initialization.

**Business Rules**

- The shell must not display draft or archived workspaces in the gallery.
- The shell must not inherit styling from any workspace.
- The shell must remain functional even when all workspaces are removed.

**Validation**

- The gallery must display at least one workspace to be considered functional.
- Search must return results within 100 milliseconds.
- Navigation must complete within 50 milliseconds.

**Errors**

- If no workspaces exist, display an empty state with a call to action.
- If a workspace fails to load, display an error state and allow retry.

**Acceptance Criteria**

- [ ] The gallery displays all active workspaces.
- [ ] Tapping a workspace launches it.
- [ ] Search filters workspaces by name and category.
- [ ] Settings toggles light and dark mode.
- [ ] The shell renders correctly with zero workspaces.

### 9.2 Feature: Workspace Gallery

**Description**

The workspace gallery is the primary entry point. It displays all active workspaces as cards or tiles.

**User Story**

As a user, I want to browse available workspaces in a visual grid, so that I can discover and launch the tools I need.

**Requirements**

- The gallery must display workspaces in a grid layout.
- Each workspace card must show the workspace name, icon, and description.
- The gallery must support categorization.
- The gallery must support filtering by category.
- The gallery must support sorting (alphabetical, recent, category).

**Business Rules**

- Only active workspaces appear in the gallery.
- Workspace cards must not display workspace-specific styling.
- Workspace cards must use the shell design language.

**Validation**

- The gallery must render within 200 milliseconds.
- The gallery must handle up to 50 workspaces without performance degradation.

**Acceptance Criteria**

- [ ] The gallery displays workspace cards in a grid.
- [ ] Tapping a card opens the workspace.
- [ ] Filtering by category updates the grid immediately.
- [ ] Sorting changes the order immediately.

### 9.3 Feature: Workspace Isolation

**Description**

Each workspace is a visually isolated module. No design tokens, colors, typography, or spacing values are shared between workspaces or between a workspace and the shell.

**User Story**

As an author, I want to add a new workspace with a completely different visual style, so that the library demonstrates diverse design languages.

**Requirements**

- Each workspace must define its own CSS.
- Each workspace must define its own typography.
- Each workspace must define its own colors.
- Each workspace must define its own spacing.
- Each workspace must define its own borders and animations.
- The shell must not reference workspace CSS.
- Workspaces must not reference shell CSS.
- Shared business logic may exist in a common utilities layer.

**Business Rules**

- CSS custom properties must be scoped to the workspace or shell.
- No global CSS overrides are permitted.
- Tailwind configurations must be workspace-specific where applicable.

**Validation**

- Removing a workspace must not affect the visual appearance of the shell or other workspaces.
- Adding a workspace must not affect the visual appearance of the shell or other workspaces.

**Acceptance Criteria**

- [ ] Each workspace has its own CSS file or module.
- [ ] The shell renders identically before and after adding a workspace.
- [ ] The shell renders identically before and after removing a workspace.

### 9.4 Feature: Offline-First Architecture

**Description**

The application functions completely without a network connection. All data is stored locally.

**User Story**

As a user, I want to use the application on a plane or in a remote location, so that I can access my business tools without internet access.

**Requirements**

- The application must not require a network connection to launch.
- The application must store all data locally using SQLite.
- The application must store files (PDFs, images, signatures) on the local filesystem.
- The application must handle the absence of network gracefully.
- The application must not display blocking error messages for missing connectivity.

**Business Rules**

- SQLite is the primary data store.
- The filesystem stores binary assets.
- No data is sent to external servers in the MVP.

**Validation**

- The application must launch successfully in airplane mode.
- All CRUD operations must complete without network access.

**Acceptance Criteria**

- [ ] The application launches with no network connection.
- [ ] All workspaces function without network access.
- [ ] Data persists across app restarts.
- [ ] File attachments are accessible offline.

### 9.5 Feature: Light and Dark Mode

**Description**

The application shell supports both light and dark color schemes. Each mode is intentionally designed, not derived from the other.

**User Story**

As a user, I want to choose between light and dark mode, so that the application is comfortable to use in different lighting conditions.

**Requirements**

- The shell must support a light mode.
- The shell must support a dark mode.
- Light mode must not be an inversion of dark mode.
- Dark mode must not be a recolor of light mode.
- Both modes must maintain accessible contrast ratios.
- The mode selection must persist across app restarts.

**Business Rules**

- Semantic color tokens must be used instead of component-specific colors.
- The mode toggle must be accessible in the settings screen.
- The system preference may be used as the default.

**Validation**

- Contrast ratios must meet WCAG AA standards.
- Color tokens must be defined for all semantic roles.

**Acceptance Criteria**

- [ ] The shell renders correctly in light mode.
- [ ] The shell renders correctly in dark mode.
- [ ] The mode toggle changes the appearance immediately.
- [ ] The selected mode persists after app restart.

## 10. Screen Inventory

### 10.1 Workspace Gallery Screen

| Attribute | Specification |
|-----------|---------------|
| Purpose | Primary entry point. Display all active workspaces. |
| Primary Actions | Tap workspace card to launch. Search for workspaces. |
| Secondary Actions | Open settings. Toggle light/dark mode. |
| Displayed Data | Workspace name, icon, description, category. |
| Components | Gallery grid, search bar, category filter, workspace card, settings button. |
| Navigation | Tap card → workspace home screen. Tap settings → settings screen. |
| Loading State | Skeleton grid of workspace cards. |
| Empty State | Message: "No workspaces available." Call to action: "Create a workspace." |
| Error State | Message: "Failed to load workspaces." Retry button. |
| Success State | Fully populated gallery grid. |
| Responsive Behavior | Grid columns adjust based on screen width. Mobile: 2 columns. Tablet: 3 columns. Desktop: 4 columns. |
| Accessibility Notes | Cards must be focusable. Search must have a label. Category filter must be a button group or dropdown with labels. |

### 10.2 Workspace Home Screen

| Attribute | Specification |
|-----------|---------------|
| Purpose | Entry point for a specific workspace. |
| Primary Actions | Access workspace features. Navigate within workspace. |
| Secondary Actions | Return to gallery. Access workspace settings. |
| Displayed Data | Workspace-specific content. |
| Components | Workspace-specific components only. |
| Navigation | Back button → gallery. Internal navigation → workspace screens. |
| Loading State | Workspace-specific skeleton. |
| Empty State | Workspace-specific empty state. |
| Error State | Workspace-specific error state. |
| Success State | Workspace-specific content. |
| Responsive Behavior | Follows workspace design, not shell design. |
| Accessibility Notes | Follows workspace accessibility rules. |

### 10.3 Settings Screen

| Attribute | Specification |
|-----------|---------------|
| Purpose | Configure application preferences. |
| Primary Actions | Toggle light/dark mode. Manage workspaces. |
| Secondary Actions | View application information. Access documentation. |
| Displayed Data | Mode preference, workspace list, app version. |
| Components | Toggle switch, list items, buttons, text. |
| Navigation | Back button → gallery. |
| Loading State | Skeleton list. |
| Empty State | Not applicable. |
| Error State | Message: "Failed to save settings." Retry button. |
| Success State | Settings list with current values displayed. |
| Responsive Behavior | Full width on mobile. Centered column on tablet and desktop. |
| Accessibility Notes | Toggles must have labels. List items must be focusable. |

### 10.4 Search Screen

| Attribute | Specification |
|-----------|---------------|
| Purpose | Find workspaces by name or category. |
| Primary Actions | Enter search query. Select result. |
| Secondary Actions | Clear search. Cancel search. |
| Displayed Data | Search results (workspace name, icon, category). |
| Components | Search input, result list, clear button, cancel button. |
| Navigation | Tap result → workspace home screen. Cancel → gallery. |
| Loading State | Skeleton result list. |
| Empty State | Message: "No workspaces match your search." |
| Error State | Message: "Search failed." Retry button. |
| Success State | Filtered result list. |
| Responsive Behavior | Full screen overlay on mobile. Sidebar on tablet and desktop. |
| Accessibility Notes | Search input must have a label. Results must be announced to screen readers. |

## 11. Component Behaviour

### 11.1 Shell Components

Shell components are part of the application shell. They use the shell design language.

**Button (Shell)**

| Attribute | Specification |
|-----------|---------------|
| Variants | primary, secondary, ghost, destructive |
| States | default, hover, active, disabled, loading |
| Disabled behavior | Opacity reduced to 0.5. No pointer events. |
| Loading behavior | Spinner replaces text. Button remains at full size. |
| Accessibility | Must be focusable. Must have an accessible label. Must support keyboard activation. |

**Card (Shell)**

| Attribute | Specification |
|-----------|---------------|
| Variants | default, elevated, interactive |
| States | default, hover, active, disabled |
| Purpose | Display workspace summaries, settings items, search results. |
| Accessibility | Must be focusable if interactive. Must have a label if clickable. |

**Input (Shell)**

| Attribute | Specification |
|-----------|---------------|
| Variants | text, search, number |
| States | default, focus, error, disabled |
| Error behavior | Red border. Error message below input. |
| Accessibility | Must have a label. Error must be announced. |

**Dialog (Shell)**

| Attribute | Specification |
|-----------|---------------|
| Purpose | Confirm actions, display alerts, collect simple input. |
| States | open, closed |
| Behaviour | Blocks interaction with background. Focus traps inside dialog. Closes on backdrop tap or close button. |
| Accessibility | Must announce itself to screen readers. Must trap focus. Must restore focus on close. |

**Sheet (Shell)**

| Attribute | Specification |
|-----------|---------------|
| Purpose | Display secondary content without leaving the current screen. |
| States | open, closed, dragging |
| Behaviour | Slides up from bottom. Can be dragged down to dismiss. Blocks background interaction partially. |
| Accessibility | Must announce itself. Must support dismiss gesture. |

**Toast (Shell)**

| Attribute | Specification |
|-----------|---------------|
| Purpose | Display transient feedback. |
| Variants | success, error, warning, info |
| Duration | 3 seconds for success, 5 seconds for error. |
| Behaviour | Appears at top or bottom. Auto-dismisses. Can be swiped away. |
| Accessibility | Must be announced. Must not block interaction. |

### 11.2 Workspace Components

Workspace components are defined by each workspace. They are not specified in this document. Each workspace design document defines its own component behaviour.

## 12. Navigation

### 12.1 Navigation Structure

```
Gallery (root)
├── Search (overlay)
├── Settings (screen)
│   └── Workspace Management (screen)
└── Workspace Home (screen)
    └── Workspace Screens (stack)
```

### 12.2 Navigation Rules

- The gallery is the root screen. The user cannot navigate above it.
- Tapping a workspace card pushes the workspace home screen onto the stack.
- The workspace home screen is the root of the workspace navigation stack.
- Workspaces may define their own internal navigation stacks.
- The back button from a workspace home screen returns to the gallery.
- Search is an overlay, not a stack push.
- Settings is a stack push from the gallery.

### 12.3 Navigation States

| State | Behaviour |
|-------|-----------|
| Default | Standard stack navigation. |
| Deep link | Launch directly to a workspace if specified. |
| Restore | Return to the last active screen on app restart. |
| Reset | Return to gallery on memory pressure or explicit reset. |

## 13. Information Architecture

### 13.1 Application Structure

```
BGD UI
├── Shell
│   ├── Gallery
│   ├── Search
│   ├── Settings
│   └── System Chrome
│       ├── App Bar
│       ├── Bottom Navigation
│       └── Status Bar
└── Workspaces
    ├── Invoice (PRAV)
    ├── CRM (planned)
    ├── Inventory (planned)
    └── Quotations (planned)
```

### 13.2 Data Storage

| Data Type | Storage | Format |
|-----------|---------|--------|
| Application state | SQLite | Relational |
| Workspace metadata | SQLite | Relational |
| User preferences | SQLite | Relational |
| Files (PDFs, images) | Filesystem | Binary |
| Signatures | Filesystem | Binary or vector |

### 13.3 File Organization

```
app/
├── src/
│   ├── shell/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── navigation/
│   │   └── styles/
│   ├── workspaces/
│   │   ├── invoice/
│   │   ├── crm/
│   │   └── ...
│   ├── shared/
│   │   └── logic/
│   └── lib/
│       └── database/
├── docs/
│   ├── PRD.md
│   ├── Architecture/
│   ├── Designs/
│   ├── Masonry-yard/
│   └── ADR/
└── capacitor/
```

## 14. State Matrix

Every screen and component must define states for the following conditions.

| State | Definition | Visual Treatment |
|-------|------------|------------------|
| Loading | Data is being fetched or computed. | Skeleton or spinner. |
| Skeleton | Content structure is known but data is not. | Gray placeholder blocks. |
| Empty | Data fetch completed with zero results. | Illustration and message. |
| Partial | Some data loaded, more pending. | Render available data, skeleton for pending. |
| Error | Data fetch or operation failed. | Error message and retry action. |
| Offline | Network is unavailable. | Subtle indicator, no blocking UI. |
| Unauthorized | User lacks permission. | Not applicable for single-user app. |
| Success | Operation completed successfully. | Toast or updated content. |
| Expired Session | Not applicable. | Not applicable for offline app. |
| Maintenance | Not applicable. | Not applicable for offline app. |

## 15. API Contract

BGD UI does not have a backend API. All data operations are local.

### 15.1 Local Data Interface

All data access goes through a local database layer.

**Workspace Repository**

| Operation | Input | Output | Error |
|-----------|-------|--------|-------|
| list | filter, sort | array of workspaces | database_error |
| get | workspace_id | workspace object | not_found, database_error |
| create | workspace data | workspace object | validation_error, database_error |
| update | workspace_id, changes | updated workspace | not_found, validation_error, database_error |
| delete | workspace_id | success | not_found, database_error |

**Screen Repository**

| Operation | Input | Output | Error |
|-----------|-------|--------|-------|
| list | workspace_id | array of screens | not_found, database_error |
| get | screen_id | screen object | not_found, database_error |

**Preference Repository**

| Operation | Input | Output | Error |
|-----------|-------|--------|-------|
| get | key | value | not_found |
| set | key, value | success | validation_error |
| delete | key | success | not_found |

### 15.2 File System Interface

| Operation | Input | Output | Error |
|-----------|-------|--------|-------|
| read | file_path | file buffer | not_found, permission_error |
| write | file_path, buffer | success | permission_error, disk_full |
| delete | file_path | success | not_found, permission_error |
| list | directory_path | array of files | not_found, permission_error |

## 16. Security Requirements

| Requirement | Specification |
|-------------|---------------|
| Authentication | Not applicable. Single-user, local-only application. |
| Authorization | Not applicable. No multi-user support. |
| Validation | All user input must be validated before storage. |
| Rate limiting | Not applicable. No network operations. |
| Secrets | No API keys or secrets in the MVP. |
| Logging | Local error logging only. No external log transmission. |
| Audit trail | Not applicable. |

## 17. Accessibility Requirements

| Requirement | Specification |
|-------------|---------------|
| Target | WCAG 2.1 Level AA |
| Touch targets | Minimum 44 by 44 CSS pixels |
| Contrast | Minimum 4.5:1 for normal text, 3:1 for large text |
| Focus | All interactive elements must be focusable |
| Labels | All form inputs must have visible labels |
| Screen readers | All content must be announced correctly |
| Motion | Respect prefers-reduced-motion |
| Color | Do not rely on color alone to convey information |

## 18. Performance Requirements

| Metric | Target |
|--------|--------|
| Time to first paint | Under 1 second on mid-range mobile device |
| Time to interactive | Under 2 seconds on mid-range mobile device |
| Gallery render | Under 200 milliseconds |
| Workspace launch | Under 100 milliseconds |
| Search response | Under 100 milliseconds |
| Animation frame rate | 60 frames per second |
| Memory usage | Under 100 megabytes for the shell |
| Bundle size | Under 500 kilobytes for the shell JavaScript |

## 19. Technical Constraints

| Constraint | Specification |
|------------|---------------|
| Framework | React |
| Build tool | Vite |
| Mobile framework | Capacitor |
| Database | SQLite (via Capacitor community plugin) |
| File storage | Capacitor Filesystem API |
| Styling | CSS Modules or CSS-in-JS with scoped custom properties |
| State management | React Context or Zustand |
| Routing | React Router or similar |
| Package manager | npm |
| TypeScript | Required for all source code |
| Testing | Vitest for unit, Playwright for E2E |

## 20. Design Requirements

### 20.1 Shell Design Language

The application shell must have its own design language. It must not inherit styling from any workspace.

**Open Work Item**

Select an application shell design language by evaluating existing paint references in `docs/Designs/`. Do not invent a new design. The recommendation must explain why the selected design is suitable for an offline mobile-first UI library with light and dark mode support.

**Requirements**

- The shell must support light and dark modes.
- The shell must use semantic color tokens.
- The shell must feel visually quiet.
- The shell must allow workspaces to become the visual focus.
- The shell must avoid competing with workspace designs.
- The shell must scale to many future workspaces.
- The shell must feel premium and fast.

**Constraints**

- Do not reuse PRAV styling.
- Do not reuse Sackville styling.
- Do not leak workspace styles into the shell.
- The shell must remain independent of every workspace.

### 20.2 Workspace Design Languages

Each workspace defines its own design language in a document under `docs/Designs/`. The PRD does not specify workspace designs.

## 21. Testing Requirements

| Type | Tool | Coverage Target |
|------|------|-----------------|
| Unit | Vitest | 80% of business logic |
| Integration | Vitest | All data repository operations |
| E2E | Playwright | All user flows |
| Accessibility | axe-core | All screens |
| Performance | Lighthouse | 90+ on all metrics |
| Visual regression | Chromatic or similar | All shell screens |

## 22. AI Implementation Rules

When implementing features for BGD UI:

- Reuse existing shell components. Do not duplicate shell components.
- Never duplicate business logic. Use the shared logic layer.
- Never invent requirements. If a requirement is unclear, stop and ask.
- Follow the shell design reference exactly once it is selected.
- Keep components focused. One component, one responsibility.
- Keep files small. Prefer composition over large files.
- Use existing patterns from the Masonry-yard.
- Prefer composition over inheritance.
- Never introduce unnecessary dependencies.
- Maintain accessibility in every component.
- Write tests for all new logic.
- Update documentation when implementation changes.
- If behaviour is undefined, stop and ask.
- Follow ADS-STE100 for all documentation.

## 23. Definition of Done

A feature is complete only when:

- All requirements are implemented.
- All acceptance criteria pass.
- Unit tests pass.
- Integration tests pass.
- E2E tests pass.
- Accessibility is validated.
- Responsive behaviour is validated on mobile, tablet, and desktop.
- Analytics events are added (if applicable).
- Documentation is updated.
- No console errors exist.
- No TypeScript errors exist.
- No lint errors exist.
- The feature works offline.

## 24. Future Roadmap

| Phase | Items | Status |
|-------|-------|--------|
| Phase 1 | Shell design selection, shell implementation, PRAV workspace port | In progress |
| Phase 2 | CRM workspace, Inventory workspace | Planned |
| Phase 3 | Quotations workspace, additional patterns | Planned |
| Phase 4 | Optional cloud sync, backup and restore | Future |
| Phase 5 | Community contributions, plugin architecture | Future |

## 25. Open Questions

| Question | Impact | Status |
|----------|--------|--------|
| Which design language should power the shell? | Blocks all shell UI work | Open |
| Should the shell design be adapted from an existing reference or created originally? | Affects long-term consistency | Open |
| How many workspaces should exist in the MVP? | Defines scope | Open |
| Should workspaces be dynamically loadable or statically compiled? | Affects architecture | Open |
| What is the Capacitor plugin strategy for SQLite and filesystem? | Affects implementation | Open |

## 26. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-07-20 | Initial draft | AI |
