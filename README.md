[![Run API Tests](https://github.com/vanecordelins/project-api-automation/actions/workflows/tests.yml/badge.svg)](https://github.com/vanecordelins/project-api-automation/actions/workflows/tests.yml)

[![ServeRest Badge](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/ServeRest/ServeRest/)

# ServeRest API Automated Tests

This project contains automated tests for the [https://serverest.dev](https://serverest.dev) API using:

- JavaScript
- Cucumber.js (BDD)
- Pactum.js (HTTP requests)
- GitHub Actions (CI/CD)
- Cucumber HTML Reporter

## Run locally (basic)

```bash
git clone git@github.com:vanecordelins/project-api-automation.git
cd project-api-automation
npm install
npm test            # runs the test suite (configured in package.json)
npm run report      # generates the HTML report
```

## Environment configuration (optional)

- **SERVEREST_BASE_URL**: sets the API base URL. Default: `https://serverest.dev`

Example:

```bash
SERVEREST_BASE_URL=https://serverest.dev npm test
```

## Run locally (more detailed output)

```bash
git clone git@github.com:vanecordelins/project-api-automation.git
cd project-api-automation
npm install
npx cucumber-js --format @cucumber/pretty-formatter --format json:cucumber_report.json
npm run report
```

## Test structure

- `features/users/`: `.feature` files organized by endpoint/action (GET, POST, PUT, DELETE)
- `features/step_definitions/`: step implementations in JavaScript using Pactum.js
- `utils/`: shared utilities (token generation, data factories, config helpers)

## GitHub Actions pipeline

Every `push` or `pull_request` to the `main` branch runs:

1. Install dependencies
2. Execute BDD tests
3. Generate HTML report
4. Upload the report as an artifact

Note: generated reports (e.g. `cucumber_report.html` and `reports/`) are ignored and are not committed to the repository.

## AI‑Assisted SDD (Software Design Documentation)

This repository includes a lightweight AI‑Assisted SDD evidence trail in the `.sdd/` folder:

- Steering docs: `product.md`, `tech.md`, `structure.md`
- Feature artifacts: `requirements.md`, `design.md`, `tasks.md`
- Submission blurb: `submission.md`

These documents capture requirements, technical decisions, and task breakdowns linked to implemented changes in the test suite.

## Author
- Vanessa Lins
- API test automation challenge for ServeRest
