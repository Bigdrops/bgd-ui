---
spec_version: "1.0"
document: "Glossary"
status: "draft"
product: "BGD UI"
last_updated: "2026-07-20"
---

# BGD UI — Glossary

This document defines the vocabulary used across all BGD UI documentation. Every term has one meaning. Do not use synonyms.

## A

**ADR (Architecture Decision Record)**
A document that records a significant architectural decision, its rationale, and its consequences.

**Application Shell**
The container that hosts all workspaces. It includes the gallery, navigation, search, settings, and system chrome. The shell has its own design language.

## B

**Block**
A reusable implementation pattern. A block is a concrete code pattern that solves a specific UI or interaction problem. Blocks live in the Masonry-yard.

**BGD UI**
The product name. An offline-first mobile UI reference library.

## C

**Capacitor**
The deployment target. A cross-platform native runtime for web applications.

**Component**
A reusable UI element. Components can belong to the shell or to a workspace.

## D

**Design Language**
A complete set of visual rules including colors, typography, spacing, borders, and animations. Each workspace and the shell each have their own design language.

**Document**
A business object such as an Invoice or a Quotation. Documents exist inside workspaces.

## E

**Empty State**
A screen state that displays when no data exists. It includes a message and often a call to action.

## F

**Filesystem Storage**
Local storage for binary assets such as PDFs, images, and signatures. Managed through the Capacitor Filesystem API.

## G

**Gallery**
The primary screen of the application shell. It displays all active workspaces as cards or tiles.

**Group**
A collection of line items inside a document.

## I

**Item**
An individual line inside a group.

## L

**Light Mode**
One of two color schemes for the application shell. Light mode is intentionally designed, not an inversion of dark mode.

**Dark Mode**
One of two color schemes for the application shell. Dark mode is intentionally designed, not a recolor of light mode.

## M

**Masonry-yard**
A directory containing reusable implementation patterns (blocks) and reference assets. The Masonry-yard is distinct from the Designs directory.

**Mobile-first**
The design and development approach that prioritizes the mobile experience. Tablet and desktop are secondary.

## N

**Non-Goal**
An item that is explicitly out of scope. Non-goals prevent scope creep.

## O

**Offline-first**
The architectural principle that the application functions completely without a network connection. Local data is the source of truth.

## P

**Paint**
A visual design language. Paint documents live in `docs/Designs/`. Each paint document defines a complete visual identity.

**Pattern**
A reusable interaction behaviour. Patterns describe how a user interacts with the UI. Patterns are documented in the Masonry-yard.

**PRD (Product Requirements Document)**
The canonical product specification. It defines what the product is, why it exists, and what it must do.

## S

**Screen**
A single view within a workspace or the shell. A screen has a purpose, states, and components.

**Section**
A logical grouping inside a document.

**Semantic Color Token**
A color named by its function (for example, `background`, `primary-text`) instead of by its appearance (for example, `gray-500`).

**Shell**
See Application Shell.

**SQLite**
The primary local data store. SQLite holds all relational data for the application.

## W

**Workspace**
A complete, self-contained business application module. A workspace contains screens, components, styles, and logic specific to one business domain. Each workspace has its own design language. Workspaces are visually isolated from each other and from the shell.

**Workspace Isolation**
The architectural rule that no design tokens, colors, typography, spacing, borders, or animations are shared between workspaces or between a workspace and the shell. Only business logic may be shared.
