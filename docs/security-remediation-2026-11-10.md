# Security remediation — 10 November 2026

## Changes in this branch

- Pinned `actions/checkout`, `actions/setup-node`, and CodeQL Actions to full commit SHAs. The SHAs were read from the official GitHub repositories' `v4` tag references on 10 November 2026. The CodeQL annotated tag resolves to commit `33d7b85da1a04171e211befe2c739303b9a4c066`; the tag itself reports an unsigned signature, so the workflow pins the resolved commit rather than trusting the mutable tag.
- Added `.github/dependabot.yml` for weekly npm and GitHub Actions updates, grouped by ecosystem and npm dependency type. Dependabot PRs still require human review and CI.
- Vendored the unmodified Departure Mono WOFF2 file at `public/fonts/DepartureMono-1.500.woff2`, served it from the same origin, and included the upstream SIL Open Font License 1.1 at `public/fonts/OFL-1.1.txt`. Copyright notice is also present beside the `@font-face` rule in `src/style.css`. The font's visual design and use are unchanged.
- Kept workflow permissions read-only by default. CodeQL's `actions: read` and `security-events: write` are scoped to its analysis job, where result upload needs them.

## M1: make CI checks required in GitHub

This branch does not modify GitHub rulesets. After merging this PR, configure the existing **Protection Branch** ruleset:

1. Open repository **Settings → Rules → Rulesets** and edit **Protection Branch**, which targets the default branch.
2. Under **Require status checks to pass**, enable the rule and add the checks reported by a successful PR run: `Build and tests (ubuntu-latest)`, `Build and tests (windows-latest)`, and `JavaScript and TypeScript` (CodeQL). If GitHub shows a different exact context name, select the context shown in the PR checks UI.
3. Save the ruleset, open a test PR, and verify merging stays blocked until all required checks pass.

The current ruleset requires a PR and blocks deletion/non-fast-forward updates, but has no required status checks and requires zero approvals. CI gating can be enabled for a sole maintainer without requiring another reviewer; the maintainer remains responsible for reviewing and merging.

## Validation and outstanding conditions

Record `npm ci`, `npm audit`, `npm test`, `npm run build`, and `node scripts/check-build.mjs` for this branch before considering the PR ready. Inspect the built `dist/fonts/DepartureMono-1.500.woff2` and rendered pages to confirm the local font loads and styling, animations, and Three.js visuals remain intact.

Residual risks: M1 remains until the GitHub ruleset is updated and verified externally. Dependabot opens proposals but does not guarantee safe updates. Commit pinning limits mutable references, but upstream action code still requires periodic review. This work does not verify Cloudflare production settings or make Cloudflare changes. It does not resolve other findings or legal validation from the audit.
