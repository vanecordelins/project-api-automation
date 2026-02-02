## Design: Configurable base URL

### Decision

Use Pactum's global base URL configuration so step definitions can use relative paths (e.g. `/usuarios`) rather than repeating the host.

### Implementation approach

- Add `utils/config.js` exporting `BASE_URL`, reading `process.env.SERVEREST_BASE_URL` with a default of `https://serverest.dev` (and trimming any trailing slash).
- Add `utils/pactumSetup.js` that imports Pactum and calls `pactum.request.setBaseUrl(BASE_URL)`.
- Import `utils/pactumSetup.js` from:
  - `utils/auth.js` (so token generation is also configured)
  - each step definition module (ensures requests use the same configured host)

### Trade-offs

- **Pros**: single source of truth; minimal code in step definitions; environment switching is trivial.
- **Cons**: relies on a side-effect import to configure Pactum (documented and localized in `utils/pactumSetup.js`).

