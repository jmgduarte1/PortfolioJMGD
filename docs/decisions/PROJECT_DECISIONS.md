# Project Decisions

This document records significant product and technical decisions made for the Personal Portfolio project.

Its purpose is to preserve the reasoning behind important choices, make architectural intent explicit, and provide context for future development.

Decisions should remain in this document when superseded so the evolution of the project remains visible.

---

## PD-001 — Angular as the Primary Frontend Framework

**Status:** Accepted

The portfolio uses Angular as its primary frontend framework.

### Rationale

The project is intended to demonstrate current hands-on Angular capability while applying established senior frontend engineering practices.

Angular provides strong support for component architecture, TypeScript, routing, dependency injection, SSR/prerendering, and accessible UI integration.

### Consequences

- Follow modern Angular practices.
- Prefer standalone components.
- Preserve strict TypeScript.
- Avoid unnecessary leakage of Angular-specific implementation details into backend contracts.

---

## PD-002 — Angular Material as the Primary UI Component Library

**Status:** Accepted

Angular Material provides the primary UI primitives.

### Rationale

Angular Material offers mature Angular integration, accessible interaction patterns, keyboard/focus support, and reliable primitives for common application UI.

### Consequences

- Import only required Material functionality.
- Customize Material so the portfolio does not look like a default Material application.
- Preserve accessibility behavior when customizing components.

---

## PD-003 — Light-First Corporate Visual Direction

**Status:** Accepted

The initial portfolio uses a light-first corporate visual direction.

### Rationale

The primary audience includes recruiters, hiring managers, technical leads, and engineering managers.

A restrained light visual system supports readability, professional presentation, and accessible contrast.

### Consequences

- Light surfaces are the default.
- Primary branding should remain professional and restrained.
- Accent colors should be used sparingly.
- Dark mode may be added later but is not required for the initial release.

---

## PD-004 — Single-Page Homepage with Dedicated Detail Routes

**Status:** Accepted

The portfolio combines a concise single-page homepage with deeper dedicated routes.

### Rationale

The homepage should communicate value quickly, while dedicated routes provide deeper evidence without overwhelming the initial experience.

### Consequences

The architecture supports routes such as:

```text
/projects
/projects/:slug
/experience
/skills
/certifications
/contact
/accessibility
```

---

## PD-005 — json-server as the Phase 1 Content Backend

**Status:** Accepted

Phase 1 uses `json-server` and `server/db.json` as the content API.

### Rationale

This enables HTTP-based frontend development and typed data-access patterns before introducing the production CMS.

### Consequences

- Content must not be hardcoded into presentation components.
- Components must not depend directly on `json-server`.
- Backend-specific behavior remains in the data-access layer.

---

## PD-006 — WordPress as the Planned Phase 2 Content Backend

**Status:** Accepted

The production content backend is planned to migrate from `json-server` to WordPress.

### Rationale

WordPress provides maintainable content management while Angular remains the presentation layer.

### Consequences

- WordPress responses must be mapped into existing portfolio domain models.
- WordPress-specific details must remain outside component templates.
- The migration should primarily affect repository/data-access code.

---

## PD-007 — Repository Abstraction for Content Access

**Status:** Accepted

Angular components do not communicate directly with the content backend.

Content access uses a `ContentRepository` abstraction.

### Implementations

Phase 1:

```text
JsonServerContentRepository
```

Future production implementation:

```text
WordPressContentRepository
```

### Rationale

The portfolio domain should remain independent from the technology used to store content.

### Consequences

- Components consume typed services, facades, or repository abstractions.
- API URLs must not be embedded directly in components.
- Backend-specific mapping belongs in the repository/data-access layer.

---

## PD-008 — Stable Portfolio Domain Models

**Status:** Accepted

Portfolio content is represented using application-specific TypeScript domain models.

### Rationale

The application should model portfolio concepts rather than persistence technology.

### Consequences

- Backend responses are mapped into portfolio domain models.
- WordPress-specific structures do not propagate into component templates.
- Domain models should remain stable when the backend changes wherever practical.

---

## PD-009 — Angular SSR / Prerendering from the Beginning

**Status:** Accepted

Angular SSR and/or prerendering is part of the architecture from the initial implementation.

### Rationale

The portfolio is a public site whose effectiveness depends on SEO, fast initial rendering, and strong performance.

### Consequences

- Browser-only APIs must be used carefully.
- Public routes must remain SSR-compatible.
- Shared code should not assume browser-only execution.

---

## PD-010 — Standalone Angular Components

**Status:** Accepted

The project uses standalone Angular components.

### Rationale

Standalone components represent modern Angular architecture and reduce unnecessary NgModule boilerplate.

### Consequences

- New components should be standalone unless a specific reason requires otherwise.
- Dependencies should be imported at the appropriate component or feature boundary.

---

## PD-011 — Feature-Based Application Structure

**Status:** Accepted

The Angular project primarily uses a feature-based folder structure.

### Intended Structure

```text
src/app/core
src/app/shared
src/app/layout
src/app/features
src/app/data-access
src/app/models
```

### Rationale

Feature-based organization provides clearer ownership and makes the project easier to navigate as it grows.

### Consequences

- Feature-specific code remains close to its owning feature.
- Shared code moves into `shared` only when genuinely reusable.
- Data-access concerns remain separate from presentation components.

---

## PD-012 — Strict TypeScript

**Status:** Accepted

The application uses strict TypeScript.

### Rationale

Strict typing improves refactoring safety, contract clarity, maintainability, and early error detection.

### Consequences

- Avoid `any` unless justified.
- Do not suppress type errors merely to complete an implementation.
- External API response types should remain separate from application domain models where appropriate.

---

## PD-013 — SCSS for Application Styling

**Status:** Accepted

SCSS is the primary styling language.

### Rationale

SCSS provides maintainable component styling and practical support for theme customization and responsive behavior.

### Consequences

- Component-specific styling remains with the component.
- Global styles are reserved for genuinely global concerns.
- Angular Material customization should be centralized where appropriate.

---

## PD-014 — Accessibility as a First-Class Requirement

**Status:** Accepted

The project targets Ontario AODA expectations by meeting WCAG 2.0 Level AA, while following WCAG 2.1 AA practices where practical.

### Consequences

Accessibility must be considered during implementation rather than treated as post-development cleanup.

Accessibility regressions are defects.

---

## PD-015 — Lighthouse Performance Target Above 90

**Status:** Accepted

The portfolio targets Lighthouse performance scores above 90 on desktop and mobile.

### Rationale

Performance affects user experience, search visibility, initial impressions, and demonstrated frontend engineering quality.

### Consequences

Performance must be measured before release and optimized when targets are not met.

---

## PD-016 — Separate Backend for Contact Email Delivery

**Status:** Accepted

Production email delivery from the contact form is handled by a separate backend rather than directly from Angular.

### Rationale

Email credentials and security controls belong server-side.

### Consequences

- Angular only submits contact information.
- Email credentials remain server-side.
- Validation, abuse prevention, and provider integration belong to the middleware.

---

## PD-017 — Contact Middleware as a Separate Repository

**Status:** Accepted

The Node.js / Express email middleware is maintained separately from the Angular portfolio repository.

### Rationale

The middleware has different runtime, security, configuration, and deployment responsibilities.

### Consequences

The Angular repository remains focused on portfolio frontend and content architecture.

---

## PD-018 — No Public Downloadable Resume in the Initial Release

**Status:** Accepted

The initial portfolio does not include a generic downloadable resume PDF.

### Rationale

The public website should provide sufficient professional evidence and encourage direct contact.

### Consequences

This decision may be revisited based on how the portfolio is used.

---

## PD-019 — Contact Form Implemented in Phases

**Status:** Accepted

The contact workflow evolves incrementally.

### Phase 1

- Accessible contact UI
- Client-side validation
- Development submission storage through `json-server`

### Phase 2

- Angular submits to Node.js / Express middleware
- Email delivery occurs server-side

### Phase 3

- Contact and content workflows may integrate further with WordPress where appropriate

---

## PD-020 — Route-Level Lazy Loading Where Beneficial

**Status:** Accepted

Feature routes use lazy loading when it provides meaningful startup or bundle-organization benefits.

### Rationale

Not every feature needs to be part of the initial application bundle.

### Consequences

Lazy loading is applied deliberately rather than mechanically.

---

## PD-021 — Separate Component Logic, Template, and Styles

**Status:** Accepted

Angular UI components keep TypeScript logic, HTML templates, and SCSS styles in separate files.

### Standard Structure

```text
component-name/
├── component-name.component.ts
├── component-name.component.html
└── component-name.component.scss
```

### Rationale

Explicit separation between behavior, markup, and presentation improves:

- Readability
- Maintainability
- Code review
- Navigation
- Debugging
- AI-assisted code inspection

### Consequences

- UI components should not use inline templates.
- UI components should not use inline styles.
- Component behavior belongs in `.ts`.
- Template markup belongs in `.html`.
- Component-specific presentation belongs in `.scss`.
- The convention applies to page, feature, shared UI, layout, and form components.
- The convention does not require `.html` or `.scss` files for non-UI TypeScript artifacts such as services, repositories, models, mappers, guards, or utilities.

---

## Decision Maintenance

Record a new decision when it materially affects:

- Architecture
- Technology selection
- Security
- Accessibility
- Performance
- Data contracts
- Deployment
- Significant product behavior
- Project-wide development conventions

Each decision should include:

- Unique identifier
- Status
- Decision
- Rationale
- Important consequences

Possible statuses include:

- Proposed
- Accepted
- Superseded
- Deprecated

When a decision is replaced, preserve the original entry and reference the decision that supersedes it.
