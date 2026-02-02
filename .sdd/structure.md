## Repo structure (high level)

- `features/users/`: Gherkin feature files grouped by endpoint/action
- `features/step_definitions/`: Step implementations (Pactum requests + assertions)
- `utils/`: Test utilities (auth token generation, data factories)
- `generate-report.js`: Cucumber JSON → HTML report
- `reports/`: Saved HTML report output

## Proposed structure changes (this contribution)

- Add `.sdd/`: AI-Assisted SDD artifacts (steering + requirements/design/tasks)
- Add a small config layer in `utils/` so the API base URL is configurable and not duplicated across step files

