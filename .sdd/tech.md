## Tech context

- Language/runtime: Node.js (ESM via `"type": "module"`)
- Test framework: `@cucumber/cucumber`
- HTTP client/assertions: `pactum`
- Reporting: `cucumber-html-reporter`
- CI: GitHub Actions workflow in `.github/workflows/tests.yml`

## Conventions

- Step definitions live in `features/step_definitions/`
- Shared helpers live in `utils/`
- Prefer a single source of truth for environment configuration (e.g., base URL)

