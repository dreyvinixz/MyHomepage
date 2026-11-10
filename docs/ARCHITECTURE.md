# Architecture and content

- `src/App.tsx`: language preference and routes for home, notes, and privacy.
- `src/components/`: sections, Three.js visuals, consent UI and footer. Particle scenes use visibility-aware rendering; preserved experiments include the constellation, neural network, and gradient descent.
- `src/content/updates.ts`: manually maintained bilingual notes, social links and article paragraphs. See README for an example.
- `src/lib/analytics.ts`: optional Google Analytics integration; no Google analytics script is inserted before acceptance.
- `public/`: favicon, portrait, QuantBase logo, crawl policy and Netlify-style redirects.
- `vite.config.ts`: Vite, React and Tailwind CSS integration.

The website is a static client application. It has no content-management backend, automatic social synchronization, or server-side rendering. Google Fonts and jsDelivr serve external fonts; this is described on the privacy page. Animation quality and WebGL support vary by device.
