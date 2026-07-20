# Invoice Workspace — Product Overview

**Version:** 1.0
**Date:** 2026-07-20
**Status:** Draft

---

## Purpose

The Invoice Workspace is a mobile-first document creation tool. It enables users to create, edit, and manage invoices within the BIGDROPS product suite.

## Goals

- Provide a fast, touch-optimized interface for invoice creation
- Support complex commercial terms (discounts, VAT, WHT, additional charges)
- Deliver real-time financial calculations as users enter data
- Maintain visual consistency with BIGDROPS brand identity
- Ensure accessibility across mobile and desktop devices

## Target Users

| User Type | Primary Use |
|-----------|-------------|
| Small business owners | Create and send invoices to clients |
| Freelancers | Bill clients for services rendered |
| Procurement teams | Generate purchase orders and delivery notes |
| Finance teams | Track outstanding payments and generate reports |

## Primary Workflow

1. User opens the Invoice Workspace
2. User selects or creates a client record
3. User enters invoice header details (title, number, dates)
4. User adds line items with descriptions, quantities, and prices
5. User configures commercial terms (payment terms, discounts, taxes)
6. User reviews totals and adds notes or terms
7. User saves or sends the invoice

## Mobile-First Philosophy

Mobile is the primary platform. Desktop provides progressive enhancement.

- All touch targets must measure at least 44×44 CSS pixels
- No horizontal scrolling on any screen size
- Single-column layout on mobile; multi-column on desktop
- Inline editing for all data entry
- Bottom sheets replace modal dialogs on mobile

## Core Principles

| Principle | Description |
|-----------|-------------|
| Simplicity | Minimize cognitive load; show only essential controls |
| Speed | Real-time calculations; no page reloads |
| Accuracy | Validate input at entry; prevent invalid states |
| Accessibility | Meet WCAG 2.1 AA standards |
| Consistency | Follow BIGDROPS design system patterns |

## Main Sections

The invoice workspace contains five primary sections:

1. **Header** — Document metadata, client selection, dates
2. **Line Items** — Product or service entries with quantities and prices
3. **Commercial Terms** — Payment terms, discounts, taxes, additional charges
4. **Totals** — Financial summary with grand total
5. **Additional Info** — Notes, terms, signatory, reference links

## Scope

This documentation covers:

- Product requirements for the Invoice Workspace
- UX behavior rules
- Financial calculation rules
- Implementation architecture

## Non-Goals

This documentation does not cover:

- Other document types (quotations, purchase orders, delivery notes)
- Backend API design
- Database schema
- Deployment infrastructure
- User authentication or authorization

---

## Document Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-07-20 | MiMoCode | Initial creation |
