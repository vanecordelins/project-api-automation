## Feature: Configurable API base URL (remove hardcoded URLs)

### Problem

Today the suite hardcodes `https://serverest.dev` across multiple step definition files and `utils/auth.js`. This makes it harder to:

- run against different environments (staging/mock/local)
- change the target host in one place
- avoid copy/paste drift

### Requirements

- **R1**: The API base URL MUST be configurable via environment variable.
  - Environment variable name: `SERVEREST_BASE_URL`
  - Default value: `https://serverest.dev`
- **R2**: Step definitions MUST stop hardcoding the host and instead use the configured base URL.
- **R3**: `utils/auth.js` MUST also use the configured base URL.
- **R4**: The change MUST be backwards compatible for local runs and CI (no env var required).

### Acceptance criteria

- Running `npm test` still passes against the default environment (ServeRest public URL).
- Setting `SERVEREST_BASE_URL` redirects requests to that host without code changes.

