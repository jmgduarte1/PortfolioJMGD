# Frontend Architecture

## Purpose

This document defines the public frontend architecture for the Personal Portfolio application.

It describes the structural and technical conventions that should remain stable as the project evolves.

---

## Technology Stack

The frontend uses:

- Angular
- Standalone Angular components
- Angular Material
- Angular CDK where useful
- TypeScript in strict mode
- SCSS
- Angular SSR / prerendering
- Feature-oriented application structure
- Typed domain models
- Repository-based content access

---

## Architectural Goals

The frontend architecture should remain:

- Maintainable
- Accessible
- Responsive
- Testable
- Backend-independent
- SSR-compatible
- Performance-conscious
- Easy to understand for future contributors and reviewers

The project should avoid unnecessary abstractions and complexity that are not justified by current requirements.

---

## Application Structure

The project follows a feature-oriented structure.

Primary application areas include:

```text
src/app/
├── core/
├── shared/
├── layout/
├── features/
│   ├── home/
│   ├── projects/
│   ├── experience/
│   └── contact/
├── data-access/
└── models/
```

### `core`

Contains application-wide infrastructure that should normally have a single shared responsibility across the application.

Examples may include:

- Application configuration
- Global services
- SEO infrastructure
- Cross-cutting application concerns

### `shared`

Contains reusable UI components, directives, pipes, and utilities that are genuinely shared across multiple features.

Code should not be moved into `shared` simply because it might be reusable someday.

### `layout`

Contains application shell and layout components.

Examples may include:

- Header
- Navigation
- Footer
- Main page shell

### `features`

Contains feature-specific application functionality.

Feature-specific code should remain close to the feature that owns it.

### `data-access`

Contains repositories, backend integrations, mapping logic, and related data-access infrastructure.

### `models`

Contains application domain models and shared types representing portfolio concepts.

---

## Angular Component Structure

Angular UI components must keep component behavior, markup, and presentation styles in separate files.

Every visual UI component should use the following structure:

```text
component-name/
├── component-name.component.ts
├── component-name.component.html
└── component-name.component.scss
```

This applies to:

- Page components
- Feature components
- Shared UI components
- Layout components
- Form components

Inline templates and inline styles should not be used for UI components.

Avoid:

```typescript
@Component({
  template: `...`,
  styles: [`...`]
})
```

Prefer:

```typescript
@Component({
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss'
})
```

The goal is to preserve explicit separation between:

- Component behavior and orchestration
- Template markup
- Component-specific presentation

This convention does not apply to non-UI TypeScript artifacts such as:

- Services
- Repositories
- Models
- Mappers
- Guards
- Utility functions

---

## Component Responsibilities

Components should remain focused on presentation and user interaction.

Components should:

- Consume typed application data.
- Delegate backend access to services or repositories.
- Keep templates free from backend-specific structures.
- Keep business and data-access concerns outside presentation components where practical.
- Reuse established shared components rather than duplicating common UI behavior.

Components should not:

- Make direct HTTP calls to content backends.
- Embed backend URLs.
- Depend directly on `json-server` response details.
- Depend directly on WordPress response details.
- Introduce new application-wide patterns without architectural justification.

---

## Standalone Components

The application uses standalone Angular components.

New components should be standalone unless a specific architectural reason requires otherwise.

Dependencies should be imported at the appropriate component or feature boundary.

The architecture should avoid unnecessary NgModule-based structure.

---

## Content Access Architecture

Angular components must remain independent from the content backend.

The intended flow is:

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

The current Phase 1 implementation uses:

```text
JsonServerContentRepository
```

A future production implementation is expected to use:

```text
WordPressContentRepository
```

Both implementations should satisfy the same application-level repository contract.

---

## Repository Boundary

The repository layer is responsible for isolating backend-specific concerns.

Components must not call content API URLs directly.

Backend-specific response structures should be mapped into application domain models before reaching presentation components.

Repository implementations may handle:

- HTTP communication
- Backend-specific response types
- Mapping
- Error normalization
- Backend-specific field translation

---

## Domain Models

Application models should represent portfolio concepts rather than persistence technology.

Examples include:

- Profile
- Navigation
- Expertise area
- Skill
- Project
- Case study
- Experience
- Certification
- SEO metadata

Models should remain stable across backend migrations wherever practical.

WordPress-specific or `json-server`-specific structures should not propagate into component templates.

---

## TypeScript

The application uses strict TypeScript.

Implementation expectations:

- Prefer explicit types.
- Avoid `any` unless there is a documented and justified reason.
- Do not suppress type errors simply to complete an implementation.
- Keep external API response types separate from application domain models where appropriate.
- Preserve type safety across repository boundaries.

---

## Styling

SCSS is the primary styling language.

Component-specific styles belong in the corresponding component `.scss` file.

Global styles should be limited to genuinely application-wide concerns such as:

- Theme configuration
- Global typography
- Reset/base styles
- Shared design tokens
- Application-wide accessibility helpers

Angular Material should be customized so the portfolio does not appear as an unmodified default Material application.

---

## Angular Material and CDK

Angular Material provides the main UI primitives.

Angular CDK may be used for accessibility, layout, overlays, or behavior where appropriate.

Implementation expectations:

- Import only required Material functionality.
- Preserve accessible behavior provided by Material components.
- Do not remove keyboard or focus behavior without an equivalent accessible implementation.
- Prefer project-specific visual customization over default Material appearance.

---

## Routing

The application supports:

- A concise single-page homepage experience.
- Dedicated routes for deeper portfolio content.

Expected routes include:

```text
/projects
/projects/:slug
/experience
/skills
/certifications
/contact
/accessibility
```

Route-level lazy loading should be used where it provides meaningful value.

Lazy loading should be applied deliberately rather than mechanically.

---

## SSR and Prerendering

Angular SSR / prerendering is part of the architecture from the beginning.

Public-facing functionality must remain compatible with server-side rendering.

Implementation expectations:

- Avoid assuming all code executes in the browser.
- Use browser-only APIs carefully.
- Isolate browser-specific behavior when necessary.
- Verify changes to initialization, routes, shared services, and application configuration against SSR behavior.

---

## Accessibility

Accessibility is a first-class requirement.

Target:

**AODA / WCAG 2.0 Level AA**, with WCAG 2.1 AA practices where practical.

UI implementation should preserve:

- Correct document language
- Semantic landmarks
- Logical heading hierarchy
- Skip navigation
- Keyboard accessibility
- Visible focus indicators
- Accessible names
- Sufficient contrast
- Accessible form labels and validation
- Zoom and text resizing support
- Reduced-motion support where applicable

Accessibility regressions should be treated as defects.

---

## Performance

The portfolio targets Lighthouse performance scores above 90 on desktop and mobile.

Implementation should avoid:

- Unnecessary dependencies
- Oversized images
- Duplicate API requests
- Render-blocking assets
- Heavy decorative animations
- Unnecessary client-side JavaScript

Performance-sensitive work should consider:

- LCP
- CLS
- INP
- Bundle size
- Initial rendering
- Image optimization
- SSR/prerender behavior

---

## Contact Form Boundary

The Angular application owns:

- Contact form presentation
- Client-side validation
- Request submission
- Loading state
- Accessible success messaging
- Accessible error messaging

Production email delivery belongs to a separate Node.js / Express middleware.

The Angular frontend must never contain SMTP passwords, API secrets, or email-provider credentials.

See:

```text
docs/architecture/EMAIL_MIDDLEWARE_ARCHITECTURE.md
```

---

## WordPress Migration

The current content backend uses `json-server`.

A future phase will migrate content delivery to WordPress while preserving the Angular presentation layer and portfolio domain models.

See:

```text
docs/architecture/WORDPRESS_CONTENT_MIGRATION.md
```

---

## Architectural Change Policy

Before introducing a significant architectural change:

1. Review the existing implementation.
2. Review `docs/decisions/PROJECT_DECISIONS.md`.
3. Identify the reason existing architecture is insufficient.
4. Prefer the smallest coherent change.
5. Update project decision documentation when a material decision changes.

The architecture should evolve intentionally rather than through incidental implementation choices.
