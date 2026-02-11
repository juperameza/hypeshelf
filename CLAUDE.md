# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev              # Start Next.js dev server (localhost:3000)
npx convex dev        # Start Convex dev server (run in separate terminal alongside pnpm dev)
pnpm build            # Production build
pnpm lint             # ESLint
npx convex deploy     # Deploy Convex to production
```

## Architecture

**HypeShelf** is a shared recommendations hub built with Next.js 16 (App Router) + Convex (real-time backend) + Clerk (auth) + Tailwind/SCSS Modules.

### Provider hierarchy

`ClerkProvider` → `ConvexProviderWithClerk` → App. Configured in `app/layout.tsx` and `app/ConvexClientProvider.tsx`. Convex auth uses a Clerk JWT template named "convex" (configured in `convex/auth.config.ts`).

### Data flow

- **Convex functions** (`convex/`) are the backend — queries/mutations run server-side and provide real-time subscriptions to the client.
- `convex/schema.ts` defines two tables: `recommendations` and `users`.
- `convex/recommendations.ts` has all CRUD operations. Auth checks use `ctx.auth.getUserIdentity()` and look up the user in the `users` table for role-based checks.
- `convex/users.ts` handles user sync from Clerk → Convex via `syncUser` mutation.

### Auth & roles

- Clerk handles authentication. Users are synced to Convex's `users` table on sign-in via the `useSyncUser` hook.
- Two roles: `"user"` (default) and `"admin"`. Admin is set manually in the Convex dashboard.
- `src/utils/permissions.ts` has client-side permission helpers (UI-only; server enforces separately).
- `src/hooks/useUserRole.ts` provides role state via Convex query.

### Frontend structure

- `app/page.tsx` — Landing page. Shows `RecommendationsList` (authenticated) or `PublicRecommendationsList` (unauthenticated).
- `app/dashboard/page.tsx` — Protected page with `RecommendationForm`. Uses server-side auth check via `auth()`.
- Components live in `src/components/` with co-located SCSS modules (e.g., `Header/Header.tsx` + `Header/Header.module.scss`).
- Path alias: `@/src/...` maps to `src/` directory.

### Key types

`src/types/index.ts` defines `Genre`, `UserRole`, `Recommendation`, and exports `GENRES` and `GENRE_COLORS` constants. Genre values must match the Convex schema union validators exactly.

### Environment variables

Required in `.env.local`: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CONVEX_URL`, `CLERK_JWT_ISSUER_DOMAIN`.

### Styling

Components use SCSS Modules. Global styles are in `app/globals.scss`. Tailwind is available via PostCSS but SCSS modules are the primary pattern.

## Security Best Practices

### 1. Validate Inputs
- Sanitize and validate all incoming data (e.g., query parameters, form inputs, headers, cookies) to prevent injection attacks like SQL injection, XSS, and XML External Entity (XXE) attacks.
- Whitelist known-good patterns rather than blacklisting known-bad patterns, as attackers constantly evolve their techniques.
- Use strong type validation for all inputs (e.g., integers should not accept strings, emails should follow a strict pattern).
- Reject excessively long inputs to prevent buffer overflow and denial-of-service (DoS) attacks.
- Encode data properly before rendering it in HTML, JavaScript, or URLs.
- Use security libraries that provide built-in validation and sanitization, such as OWASP Java Encoder.

### 2. Safe Authentication & Authorization
- Enforce strong credential policies:
  - Minimum password length (e.g., 12+ characters)
  - Require a mix of uppercase, lowercase, numbers, and special characters
  - Implement Multi-Factor Authentication (MFA) where feasible
- Use secure authentication mechanisms:
  - Prefer OAuth 2.0, OpenID Connect (OIDC), or SAML over custom authentication
  - Never store plain-text passwords—use bcrypt, Argon2, or PBKDF2 with strong salts
- Session management:
  - Store session identifiers securely (e.g., HTTP-only, Secure, and SameSite cookies)
  - Implement session expiration and rotation policies
  - Use account lockout policy whenever applicable
  - Implement CSRF protection wherever applicable
- Implement Role-Based & Attribute-Based Access Control (RBAC/ABAC):
  - Enforce least privilege—users and services should have only the minimum permissions required
  - Always check user authorization in server-side logic (never trust client-side checks)
  - Use JWT tokens securely (avoid storing them in local storage; prefer HTTP-only cookies)

### 3. Data Protection & Encryption
- Secure storage:
  - Store sensitive data (like passwords) using salted, hashed functions (e.g., bcrypt, Argon2)
  - Use field-level encryption for highly sensitive fields (e.g., SSNs, credit card numbers)
- Encryption in transit:
  - Use TLS 1.2+ / HTTPS for all communications
  - Enforce HSTS (Strict-Transport-Security) headers
- Encryption at rest:
  - Encrypt databases, files, and backups using AES-256 or similar strong encryption algorithms
  - Enable Transparent Data Encryption (TDE) in databases where applicable
- Key management:
  - Rotate encryption keys periodically and on suspected compromise
  - Never hardcode secrets in source code—use environment variables or secrets managers

### 4. Handling Sensitive Data
- Minimize data collection:
  - Only collect essential personally identifiable or financial information
- Compliance requirements:
  - Adhere to GDPR, PCI DSS, HIPAA, and other applicable regulations
  - Implement data retention and deletion policies
- Mask & redact:
  - Redact or mask sensitive data in logs, UI, and debug output
- Strict access controls:
  - Enforce role-based access (RBAC) to sensitive data

### 5. Secure Configuration
- Environment separation:
  - Maintain separate development, staging, and production environments configuration files.
- Disable unused features:
  - Remove unnecessary services, endpoints, and debugging interfaces
  - Disable directory listing, default credentials, and insecure protocols
- Harden defaults:
  - Use strict CORS policies
  - Implement secure HTTP headers (e.g., CSP, X-Frame-Options, X-XSS-Protection)

### 6. Error Handling & Logging
- Generic error messages:
  - Do not expose internal details, stack traces, or database errors in production
- Secure logging:
  - Log events without storing sensitive information (e.g., avoid logging passwords, credit card numbers)

### 7. Secure Deployment & DevSecOps
- Container image security:
  - Use minimal base images to reduce the attack surface
  - Restrict container privileges (run as non-root, use read-only filesystem)
- API security:
  - Enforce rate limiting and authentication for all APIs when applicable
  - Secure GraphQL endpoints (e.g., depth limiting, cost analysis)
- Third-party Vulnerability Management
  - Use latest versions of third-party dependencies
  - Do not use publicly known vulnerable libraries and functions

### 8. Mobile Application Security
- Secure device storage:
  - Use platform-specific secure storage (e.g., Keychain for iOS, Keystore for Android)
  - Implement app-level encryption for sensitive data in shared storage
  - Never store authentication tokens or credentials in plaintext or NSUserDefaults/SharedPreferences
- Code protection:
  - Implement code obfuscation to prevent reverse engineering
  - Apply root/jailbreak detection
- Secure communications:
  - Implement certificate pinning to prevent man-in-the-middle attacks
- Permission & access control:
  - Implement contextual authentication for sensitive features (e.g., biometrics, MFA before financial transactions)
  - Use secure inter-app communication (avoid broadcasting sensitive intents on Android)
- Secure building & deployment:
  - Keep SDKs, libraries, and dependencies updated to address known vulnerabilities
  - Use code signing and verify the integrity of published applications

### 9. OWASP Top 10 Awareness
- Regularly review code and architecture against OWASP Top 10 vulnerabilities:
  - Broken Access Control
  - Cryptographic Failures
  - Injection
  - Insecure Design
  - Security Misconfiguration
  - Vulnerable and Outdated Components
  - Identification and Authentication Failures
  - Software and Data Integrity Failures
  - Security Logging and Monitoring Failures
  - Server-Side Request Forgery (SSRF)
