# Development Guide

## Purpose

This document describes how to install, run, build, test, and work with the Personal Portfolio application locally.

The project consists of:

* An Angular frontend.
* A local `json-server` content API used during Phase 1.
* Angular SSR/prerendering for production builds.

---

## Prerequisites

Before running the project locally, ensure the required Node.js and npm versions are installed.

Project-specific version requirements should be taken from:

* `package.json`
* `.nvmrc`, if present
* package manager configuration, if present

---

## Install Dependencies

From the repository root:

```bash
npm install
```

---

## Run the Application

### Angular and json-server Together

The recommended local development command is:

```bash
npm run dev
```

This starts:

```text
Angular frontend:
http://localhost:4200

json-server API:
http://localhost:3000
```

Contact email submission additionally requires EmailMiddleware on `http://localhost:8080`. The public local settings live in `public/app-config.json` and use Cloudflare's documented test site key. Configure EmailMiddleware with the matching test secret for local development; never use the test pair in production.

Production deployment should generate `app-config.json` with `contactApiUrl` and `turnstileSiteKey`. These are public browser values. SMTP and Turnstile secret credentials belong only in the middleware runtime environment.

This is the preferred command for normal local development.

---

## Run Only the Content API

To run `json-server` without starting Angular:

```bash
npm run api
```

The API is available at:

```text
http://localhost:3000
```

Useful Phase 1 endpoints include:

```text
GET /profile
GET /projects
GET /experience
GET /contactSubmissions
```

Example URLs:

```text
http://localhost:3000/profile
http://localhost:3000/projects
http://localhost:3000/experience
http://localhost:3000/contactSubmissions
```

---

## Content Source

During Phase 1, portfolio content is stored in:

```text
server/db.json
```

Angular components should not access this file or `json-server` endpoints directly.

Content is accessed through the application's repository/data-access architecture.

Current implementation:

```text
Angular Components
        |
        v
Content Services / Facades
        |
        v
ContentRepository
        |
        v
JsonServerContentRepository
        |
        v
server/db.json
```

When the project migrates to WordPress, Angular components should continue using the same application-level abstractions.

Backend-specific mapping will be handled by the future `WordPressContentRepository`.

---

## Development Workflow

A typical local development workflow is:

```text
1. Install dependencies
2. Start Angular + json-server
3. Implement the change
4. Run relevant tests
5. Verify the production build when appropriate
6. Validate the affected UI manually
```

Commands:

```bash
npm install
npm run dev
npm test -- --watch=false
npm run build
```

---

## Build

Create a production build with:

```bash
npm run build
```

The Angular application uses SSR/prerendering.

Build output is generated under:

```text
dist/portfolio-jmgd
```

A successful production build should be verified before completing changes that affect:

* Routing.
* SSR/prerendering.
* Application configuration.
* Dependency setup.
* Build tooling.
* Shared application infrastructure.

---

## Tests

Run the automated test suite with:

```bash
npm test -- --watch=false
```

Tests should be run after meaningful implementation changes.

Changes should not be considered complete while relevant tests are failing.

---

## Manual Verification

Automated tests do not replace manual frontend validation.

When a change affects the UI, verify the relevant behavior in the browser.

Depending on the change, validation may include:

* Responsive layout.
* Keyboard interaction.
* Visible focus states.
* Form validation.
* Loading states.
* Error states.
* Navigation.
* Content rendering.
* SSR/prerender compatibility.

---

## Accessibility Validation

Accessibility is a project requirement.

UI changes should preserve:

* Semantic HTML.
* Keyboard accessibility.
* Logical heading hierarchy.
* Accessible names.
* Visible focus indicators.
* Sufficient contrast.
* Accessible form labels and validation feedback.

Dedicated accessibility audits are tracked separately from normal unit testing.

---

## Performance Validation

Performance-sensitive changes should avoid:

* Unnecessary dependencies.
* Oversized images.
* Render-blocking assets.
* Unnecessary client-side JavaScript.
* Heavy decorative animation.
* Duplicate API requests.

Lighthouse and Core Web Vitals validation are part of the release workflow.

---

## Repository Boundaries

### Angular Portfolio Repository

This repository contains:

* Angular frontend code.
* Public portfolio content used during Phase 1.
* Public project documentation.
* Development configuration.

### Email Middleware

Production contact email delivery is handled by a separate Node.js / Express middleware repository.

The Angular application must not contain email-provider credentials.

See:

```text
docs/architecture/EMAIL_MIDDLEWARE_ARCHITECTURE.md
```

### Future WordPress Backend

The current `json-server` content backend is expected to migrate to WordPress.

See:

```text
docs/architecture/WORDPRESS_CONTENT_MIGRATION.md
```

---

## Public and Private Project Documentation

Public technical documentation is stored under:

```text
docs/
```

Private AI and operational context may exist locally under:

```text
.ai-private/
```

The `.ai-private/` directory is intentionally excluded from the public repository.

The application must not depend on private documentation in order to build or run.

---

## Troubleshooting

### Angular Starts but Content Does Not Load

Confirm that `json-server` is running on:

```text
http://localhost:3000
```

The easiest approach is normally:

```bash
npm run dev
```

rather than starting only the Angular development server.

---

### Port Already in Use

If port `4200` or `3000` is already occupied, identify the existing process before starting another development instance.

Avoid changing the project's expected ports unless configuration is updated consistently.

---

### Production Build Fails

Run:

```bash
npm run build
```

and address the reported TypeScript, Angular, SSR, or build configuration error rather than bypassing the production build.

---

## Related Documentation

Project architecture:

```text
docs/architecture/FRONTEND_ARCHITECTURE.md
```

WordPress migration:

```text
docs/architecture/WORDPRESS_CONTENT_MIGRATION.md
```

Email middleware:

```text
docs/architecture/EMAIL_MIDDLEWARE_ARCHITECTURE.md
```

Project decisions:

```text
docs/decisions/PROJECT_DECISIONS.md
```
