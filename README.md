# Juan Manuel Gomez Duarte — Personal Portfolio

A modern Angular portfolio focused on demonstrating senior frontend engineering practices, enterprise web experience, accessible UI development, API-driven architecture, and AI-assisted software engineering workflows.

The application is designed as more than a static portfolio: it uses a typed, backend-independent content architecture that can evolve from a local development API to a production CMS without coupling Angular components to the persistence layer.

---

## Project Overview

This portfolio presents professional experience, technical expertise, projects, certifications, and case studies through a responsive Angular application.

The project is built to demonstrate practical engineering capabilities including:

* Modern Angular development
* TypeScript architecture
* Component-based UI design
* API-driven applications
* Frontend/backend separation
* Accessibility
* Performance optimization
* Server-side rendering and prerendering
* Enterprise eCommerce and platform experience
* Maintainable frontend architecture
* AI-assisted engineering workflows

The primary audience includes recruiters, hiring managers, technical leads, and engineering managers evaluating senior frontend, full-stack, Angular, eCommerce, Salesforce, and enterprise web development experience.

---

## Technology Stack

### Frontend

* Angular 21
* TypeScript
* Standalone Angular Components
* Angular Material
* Angular CDK
* SCSS
* Angular SSR / Prerendering

### Content and Data Access

* `json-server` — current development content API
* Typed application domain models
* Repository-based content abstraction
* Planned WordPress REST API integration

### Development Quality

* Strict TypeScript
* Unit testing
* Accessibility-first implementation
* SSR compatibility
* Lighthouse-oriented performance optimization
* Structured architectural documentation

---

## Architecture Highlights

### Backend-Independent Content Access

Angular components do not depend directly on the current content backend.

The application uses a repository boundary:

```text
Angular Components
        |
        v
Services / Facades
        |
        v
ContentRepository
        |
        +--> JsonServerContentRepository
        |
        +--> WordPressContentRepository
```

The current implementation uses `JsonServerContentRepository`.

A future production phase is designed to replace it with `WordPressContentRepository` without requiring the presentation layer to understand WordPress-specific response structures.

This keeps:

* Components backend-independent
* Domain models stable
* API mapping isolated
* Backend migrations localized to the data-access layer

---

## Component Architecture

UI components follow an explicit separation between behavior, markup, and presentation.

```text
component-name/
├── component-name.component.ts
├── component-name.component.html
└── component-name.component.scss
```

Inline templates and inline styles are intentionally avoided for UI components.

The application follows a feature-oriented structure:

```text
src/app/
├── core/
├── shared/
├── layout/
├── features/
├── data-access/
└── models/
```

This keeps feature-specific code close to its domain while separating reusable UI, infrastructure, and backend integration concerns.

---

## Accessibility

Accessibility is treated as an engineering requirement rather than a post-development enhancement.

Target:

**AODA / WCAG 2.0 Level AA**, with WCAG 2.1 AA practices applied where practical.

The implementation considers:

* Semantic HTML
* Logical heading hierarchy
* Keyboard accessibility
* Visible focus states
* Accessible names
* Form labels and validation feedback
* Color contrast
* Responsive text and zoom
* Reduced-motion support

Accessibility validation is part of the release workflow.

---

## Performance

The project targets:

**Lighthouse Performance > 90**

on both desktop and mobile.

Performance considerations include:

* Angular SSR / prerendering
* Route-level lazy loading where beneficial
* Minimal dependency usage
* Optimized assets
* Controlled client-side JavaScript
* Image sizing and optimization
* Core Web Vitals monitoring

Relevant metrics include:

* LCP
* CLS
* INP

---

## AI-Assisted Engineering

This project also demonstrates a structured approach to AI-assisted software development.

AI coding agents are used to accelerate activities such as:

* Technical planning
* Implementation support
* Code analysis
* Refactoring
* Documentation
* Testing
* Debugging
* Architecture review

AI-generated output is treated as proposed engineering work rather than automatically accepted code.

Architecture, correctness, maintainability, accessibility, security, testing, and final technical decisions remain developer responsibilities.

Agent working conventions are documented in:

```text
AGENTS.md
```

This includes explicit requirements around architecture, validation, component structure, backend boundaries, accessibility, and implementation workflow.

---

## Current Project Status

Core Angular implementation is substantially complete.

Implemented areas include:

* Angular application setup
* SSR / prerendering
* Angular Material integration
* Portfolio content models
* Repository-based content access
* `json-server` development backend
* Homepage sections
* Detail routes
* Contact form UI
* Development contact submission flow
* SEO/meta handling
* Production build verification
* Unit test verification

Current validation work focuses on:

* Accessibility audits
* Lighthouse desktop validation
* Lighthouse mobile validation
* Performance optimization

Future phases include:

* WordPress content backend
* Production contact email middleware

See the detailed roadmap:

```text
docs/project/ROADMAP.md
```

---

## Getting Started

### Prerequisites

Install Node.js and npm versions compatible with the project configuration.

Check `package.json` for project-specific requirements.

### Install Dependencies

```bash
npm install
```

### Start Local Development

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

---

## Content API

Phase 1 portfolio content is stored in:

```text
server/db.json
```

To start only the development content API:

```bash
npm run api
```

Example endpoints:

```text
http://localhost:3000/profile
http://localhost:3000/projects
http://localhost:3000/experience
http://localhost:3000/contactSubmissions
```

---

## Build

Create a production build with:

```bash
npm run build
```

The application uses Angular SSR/prerendering.

Build output is generated under:

```text
dist/portfolio-jmgd
```

---

## Tests

Run the automated test suite with:

```bash
npm test -- --watch=false
```

Code is not considered complete solely because it compiles. Relevant changes should also be validated through testing, browser verification, accessibility checks, SSR compatibility, and performance review where applicable.

---

## Contact Architecture

The Angular frontend does not send email directly or contain email-provider credentials.

Production contact delivery is designed around a separate Node.js / Express middleware:

```text
Angular Contact Form
        |
        | POST /api/contact
        v
Node.js / Express Middleware
        |
        v
Email Provider
```

This keeps:

* Email credentials server-side
* Validation server-side
* Rate limiting outside the frontend
* CORS restrictions centralized
* Spam protection within the API layer

The middleware is planned as a separate deployable repository.

---

## WordPress Migration

The current development environment uses `json-server`.

The production content architecture is designed to migrate to WordPress through a dedicated repository implementation rather than rewriting Angular components.

The planned migration includes:

```text
ContentRepository
        |
        v
WordPressContentRepository
        |
        v
WordPress REST API
```

Backend-specific response structures will be mapped into the existing portfolio domain models.

---

## Project Documentation

Detailed technical documentation is available under `docs/`.

### Project

* [`docs/project/PROJECT_OVERVIEW.md`](docs/project/PROJECT_OVERVIEW.md)
* [`docs/project/ROADMAP.md`](docs/project/ROADMAP.md)

### Architecture

* [`docs/architecture/FRONTEND_ARCHITECTURE.md`](docs/architecture/FRONTEND_ARCHITECTURE.md)
* [`docs/architecture/WORDPRESS_CONTENT_MIGRATION.md`](docs/architecture/WORDPRESS_CONTENT_MIGRATION.md)
* [`docs/architecture/EMAIL_MIDDLEWARE_ARCHITECTURE.md`](docs/architecture/EMAIL_MIDDLEWARE_ARCHITECTURE.md)

### Decisions

* [`docs/decisions/PROJECT_DECISIONS.md`](docs/decisions/PROJECT_DECISIONS.md)

### Development

* [`docs/DEVELOPMENT_GUIDE.md`](docs/DEVELOPMENT_GUIDE.md)

### AI Agent Instructions

* [`AGENTS.md`](AGENTS.md)

---

## Engineering Principles

The project follows several core principles:

* Understand existing architecture before changing it.
* Prefer simple solutions over premature abstraction.
* Keep UI components focused.
* Keep backend-specific concerns out of presentation code.
* Preserve strict typing.
* Treat accessibility as a requirement.
* Measure performance rather than assume it.
* Validate AI-assisted implementation before accepting it.
* Document meaningful architectural decisions.
* Keep the codebase easier to understand after every meaningful change.

---

## Author

**Juan Manuel Gomez Duarte**

Senior Frontend / Full-stack Developer

London, Ontario, Canada
