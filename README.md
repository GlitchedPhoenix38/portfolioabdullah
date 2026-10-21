# Abdullah Ansari — Developer Portfolio

A cinematic, responsive personal portfolio for Abdullah Ansari, a second-year B.Tech
Computer Science Engineering student specializing in Cyber Security.

**GitHub:** https://github.com/GlitchedPhoenix38
**Live site:** https://glitchedphoenix38.github.io/portfolioabdullah/

## Design — "Signal Room"

Dark graphite foundation with a single coherent accent system: electric violet + icy blue.

- **Type:** Unbounded (display), Space Grotesk (body/UI), JetBrains Mono (machine data).
- **Color:** graphite `#0A0C10`, panel `#12161E`, violet `#8B68FF`, icy blue `#7CD4EE`.
- **Motion:** one orchestrated hero entrance (masked line reveal), scroll reveals via
  IntersectionObserver, pointer-responsive waveform canvas, 3D card tilt, cursor
  spotlight, magnetic CTAs. All of it is transform/opacity only, gated behind the `.js`
  class, disabled on touch devices, and fully neutralised under `prefers-reduced-motion`.
- **No frameworks, no dependencies, no build step.** Vanilla HTML/CSS/JS on GitHub Pages.

## Structure

- Immersive hero with animated waveform field (canvas 2D) and spec strip.
- Selected work: six verified projects (Mustaqeem, FoziScribe, Text-to-Audio Studio,
  LocalMind, peronal_ai, dual-space) as interactive cards with expandable
  "Engineering notes" — every claim traced to the repository's source or README.
- Background + engineering principles.
- Tools inventory (stack).
- "Also in the lab" honest repo list with per-project state labels
  (in development / complete / experiment).
- Contact band + footer.

Project states and descriptions are deliberately conservative: no invented usage
figures, stars, clients or features. Repositories that are private are labelled, not linked.

## Accessibility & resilience

- Skip link, semantic landmarks, `aria-expanded`/`aria-controls` disclosures,
  `aria-current` section highlighting, visible focus rings (icy blue), external-link
  screen-reader hints.
- Content is fully readable with JavaScript disabled (engineering notes default open,
  the dead toggle is hidden without JS).
- `prefers-reduced-motion` collapses every animation; pointer effects never run on touch.

## Publish with GitHub Pages

The repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml`.

1. **Settings → Pages → Source:** GitHub Actions.
2. Open the **Actions** tab and check **Deploy portfolio to GitHub Pages**.
3. Once a run succeeds, the site appears at
   `https://glitchedphoenix38.github.io/portfolioabdullah/`.

`sitemap.xml`, `robots.txt` (with sitemap reference), canonical URL, Open Graph and
Twitter card meta (`og.png` at 1200×630) are included.

## Run locally

```bash
python3 -m http.server 8000
# then open http://127.0.0.1:8000/
```

## archive/monograph-draft/

The previous uncommitted light "technical monograph" redesign (superseded by this
version) is preserved there for reference. Delete it once you have reviewed the new
design and are happy to drop the old one.

## Notes

Static site: no backend, no database, no trackers. Google Fonts load with system
fallbacks defined. GitHub Pages cannot execute PHP.
