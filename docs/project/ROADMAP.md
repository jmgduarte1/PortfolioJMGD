# Project Roadmap

This document summarizes the implementation roadmap for the Personal Portfolio project.

It provides a high-level view of completed work, remaining validation tasks, and future planned phases.

---

## Phase 1 — Discovery and Definition

**Status:** Completed

Completed work:

* Defined the project goal and professional positioning.
* Reviewed project inspiration and source material.
* Defined the initial visual direction.
* Defined homepage messaging and content structure.
* Defined the initial contact workflow.
* Selected Angular SSR/prerendering from the beginning.
* Defined the Phase 1 and Phase 2 content architecture.
* Defined accessibility and performance targets.
* Confirmed the initial public navigation structure.

---

## Phase 2 — Angular Project Setup

**Status:** Completed

Completed work:

* Created the Angular application.
* Enabled Angular SSR/prerendering.
* Initialized Git source control.
* Added Angular Material.
* Configured the Angular Material theme.
* Added `json-server` as the Phase 1 content API.

---

## Phase 3 — Content and Data Architecture

**Status:** Completed

Completed work:

* Created the initial `server/db.json`.
* Defined typed portfolio content models.
* Created the `ContentRepository` abstraction.
* Implemented `JsonServerContentRepository`.
* Defined the planned WordPress migration architecture.

Related documentation:

* `docs/architecture/FRONTEND_ARCHITECTURE.md`
* `docs/architecture/WORDPRESS_CONTENT_MIGRATION.md`

---

## Phase 4 — Core UI Implementation

**Status:** Completed

Completed work:

* Built the main application layout shell.
* Implemented homepage sections.
* Implemented detail routes.
* Built an accessible contact form UI.
* Added guidance for including job opportunity details in contact messages.
* Implemented Phase 1 contact submission storage using `json-server`.

---

## Phase 5 — Email Middleware Design

**Status:** Architecture Defined

Completed planning:

* Defined a separate Node.js / Express middleware repository.
* Defined the contact submission API contract.
* Defined server-side validation and security requirements.
* Defined the separation between frontend and email-provider credentials.

Implementation of the production middleware remains separate project work.

Related documentation:

* `docs/architecture/EMAIL_MIDDLEWARE_ARCHITECTURE.md`

---

## Phase 6 — SEO

**Status:** Completed

Completed work:

* Added page-level SEO and metadata handling.
* Included SEO considerations in the content architecture.
* Preserved SSR/prerender compatibility for public pages.

---

## Phase 7 — Accessibility Validation

**Status:** In Progress

Implementation has been designed with accessibility as a first-class requirement.

Remaining validation work includes:

* Automated accessibility checks.
* Keyboard interaction review.
* Focus-state validation.
* Semantic structure review.
* Form accessibility verification.
* Contrast verification where required.
* Manual accessibility review.

Target:

**AODA / WCAG 2.0 Level AA**, with WCAG 2.1 AA practices where practical.

---

## Phase 8 — Performance Validation

**Status:** In Progress

The production build has already been verified.

Remaining work:

* Run dedicated performance checks.
* Run Lighthouse desktop audit.
* Run Lighthouse mobile audit.
* Review Core Web Vitals.
* Optimize identified bottlenecks.
* Confirm performance targets after optimization.

Target:

**Lighthouse performance score above 90 on desktop and mobile.**

---

## Phase 9 — Production Content Backend

**Status:** Planned

Replace the Phase 1 `json-server` content source with WordPress.

Planned work:

* Define WordPress content types.
* Define the production API contract.
* Implement WordPress response models.
* Implement mapping functions.
* Implement `WordPressContentRepository`.
* Replace the active repository implementation through dependency injection.
* Validate SSR, SEO, accessibility, and performance.

Related documentation:

* `docs/architecture/WORDPRESS_CONTENT_MIGRATION.md`

---

## Phase 10 — Production Contact Delivery

**Status:** Planned

Implement and deploy the separate Node.js / Express email middleware.

Planned work includes:

* Server-side validation.
* Rate limiting.
* Restricted CORS configuration.
* Secure email-provider configuration.
* Spam protection.
* Production deployment.
* End-to-end contact form validation.

Related documentation:

* `docs/architecture/EMAIL_MIDDLEWARE_ARCHITECTURE.md`

---

## Release Readiness

The portfolio should be considered ready for its initial public release when:

* Core portfolio content is complete.
* Production builds succeed.
* Automated tests pass.
* Accessibility validation has been completed.
* Lighthouse desktop and mobile audits have been completed.
* Identified critical performance issues have been addressed.
* Public routes work correctly with SSR/prerendering.
* Contact behavior is appropriate for the release phase.

---

## Future Enhancements

Potential future work may include:

* WordPress-backed content management.
* Production email delivery.
* Additional case studies.
* Additional technical project detail.
* Dark mode.
* Expanded automated testing.
* Additional accessibility automation.
* Further performance optimization.

Future enhancements should be prioritized based on portfolio value rather than added solely for technical complexity.
