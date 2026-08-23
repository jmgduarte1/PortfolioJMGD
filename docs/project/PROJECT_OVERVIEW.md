# Personal Portfolio Project Overview

> **Visibility:** Public

## Project Purpose

This project is a personal portfolio website built in Angular to demonstrate current hands-on Angular capability, senior frontend engineering judgment, and enterprise web delivery experience.

The site is intended to provide recruiters, hiring managers, technical leads, engineering managers, and potential clients with a clear view of frontend engineering, enterprise commerce, integration, accessibility, performance, and technical delivery capabilities.

## Primary Goals

- Build a polished, corporate, clean, lightweight personal website.
- Use Angular and Angular Material as the main frontend stack.
- Load content from `json-server` during phase 1.
- Keep the content architecture ready for a phase 2 migration to a WordPress backend.
- Meet Ontario AODA expectations by targeting WCAG 2.0 Level AA, with WCAG 2.1 AA practices where practical.
- Target Lighthouse performance scores above 90 on desktop and mobile.
- Support both a single-page homepage experience and deeper routes for detailed content.
- Make the site maintainable, accessible, responsive, and easy to evolve.

## Audience

- Recruiters and hiring managers in Canada.
- Technical leads and engineering managers.
- Companies hiring Senior Frontend Developers, Full-stack Developers, Angular Developers, Magento / Adobe Commerce Developers, Salesforce Developers, or Technical Leads.
- Clients or teams looking for enterprise frontend and eCommerce implementation expertise.

## Visual Direction

Use a light-first corporate theme.

### Rationale

- A clean light theme supports a professional and readable presentation.
- It works well for long-form career and project content.
- It helps make accessibility contrast easier to validate when paired with restrained colors.
- It avoids an overly decorative or visually heavy developer-portfolio style.

### Recommended Style

- Light background with subtle surface contrast.
- Deep teal or navy as the primary brand color.
- Controlled accent color, possibly gold or cyan, used sparingly.
- Material Design components customized to avoid a generic Angular Material appearance.
- Optional dark mode can be added later, but it should not drive the initial design.

## Information Architecture

### Homepage

A single-page experience with anchor navigation and concise sections:

- Hero
- About
- Expertise
- Featured Projects / Case Studies
- Experience Highlights
- Certifications
- Contact

### Additional Routes

- `/projects`
- `/projects/:slug`
- `/experience`
- `/skills`
- `/certifications`
- `/contact`
- `/accessibility`

The homepage should summarize; detail routes should provide deeper evidence.

## Content Strategy

### Phase 1

Use `json-server` with a local `db.json`.

Suggested collections:

- `profile`
- `navigation`
- `hero`
- `about`
- `expertiseAreas`
- `skills`
- `projects`
- `experience`
- `certifications`
- `caseStudies`
- `contact`
- `seo`
- `accessibility`

### Phase 2

Replace `json-server` with WordPress REST API or a custom WordPress content endpoint while keeping Angular components independent from backend-specific implementation details.

### Phase 3

Connect content and contact workflows to WordPress or a WordPress-backed endpoint.
