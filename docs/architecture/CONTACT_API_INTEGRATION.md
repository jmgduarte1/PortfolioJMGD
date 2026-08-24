# Contact API Integration

## Purpose

This document defines the integration boundary between the Angular portfolio application and the external Email Middleware service.

The Angular application is responsible for the contact experience presented to the user.

The Email Middleware is a separate backend application responsible for securely processing contact submissions and delivering email.

This document intentionally describes the integration contract from the frontend perspective rather than the internal middleware architecture.

---

## Production Deployment Model

The portfolio frontend and Email Middleware are deployed independently under separate origins.

Conceptually:

```text
https://www.example.com
        |
        v
Angular Portfolio
        |
        | HTTPS
        | POST
        v
https://api.example.com/api/contact
        |
        v
Email Middleware
        |
        v
Email Provider
```

The domain names above are examples only.

The actual production frontend and API origins are environment-specific.

---

## System Boundary

The Angular application must not depend on the internal implementation of the Email Middleware.

As long as the documented API contract remains stable, the middleware may change its:

* Email provider
* Internal architecture
* Hosting platform
* Validation implementation
* Spam protection strategy
* Logging implementation

without requiring changes to Angular presentation components.

---

## Frontend Responsibilities

The Angular portfolio owns:

* Contact form presentation.
* Client-side validation.
* Accessible labels and descriptions.
* Loading state.
* Submission state.
* Accessible success feedback.
* Accessible error feedback.
* Creating the documented API request.
* Handling the documented API response.

The Angular application does **not** own:

* Email delivery.
* SMTP configuration.
* Email-provider authentication.
* Server-side validation.
* Rate limiting.
* Spam protection.
* Server-side logging.
* Backend security configuration.

---

## API Endpoint

The Email Middleware is deployed under a dedicated API subdomain.

### Production

Conceptually:

```http
POST https://api.example.com/api/contact
```

### API Path

The middleware route is:

```text
/api/contact
```

### Development

A local development endpoint uses:

```text
http://localhost:8080/api/contact
```

The exact development port should match the Email Middleware configuration.

---

## API Origin Configuration

The API origin must be configured centrally.

UI components must not hardcode production URLs.

Conceptually:

```text
Development API origin:
http://localhost:3000

Production API origin:
https://api.example.com
```

The frontend data-access layer combines the configured API origin with the contact path:

```text
/api/contact
```

Resulting in:

```text
https://api.example.com/api/contact
```

in production.

---

## Cross-Origin Communication

Because the frontend and middleware use different subdomains, production requests are cross-origin.

Example:

```text
Frontend origin:
https://www.example.com

API origin:
https://api.example.com
```

The Email Middleware must explicitly allow the production frontend origin through its CORS configuration.

The frontend should not attempt to bypass or weaken this security boundary.

---

## Request Contract

The contact form submits:

```json
{
  "name": "Recruiter Name",
  "email": "recruiter@example.com",
  "company": "Company Name",
  "message": "Opportunity details, including job post link if available.",
  "turnstileToken": "single-use-widget-token",
  "website": ""
}
```

### Fields

#### `name`

Visitor or recruiter name.

#### `email`

Email address that may be used to respond to the contact request.

#### `company`

Company or organization associated with the inquiry.

#### `message`

Free-form contact message.

The interface may recommend including relevant opportunity or job-post details in this field.

#### `turnstileToken`

A short-lived token produced by the Cloudflare Turnstile widget. It is verified by the middleware and is not a permanent browser credential.

#### `website`

An intentionally empty honeypot field used as an additional automated-abuse signal.

---

## Client-Side Validation

The Angular application should validate the form before submission to provide immediate user feedback.

Client-side validation improves usability but is **not a security boundary**.

The Email Middleware must independently validate all submitted data.

---

## Success Contract

A successful response may use the following shape:

```json
{
  "ok": true,
  "message": "Message sent."
}
```

The Angular application should not require provider-specific information in successful responses.

---

## Error Contract

The frontend should expect predictable HTTP error responses for cases such as:

* Invalid input.
* Rate limiting.
* Rejected requests.
* Temporary middleware failure.
* Email delivery failure.

The middleware should not expose:

* SMTP errors containing sensitive information.
* Authentication details.
* Provider credentials.
* Server configuration.
* Stack traces.

The Angular application should translate API failures into accessible user-facing messages.

---

## Contact Form States

The UI should support at least the following states:

```text
Idle
  |
  v
Validating
  |
  v
Submitting
  |
  +--> Success
  |
  +--> Recoverable Error
```

While submitting:

* Prevent accidental duplicate submissions where appropriate.
* Communicate progress accessibly.
* Preserve entered content when practical if submission fails.

---

## Accessibility Requirements

The contact experience should provide:

* Visible form labels.
* Programmatically associated validation messages.
* Keyboard-accessible controls.
* Clear focus behavior.
* Accessible loading state.
* Accessible success feedback.
* Accessible error feedback.
* No reliance on color alone to communicate validation state.

---

## Security Boundary

No email-provider credentials may exist in the Angular application.

The frontend must never contain:

* SMTP passwords.
* Email-provider application passwords.
* Email API secrets.
* Private authentication tokens.
* Server-side provider configuration.

Browser-delivered application configuration must always be treated as public.

---

## CORS Expectations

The production middleware must allow only explicitly approved frontend origins.

Conceptually:

```text
Allowed production origin:
https://www.example.com
```

Development may allow:

```text
http://localhost:4200
```

Additional origins should only be permitted intentionally.

The Angular frontend should not depend on permissive CORS behavior.

---

## Development Phase

Contact submission now uses the Email Middleware in development and production. `json-server` remains the Phase 1 content source but no longer stores contact messages.

Conceptually:

```text
Current contact flow:

Angular
   |
   v
Email Middleware
```

The production architecture is:

```text
Angular
   |
   | HTTPS
   v
Email Middleware
   |
   v
Email Provider
```

The public API URL and Turnstile site key are loaded from `/app-config.json`. Both values are public. Production deployment may generate this public file from environment-specific values, but it must never contain the Turnstile secret or SMTP credentials.

---

## Frontend Data-Access Boundary

Contact HTTP communication should remain outside UI components.

Conceptually:

```text
Contact Component
       |
       v
Contact Service / Data Access
       |
       v
Configured API Origin
       +
/api/contact
```

Components should not contain:

```text
https://api.example.com/api/contact
```

directly.

This allows deployment configuration to change without modifying presentation components.

---

## Integration Validation

Before production release, verify:

* Valid contact submissions succeed.
* Invalid input produces appropriate feedback.
* Loading state is visible and accessible.
* Duplicate submissions are handled appropriately.
* API errors are translated into safe user-facing messages.
* No provider credentials exist in frontend source or generated bundles.
* The production API origin points to the expected middleware subdomain.
* The middleware accepts requests from the production frontend origin.
* Requests from unauthorized origins are rejected according to backend policy.
* HTTPS is used for production communication.

---

## Environment Expectations

Conceptually, the Angular deployment should provide an API origin equivalent to:

```text
Development:
http://localhost:3000

Production:
https://api.example.com
```

The exact mechanism used to provide this configuration should follow the Angular project's established environment and deployment architecture.

Do not store private credentials alongside the API origin.

The API origin itself is public configuration.

---

## Related Documentation

Frontend architecture:

```text
docs/architecture/FRONTEND_ARCHITECTURE.md
```

Project decisions:

```text
docs/decisions/PROJECT_DECISIONS.md
```

The Email Middleware repository contains the authoritative backend architecture, security, deployment, and email-delivery implementation.

---

## Ownership Rule

Use this document for changes that affect the contract or integration between the Angular application and the Email Middleware.

Examples include:

* Endpoint path changes.
* Request schema changes.
* Response schema changes.
* Frontend API-origin configuration.
* CORS expectations between the two deployed applications.
* Frontend submission behavior.

Changes that only affect middleware internals should be documented in the Email Middleware repository instead.
