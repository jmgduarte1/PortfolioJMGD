# AGENTS.md

## Purpose

This file defines working instructions for AI coding agents operating on this repository.

Agents must treat the existing project documentation and implementation as the source of truth rather than introducing new patterns without first reviewing what already exists.

The goal is to use AI to accelerate engineering work while preserving architectural consistency, code quality, accessibility, maintainability, security, performance, and developer ownership.

---

## 1. Read Project Context Before Significant Work

Before significant implementation, refactoring, architectural, or planning work, review the relevant documentation.

### Public Project Documentation

Project overview:

```text
docs/project/PROJECT_OVERVIEW.md
```

Project roadmap:

```text
docs/project/ROADMAP.md
```

Frontend architecture:

```text
docs/architecture/FRONTEND_ARCHITECTURE.md
```

WordPress migration architecture:

```text
docs/architecture/WORDPRESS_CONTENT_MIGRATION.md
```

Email middleware architecture:

```text
docs/architecture/EMAIL_MIDDLEWARE_ARCHITECTURE.md
```

Project decisions:

```text
docs/decisions/PROJECT_DECISIONS.md
```

Local development:

```text
docs/DEVELOPMENT_GUIDE.md
```

---

## 2. Optional Local Agent Context

Some development environments may contain additional local agent context that is intentionally excluded from version control.

When such context is available, agents may use it to understand:

* Current development state.
* Active implementation priorities.
* Temporary planning notes.
* Local operational details.

Local agent context must never be required for the application to build, test, or run.

Public documentation and the existing implementation remain the primary sources of truth.

---

## 3. Inspect Existing Code Before Changing It

Before implementing a solution:

1. Locate the relevant existing implementation.
2. Understand the current pattern.
3. Review related models, services, repositories, components, and tests.
4. Check whether the same concern has already been solved elsewhere.
5. Prefer extending existing patterns over introducing parallel approaches.

Do not create a new abstraction simply because one can be created.

Do not replace an established pattern without a clear technical reason.

---

## 4. Respect Existing Project Decisions

Before making architectural, structural, or project-wide convention changes, review:

```text
docs/decisions/PROJECT_DECISIONS.md
```

Accepted decisions are intentional constraints.

If requested work conflicts with an accepted decision:

1. Identify the conflict.
2. Explain the implications.
3. Propose the smallest reasonable resolution.
4. Do not silently override the decision.

If a significant new decision is accepted, update the decision documentation.

When a decision is replaced, preserve its history and mark it as superseded where appropriate.

---

## 5. Angular Development Principles

Follow the established Angular architecture.

### Components

* Prefer standalone Angular components.
* Keep components focused on presentation and interaction.
* Avoid direct HTTP calls from components.
* Avoid backend-specific response structures in templates.
* Keep business and data-access concerns outside presentation components where practical.
* Reuse established shared components instead of duplicating common UI behavior.

### UI Component File Structure

Every Angular UI component must keep TypeScript logic, HTML markup, and SCSS styling in separate files.

Required structure:

```text
component-name/
├── component-name.component.ts
├── component-name.component.html
└── component-name.component.scss
```

This convention applies to:

* Page components.
* Feature components.
* Shared UI components.
* Layout components.
* Form components.

Do not use inline templates or inline styles for UI components.

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

Keep responsibilities separated:

* `.ts` contains component behavior and orchestration.
* `.html` contains template markup.
* `.scss` contains component-specific presentation.

This rule does not apply to non-UI TypeScript artifacts such as:

* Services.
* Repositories.
* Models.
* Mappers.
* Guards.
* Utilities.

### Data Access

Content should flow through the established repository architecture:

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

Do not bypass `ContentRepository` by introducing direct backend calls from components.

### TypeScript

* Preserve strict TypeScript.
* Prefer explicit domain types.
* Avoid `any` unless clearly justified.
* Do not suppress type errors merely to make code compile.
* Keep external API response types separate from application domain models when appropriate.

### Project Structure

Follow the existing feature-oriented structure.

Use existing locations such as:

```text
src/app/core
src/app/shared
src/app/layout
src/app/features
src/app/data-access
src/app/models
```

Do not introduce new top-level architectural folders without a clear need.

---

## 6. Preserve Backend Independence

Angular components must remain independent from the current content backend.

Phase 1 uses `json-server`.

A future phase is expected to use WordPress.

Backend-specific mapping belongs in the repository/data-access layer.

Do not introduce:

* `json-server` response details inside components.
* WordPress-specific fields inside component templates.
* Direct API URLs scattered across presentation code.

Portfolio domain models should remain stable wherever practical.

---

## 7. Accessibility Is a Requirement

Accessibility is part of implementation quality, not optional cleanup.

UI changes should preserve or improve:

* Semantic HTML.
* Logical heading hierarchy.
* Keyboard navigation.
* Visible focus states.
* Accessible names.
* Form labels.
* Validation feedback.
* Contrast.
* Responsive zoom and text resizing.
* Reduced-motion behavior where applicable.

Target:

**AODA / WCAG 2.0 Level AA**, with WCAG 2.1 AA practices where practical.

Do not trade accessibility for visual convenience.

Accessibility regressions are defects.

---

## 8. Performance Is a Requirement

The portfolio targets Lighthouse performance scores above 90 on desktop and mobile.

Avoid introducing:

* Unnecessary dependencies.
* Oversized images.
* Duplicate API requests.
* Render-blocking assets.
* Heavy decorative animation.
* Unnecessary client-side JavaScript.
* Large abstractions for small problems.

Consider impact on:

* LCP.
* CLS.
* INP.
* Bundle size.
* Initial rendering.
* SSR/prerender behavior.

---

## 9. SSR and Browser APIs

Angular SSR/prerendering is part of the project architecture.

Do not assume all application code executes only in the browser.

When using browser-only APIs:

* Confirm SSR compatibility.
* Isolate browser-specific behavior when necessary.
* Avoid unsafe direct access to browser globals during server rendering.

Changes affecting routes, initialization, application configuration, or shared services should be verified against SSR behavior.

---

## 10. Security Boundaries

Do not expose private credentials in frontend code.

Never place secrets in:

* Angular source files.
* Browser-delivered environment configuration.
* Public documentation.
* Git-tracked configuration.

Email delivery belongs to the separate server-side middleware architecture.

Do not move SMTP or email-provider credentials into the Angular application.

Do not log private credentials, tokens, or secrets.

---

## 11. Implementation Workflow

For meaningful development work, use the following sequence.

### Before Implementation

1. Read relevant documentation.
2. Inspect the current implementation.
3. Identify affected files and dependencies.
4. Check existing project decisions.
5. Identify risks or architectural conflicts.

### During Implementation

1. Make the smallest coherent change that satisfies the requirement.
2. Follow existing conventions.
3. Reuse established abstractions.
4. Keep changes focused.
5. Avoid unrelated cleanup unless required by the task.
6. Preserve the required `.ts` / `.html` / `.scss` separation for UI components.

### After Implementation

Depending on the affected area:

1. Run relevant automated tests.
2. Run the production build.
3. Verify affected functionality manually.
4. Check accessibility.
5. Check SSR/prerender compatibility.
6. Consider performance impact.

---

## 12. Completion Criteria

A task is not complete merely because the code compiles.

A meaningful implementation should be considered complete only after relevant validation has been performed.

At minimum, consider:

```bash
npm test -- --watch=false
npm run build
```

For UI changes:

* Verify the result in the browser.
* Confirm the component keeps separate `.ts`, `.html`, and `.scss` files.
* Check keyboard and semantic behavior where applicable.

For architecture changes:

* Confirm existing repository and domain boundaries remain intact.
* Update decision documentation when necessary.

---

## 13. AI-Generated Code Is a Draft

AI-generated code, architecture, documentation, and tests must be treated as proposed engineering work, not automatically accepted output.

The developer remains responsible for:

* Correctness.
* Architecture.
* Maintainability.
* Security.
* Accessibility.
* Testing.
* Performance.
* Final technical decisions.

Do not assume generated code is correct because it compiles.

Inspect and validate implementation before treating work as complete.

---

## 14. Avoid Unnecessary Complexity

Prefer the simplest solution that fits the existing architecture and current requirements.

Avoid:

* Premature abstraction.
* New dependencies without clear value.
* Duplicate utilities.
* Duplicate state-management approaches.
* Parallel architecture patterns.
* Large refactors for small requirements.
* Over-engineering portfolio-scale functionality.

Complexity must be justified by an actual requirement.

---

## 15. Documentation Updates

Update documentation when implementation changes make existing documentation inaccurate.

### Update Project Decisions When

A change materially affects:

* Architecture.
* Technology selection.
* Security.
* Accessibility.
* Performance.
* Deployment.
* Data contracts.
* Significant product behavior.
* Project-wide development conventions.

### Update Local Development Context When Available

If a local development-context file is present, update it when:

* Completing a major task.
* Changing the active development focus.
* Discovering a major blocker.
* Completing a validation phase.
* Changing the recommended next task.

Keep temporary operational status out of architectural documentation.

---

## 16. Do Not Invent Requirements

If behavior is not documented and cannot be inferred reliably from the existing implementation:

* Do not silently invent a business requirement.
* Identify the ambiguity.
* Prefer preserving existing behavior.
* Clearly separate assumptions from documented requirements.

When multiple valid solutions exist, prefer the solution most consistent with existing architecture and accepted project decisions.

---

## 17. Keep Public and Local Context Separate

Public project documentation belongs under:

```text
docs/
```

Optional local development context may exist outside version control.

Never move credentials, secrets, temporary operational notes, or other intentionally local information into public documentation.

The public repository must remain fully understandable and runnable without local context files.

---

## 18. Source-of-Truth Priority

When information conflicts, use the following priority:

1. Explicit current developer instruction.
2. Existing working implementation.
3. `docs/decisions/PROJECT_DECISIONS.md`
4. Relevant architecture documentation.
5. Project overview and roadmap.
6. Optional local development context when available.
7. Agent inference.

If documentation and implementation conflict, identify the discrepancy rather than silently choosing one.

---

## Working Principle

Use AI to accelerate engineering work, not to bypass engineering judgment.

Understand the existing system first, make deliberate changes, preserve project conventions, validate the result, and leave the project easier to understand than you found it.
