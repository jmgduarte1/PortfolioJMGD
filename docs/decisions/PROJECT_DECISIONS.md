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

## PD-022 — Contact Form Uses Runtime-Configured Middleware and Turnstile

**Status:** Accepted

The contact form submits through a dedicated `ContactService` to a runtime-configured middleware URL and obtains a Cloudflare Turnstile token in the browser.

### Rationale

The public browser cannot safely hold a shared authentication credential. A public site key plus server-verified, short-lived Turnstile tokens provides abuse verification while keeping the secret in EmailMiddleware.

### Consequences

- `/app-config.json` contains only the public API URL and public Turnstile site key.
- Email and Turnstile secrets never enter the Angular build.
- A honeypot and Turnstile token are included in the contact request.
- The widget is initialized only in the browser to preserve SSR compatibility.
- Contact submissions no longer use `json-server`.

---

## PD-023 — Build-Time Public Renderer Configuration

**Status:** Accepted

The headless renderer's backend URL and default locale are configured through
`BACKEND_URL` and `DEFAULT_LOCALE`. A Node script generates a TypeScript module
before npm start/build/watch/test/ng commands; `app.config.ts` imports it for
both browser and SSR builds.

### Rationale

Local `.env` configuration avoids hardcoded deployment settings while keeping
Node environment access outside browser code and avoiding new dependencies.

### Consequences

- Process environment overrides `.env`, with `.env.example` providing defaults.
- Only explicitly selected public values enter the generated module.
- Local and generated files are excluded from version control.
- Changes require restarting development commands or rebuilding deployment output.
- The contact runtime configuration defined in PD-022 remains separate.

---

## PD-024 — Environment-Specific CI/CD for Hostinger Static Hosting

**Status:** Superseded by PD-026

GitHub Actions validates pull requests and pushes to `staging` and `produccion`.
After tests and the normal production browser/server build pass, pushes deploy
using the matching GitHub Environment (`Staging` or `Produccion`).

### Rationale

The current implementation uses `RenderMode.Client` for all routes, despite
retaining SSR build infrastructure. A separate static output can serve those
routes on Hostinger Web/Cloud without introducing a Node server on the host.

### Consequences

- PD-009's SSR infrastructure remains; the normal server build stays a CI gate.
- This deployment target serves CSR, not request-time SSR. Future server-rendered
  routes require a Node-capable deployment workflow and a review of this decision.
- Environment variables configure renderer and public contact settings. Credentials
  stay in GitHub Secrets and are only exposed to the steps that need them.
- SSH host keys are verified and uploads require a marked frontend-only directory.
- Builds and budget failures block deployment; transfers preserve old assets.
- Hosting plan, DNS, target paths, credentials and CORS must be configured as
  described in `docs/HOSTINGER_DEPLOYMENT.md` before the first deployment.

---

## PD-025 — WordPress Renderer Replaces the Local Phase 1 Stack

**Status:** Accepted

The active Angular application uses the headless WordPress renderer directly.
The unused local `json-server` content stack, legacy portfolio page components,
local contact/Turnstile services, and runtime contact configuration were removed.

### Consequences

- Local development starts Angular only; content comes from the configured WordPress backend.
- The renderer owns page and navigation contracts.
- Contact delivery configuration is managed by the renderer/backend integration.
- The old `ContentRepository` and `json-server` migration path is historical documentation only.

---

## PD-026 — Hostinger Managed Angular SSR Web Apps

**Status:** Accepted

Staging and production run as separate Hostinger Node.js Web Apps connected to
the `staging` and `produccion` GitHub branches. Hostinger builds and deploys each
push using the environment variables configured on that Web App. GitHub Actions
continues to validate pull requests and pushes.

### Rationale

The managed Web App supports the Angular browser and server build and keeps each
environment's public build configuration in Hostinger. Public routes use
`RenderMode.Server`, and Hostinger runs the generated Express entry point. This
removes the custom SSH/rsync transfer and its credentials.

### Consequences

- `BACKEND_URL` and `DEFAULT_LOCALE` are defined separately in each Hostinger
  Web App and require a rebuild when changed.
- The renderer dependency uses a public HTTPS Git URL so Hostinger can install it.
- Hostinger uses the `Other` preset with `dist/portfolio-jmgd` as its explicit
  output directory and `server.js` as the entry file inside that output.
- A `postbuild` script copies the committed bootstrap into the output directory;
  it listens immediately and delegates requests to Angular's generated SSR
  handler at `./server/server.mjs`.
- The production `npm start` command launches the same output entry used by
  Hostinger; local development uses `npm run dev`.
- The Express server uses Hostinger's `PORT` and defaults to port 3000.
- Each Web App supplies an explicit `NG_ALLOWED_HOSTS` value and trusts the
  forwarding headers added by Hostinger's managed reverse proxy.
- GitHub branch protection must require CI before changes are merged because
  Hostinger's automatic deployment is triggered independently by the push.
- SSH deployment scripts, static-hosting preparation, and GitHub deployment
  secrets are no longer part of the project.

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
