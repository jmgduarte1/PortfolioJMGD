# WordPress Content Migration

## Purpose

Phase 1 of the portfolio uses `json-server` as the content API.

A future phase will replace `json-server` with WordPress while preserving the Angular application's existing component and domain architecture.

The migration should primarily affect the data-access layer rather than presentation components.

---

## Current Architecture Boundary

Angular components do not depend directly on `json-server` URLs or response structures.

Content access is provided through the application's `ContentRepository` abstraction.

### Current Implementation

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
json-server
```

Current implementation includes:

* `ContentRepository`
* `JsonServerContentRepository`
* Portfolio domain models in:

```text
src/app/models/portfolio-content.ts
```

This boundary allows the persistence technology to change without requiring the Angular presentation layer to understand backend-specific structures.

---

## Target WordPress Architecture

The planned migration replaces the repository implementation while preserving the repository contract.

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
WordPressContentRepository
        |
        v
WordPress REST API
```

The future implementation will include:

* `WordPressContentRepository`
* WordPress REST API or custom WordPress endpoints
* Mapper functions that convert WordPress response structures into portfolio domain models

Angular components should remain unchanged wherever possible.

---

## Migration Principles

### Preserve Domain Models

Portfolio models should remain stable during the migration.

Backend-specific response structures must be transformed at the repository or mapping layer.

The Angular application should continue working with portfolio concepts rather than WordPress-specific concepts.

Examples include:

* Profile
* Navigation
* Expertise areas
* Projects
* Case studies
* Experience
* Certifications
* SEO metadata

---

### Keep WordPress Internals Out of Components

Angular component templates and presentation logic should not depend on WordPress implementation details.

Avoid exposing fields or structures such as:

```text
wp:featuredmedia
rendered
acf
_meta
_embedded
```

directly to Angular components.

If these structures are required by the WordPress API, they should be translated into application domain models before reaching the presentation layer.

---

### Map Backend Responses at the Data-Access Boundary

The `WordPressContentRepository` or associated mapper functions are responsible for converting WordPress responses into portfolio models.

Example:

```text
WordPress Project Response
            |
            v
    Project Mapper
            |
            v
Portfolio Project Model
            |
            v
   Angular Component
```

This keeps backend-specific transformations isolated and testable.

---

## WordPress Content Model

The following WordPress content types are candidates for representing portfolio content.

### Profile

Stores general professional profile information.

Potential fields include:

* Name
* Professional title
* Summary
* Location
* Social links

---

### Navigation Item

Represents configurable navigation entries.

Potential fields include:

* Label
* Route or URL
* Order
* Visibility

---

### Expertise Area

Represents major areas of professional expertise.

Potential fields include:

* Title
* Description
* Icon or visual identifier
* Display order

---

### Project / Case Study

Represents portfolio projects and technical case studies.

Potential fields include:

* Title
* Slug
* Summary
* Description
* Technologies
* Responsibilities
* Technical challenges
* Outcomes
* Images
* External links
* Featured status

---

### Experience Item

Represents professional experience entries.

Potential fields include:

* Company
* Role
* Start date
* End date
* Summary
* Responsibilities
* Technologies

---

### Certification

Represents professional certifications and training.

Potential fields include:

* Certification name
* Issuer
* Issue date
* Credential URL
* Credential identifier
* Display order

---

### SEO Settings

Represents configurable metadata for public pages.

Potential fields include:

* Page title
* Meta description
* Canonical URL
* Open Graph metadata
* Social preview image

---

## First-Class Content Fields

Certain fields should be treated as intentional parts of the content model rather than implementation details.

These include:

* Slugs
* Route metadata
* SEO metadata
* Image references
* Alternative text
* Display ordering
* Featured state

These fields should be mapped consistently regardless of the WordPress implementation used.

---

## Preferred API Strategy

The simplest migration path is a custom WordPress REST endpoint that mirrors the aggregate content structure currently consumed from `json-server`.

Example:

```http
GET /wp-json/jmgd/v1/portfolio
```

The endpoint can return the main portfolio collections in a single top-level response.

Conceptually:

```json
{
  "profile": {},
  "navigation": [],
  "expertiseAreas": [],
  "skills": [],
  "projects": [],
  "experience": [],
  "certifications": [],
  "caseStudies": [],
  "seo": {}
}
```

The exact response contract should be finalized when the WordPress implementation begins.

---

## Why an Aggregate Endpoint Is Preferred

An aggregate endpoint can reduce frontend knowledge of WordPress content structures and provide a contract closer to the portfolio domain.

It can also:

* Reduce the number of initial content requests.
* Centralize WordPress-specific composition logic.
* Simplify mapping in the Angular repository.
* Make the API easier to version.
* Keep the Angular application independent from WordPress post-type internals.

The frontend should still remain capable of using more specific endpoints if future requirements make that preferable.

---

## Repository Migration

The migration should primarily consist of introducing:

```text
WordPressContentRepository
```

while preserving:

```text
ContentRepository
```

Conceptually:

```typescript
ContentRepository
        ^
        |
        +-------------------------------+
        |                               |
JsonServerContentRepository   WordPressContentRepository
        |                               |
   json-server                  WordPress REST API
```

During development, the active implementation can be selected through Angular dependency injection and environment configuration.

---

## Migration Sequence

A future WordPress migration should follow this general sequence.

### 1. Define WordPress Content Types

Create the required WordPress content types and fields.

---

### 2. Define the API Contract

Determine whether the application will use:

* Standard WordPress REST endpoints
* Custom REST endpoints
* An aggregate portfolio endpoint
* A combination of these approaches

---

### 3. Implement Response Models

Create TypeScript interfaces representing the external WordPress API responses where useful.

These models should remain separate from the application's portfolio domain models.

---

### 4. Implement Mapping Functions

Convert WordPress API responses into the existing portfolio domain models.

---

### 5. Implement `WordPressContentRepository`

Create the repository implementation that satisfies the existing `ContentRepository` contract.

---

### 6. Validate Repository Contract Compatibility

Verify that existing Angular services, facades, and components continue operating without backend-specific changes.

---

### 7. Replace the Active Repository

Configure Angular dependency injection to use:

```text
WordPressContentRepository
```

instead of:

```text
JsonServerContentRepository
```

---

### 8. Validate the Application

Verify:

* Homepage content
* Project routes
* Experience content
* Certifications
* SEO metadata
* Image rendering
* Accessibility
* SSR/prerender behavior
* Error states
* Performance

---

## Contact Workflow Boundary

Contact/email delivery should remain separate from the public content repository.

The content repository is responsible for retrieving portfolio content.

Contact submissions belong to a separate application workflow and should not require SMTP credentials or other private email configuration inside the Angular frontend.

The contact architecture is documented separately in the email middleware documentation.

---

## Migration Success Criteria

The migration is successful when:

* WordPress becomes the production content source.
* Angular components do not require WordPress-specific changes.
* Existing portfolio domain models remain stable wherever practical.
* WordPress response structures remain isolated to the data-access layer.
* Public routes continue working with SSR/prerendering.
* SEO metadata is correctly populated.
* Images and accessibility metadata are preserved.
* Existing tests continue passing or are updated only where backend integration behavior legitimately changes.
