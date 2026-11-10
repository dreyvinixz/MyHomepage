# Deployment and operations

## Requirements and configuration

- Node.js 24 LTS, `npm ci`, `npm test`, `npm run build` and `node scripts/check-build.mjs`.
- `VITE_GA_MEASUREMENT_ID` is optional. Set a valid GA4 ID (`G-...`) in the deployment environment when available. Vite embeds it at build time; it is a public identifier, not a secret. Rebuild after changing it.
- The domain is undecided. Configure the canonical URL, sitemap, and social metadata only after the final domain is known.

## Static hosting

Publish `dist/`. The React app uses client-side routes: direct requests to `/updates`, `/updates/<slug>`, and `/privacy` must serve `index.html`. Vite dev/preview handles this; `vercel.json` and `public/_redirects` cover Vercel and Netlify-style redirects respectively. Verify actual host behavior, deep links, reloads, and assets before release.

## Release verification

Check desktop and mobile navigation, language switching, accessibility, reduced motion, home animations, profile image, social links, privacy page, cookie acceptance/refusal/reopening and Google Analytics requests in browser developer tools. With the GA4 ID absent, Analytics does not load. With it configured, verify in a fresh browser that no Google tag loads before acceptance and that declining or withdrawing consent stops measurement. Confirm the target URL and public contact information before publishing. CI validates the build and consent logic; it does not replace a browser or live deployment check.
