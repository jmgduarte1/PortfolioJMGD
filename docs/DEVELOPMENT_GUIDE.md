# Development Guide

## Purpose

This document describes how to install, run, build, test, and work with the Personal Portfolio application locally.

The project consists of:

* An Angular frontend.
* A configured WordPress headless content backend.
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

### Local renderer configuration

Copy `.env.example` to `.env` in the repository root and edit:

```dotenv
BACKEND_URL=http://localhost
DEFAULT_LOCALE=en-CA
```

`BACKEND_URL` sets the headless renderer's backend URL; `DEFAULT_LOCALE` sets
its default language tag.

The npm start, build, watch, test, and ng scripts generate
`src/app/core/app-environment.generated.ts`, which `app.config.ts` imports.
`npm run dev` also generates it through `npm start`. Restart the command after
editing `.env`. When invoking Angular CLI directly, run `npm run config:generate`
first.

Precedence is process environment, `.env`, then `.env.example` defaults, so a
fresh checkout also works without a local `.env`. CI can supply `BACKEND_URL`
and `DEFAULT_LOCALE` before `npm run build`. Changing deployed values requires
a rebuild; the SSR and browser bundles share the generated configuration.

Both `.env` and the generated file are ignored by Git. Only the two named public
settings are exported. They are visible in the browser bundle and must not hold
secrets. No additional dependency is required; generation uses Node's built-in
dotenv parser (Node 20.19+ or a newer Angular-supported version).

### Angular locally

The recommended local development command is:

```bash
npm run dev
```

This starts:

```text
Angular frontend:
http://localhost:4200

The headless renderer reads content from the configured WordPress backend.
```

This is the preferred command for normal local development.

---

## Content Source

Pages and navigation are loaded by the headless renderer from the configured WordPress backend.

---

## Content Source

Pages and navigation are loaded by the headless renderer from the configured WordPress backend.

---

## Development Workflow

A typical local development workflow is:

```text
1. Install dependencies
2. Start Angular
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

For branch-based GitHub Actions deployments to Hostinger, see
[CI/CD and Hostinger setup](HOSTINGER_DEPLOYMENT.md). It covers `staging` and
`produccion`, GitHub Environment variables/secrets, SSH prerequisites, and the
current static-hosting scope.

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

The application uses the WordPress headless renderer as its content backend.

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
