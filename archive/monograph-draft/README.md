# Abdullah Ansari — Developer Portfolio

A responsive personal portfolio for Abdullah Ansari, a second-year B.Tech Computer Science Engineering student specializing in Cyber Security.

**GitHub:** https://github.com/GlitchedPhoenix38

## Design

Light "technical monograph" direction: cool porcelain paper, ink typography, and dark figure plates that frame each project interface.

- **Type:** Newsreader for statements, Archivo for interface and body text, IBM Plex Mono for machine data (stack tags, repository names, figure UI).
- **Color:** porcelain `#ECEEEA`, ink `#15181B`, graphite plates `#171A1C`, petrol accent `#0D5A52` on paper and celadon `#57BFAF` on plates.
- **Motion:** one orchestrated hero entrance, plus hover/focus states and the scroll progress line. Respects `prefers-reduced-motion`.

## Features
- Responsive layout for mobile, tablet and desktop, with a collapsible navigation menu.
- Five selected projects with hand-built HTML/CSS interface previews, accurate descriptions and links to their repositories.
- A repository index for smaller builds, sourced from the public GitHub profile.
- Background, technical stack and contact sections.
- Scroll progress indicator and current-section highlighting in the nav.
- No build step or package installation required.

## Publish with GitHub Pages
The repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and check the **Deploy portfolio to GitHub Pages** workflow.
4. Once a run succeeds, open **Settings → Pages** to get the published URL.

The expected URL is `https://glitchedphoenix38.github.io/portfolioabdullah/` after Pages is enabled and the workflow succeeds.

## Run locally

This is a static site with no build step:

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000/
```

## Personal details to review
- Add a professional email address to `index.html` if you want it public; the contact section currently points to GitHub only.
- Project previews are styled HTML/CSS renditions of the real interfaces, not screenshots — swap in screenshots if you take any.
- The MGM Study Portal source repository is private, so the portfolio states that instead of showing a broken link.
- The "More repositories" list is pulled from real repository names and descriptions; update it as you add or rename repositories.

## Notes
This is a static HTML/CSS/JavaScript site. It requires no backend or database. Google Fonts are loaded with system fallbacks defined. GitHub Pages cannot execute PHP.
