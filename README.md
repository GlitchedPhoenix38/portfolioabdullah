# Abdullah Ansari — Developer Portfolio

A responsive personal portfolio for Abdullah Ansari, a second-year B.Tech Computer Science
Engineering student specializing in Cyber Security.

**GitHub:** https://github.com/GlitchedPhoenix38
**Live site:** https://glitchedphoenix38.github.io/portfolioabdullah/

Built with **TanStack Start**, React, TypeScript, Tailwind CSS and Vite.

## Content and structure

- Factual portfolio content lives in `src/lib/portfolio-content.ts`, separate from presentation.
- The page itself is the TanStack route `src/routes/index.tsx`, with document-level attributes
  applied through route `staticData` and consumed by `src/routes/__root.tsx`.
- Visual tokens and section styles live in `src/styles/site.css`.
- Motion is native CSS plus `IntersectionObserver`, so `prefers-reduced-motion` and performance
  do not depend on an animation library.
- Project presentations use Radix Dialog primitives for focus trapping, Escape dismissal and
  keyboard accessibility.

## Run locally

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
# open http://localhost:8080/
```

## Build and deploy

The site is published to GitHub Pages from the repository subpath `/portfolioabdullah/`.

```bash
GITHUB_PAGES=true npm run build   # static output in .output/public
```

`.github/workflows/deploy-pages.yml` runs the same build on every push to `main`, adds a
`404.html` fallback for client-side routing, and publishes `.output/public` as the Pages
artifact. Pages **Source** must stay set to **GitHub Actions**.

The base path is applied only for that build (`GITHUB_PAGES=true`), so local dev and the
Lovable preview keep serving from `/`.

## Static assets

`public/` is copied into the build output as-is: `favicon.ico`, `favicon.svg`, `og.png`
(Open Graph / Twitter card), `robots.txt`, `sitemap.xml` and `archive/monograph-draft/`
(the earlier light "technical monograph" design, kept for reference).

## Notes

No backend, no database, no trackers. Fonts load from Google Fonts with system fallbacks.
