# Email Middleware Architecture

## Purpose

The portfolio contact form requires server-side email delivery without exposing email credentials or provider-specific secrets in the Angular frontend.

Email delivery will therefore be handled by a separate Node.js / Express middleware application.

---

## Repository Boundary

The email middleware will be maintained in a repository separate from the Angular portfolio.

The middleware is responsible for:

* Receiving contact form submissions.
* Validating submitted data.
* Enforcing request limits.
* Restricting allowed frontend origins.
* Applying spam protection.
* Sending email through the configured email provider.
* Returning a stable API response to the Angular frontend.

The Angular application remains responsible only for the contact form UI, client-side validation, request submission, and accessible success/error states.

---

## High-Level Architecture

```text
Portfolio Visitor
       |
       v
Angular Contact Form
       |
       | POST /api/contact
       v
Node.js / Express Middleware
       |
       v
Validation / Security Controls
       |
       v
Email Provider
       |
       v
Portfolio Inbox
```

Email credentials must never be exposed in browser-delivered Angular code.

---

## API Contract

### Endpoint

```http
POST /api/contact
```

### Request Body

```json
{
  "name": "Recruiter Name",
  "email": "recruiter@example.com",
  "company": "Company Name",
  "message": "Opportunity details, including job post link if available."
}
```

### Required Fields

The middleware should validate:

* `name`
* `email`
* `company`
* `message`

Validation rules should be enforced server-side even if equivalent validation already exists in the Angular application.

---

## Success Response

Example response:

```json
{
  "ok": true,
  "message": "Message sent."
}
```

The API contract should remain simple so the Angular frontend does not depend on email-provider-specific behavior.

---

## Error Handling

The middleware should return consistent HTTP responses for invalid submissions and delivery failures.

The frontend should not receive:

* SMTP credentials.
* Provider credentials.
* Internal server configuration.
* Detailed provider errors containing sensitive information.

Errors returned to the frontend should be suitable for displaying accessible user-facing feedback.

---

## Security Requirements

### Server-Side Validation

All submitted fields must be validated by the middleware.

Client-side Angular validation improves user experience but must not be treated as a security boundary.

---

### Rate Limiting

Requests to the contact endpoint must be rate limited to reduce automated abuse.

---

### CORS Restrictions

The middleware should only accept browser requests from approved portfolio origins.

Production configuration should restrict CORS to the deployed portfolio domain.

---

### Credential Isolation

Email-provider credentials must remain server-side.

The Angular frontend must never contain:

* SMTP passwords.
* Email API secrets.
* Application passwords.
* Private authentication credentials.

---

### Logging

Sensitive credentials must never be written to application logs.

Logs should contain only the information required to diagnose middleware behavior safely.

---

### Spam Protection

Spam protection must be implemented before the contact endpoint is exposed publicly.

The exact mechanism may be selected when the middleware is implemented.

---

## Email Provider Boundary

The middleware should isolate provider-specific email behavior from the Angular frontend.

The initial implementation may use an SMTP-compatible provider or another server-side email delivery mechanism.

The frontend should continue using the same contact API regardless of the provider chosen.

Conceptually:

```text
Angular
   |
   v
POST /api/contact
   |
   v
Email Middleware
   |
   +--> SMTP Provider
   |
   +--> Other Email Provider
```

Changing the email provider should not require changes to the Angular contact components.

---

## Deployment Direction

The middleware is intended to be deployed independently from the Angular portfolio.

A dedicated subdomain may be used for the API.

Example conceptual deployment:

```text
www.portfolio.example
        |
        | HTTPS
        v
api.portfolio.example
        |
        v
Email Middleware
```

Production deployment must use secure server-side configuration for credentials and allowed origins.

---

## Angular Integration

The Angular frontend should submit a typed request to:

```http
POST /api/contact
```

Angular is responsible for:

* Form presentation.
* Client-side validation.
* Request submission.
* Loading state.
* Accessible success messaging.
* Accessible error messaging.

The middleware is responsible for:

* Security validation.
* Abuse prevention.
* Email delivery.
* Provider integration.

This boundary keeps frontend presentation concerns separate from server-side security and delivery responsibilities.

---

## Implementation Requirements

Before public release, the middleware must include:

* Server-side field validation.
* Request rate limiting.
* Restricted CORS configuration.
* Protected email-provider credentials.
* Safe logging.
* Spam protection.
* Predictable API responses.

---

## Success Criteria

The middleware implementation is considered ready for production when:

* Contact submissions can be sent successfully from the deployed Angular portfolio.
* No email credentials exist in frontend source or generated browser bundles.
* Invalid input is rejected server-side.
* CORS accepts only approved production origins.
* Request abuse is rate limited.
* Sensitive credentials are excluded from logs.
* Spam protection is active.
* The Angular frontend receives stable success and error responses.
