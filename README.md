# Abdullah Ansari — Developer Portfolio

Personal portfolio for **Abdullah Ansari**, a B.Tech Computer Science Engineering student specialising in Cyber Security. The site presents selected projects, background, technology stack, experiments and contact links.

- **Live website:** https://glitchedphoenix38.github.io/portfolioabdullah/
- **GitHub profile:** https://github.com/GlitchedPhoenix38
- **Repository:** https://github.com/GlitchedPhoenix38/portfolioabdullah
- **Default branch:** `main`

> This README is the project handoff document. Keep it current whenever the portfolio's architecture, content, design, assets, deployment or behaviour changes. Record each meaningful change in [CHANGELOG.md](./CHANGELOG.md), so another developer or AI assistant can understand the project without relying on chat history.

## 1. What the website contains

The portfolio is a single-page experience made of anchored sections:

| Navigation label | Section ID | Purpose |
|---|---|---|
| Home | `#top` | Hero introduction and cinematic scroll-controlled image sequence |
| Work | `#work` | Selected projects with repository links and engineering-notes dialogs |
| About | `#about` | Background, education and engineering principles |
| Stack | `#stack` | Filterable technology/tool inventory |
| Lab | `#lab` | Smaller projects and experiments |
| Contact | `#contact` | Contact and social links |

The navigation labels refer to **sections**, not separate pages.

### Selected projects

Project data is maintained in `src/lib/portfolio-content.ts`.

- **Zayro** — terminal voice assistant for Arch Linux. Local wake-word detection, speech-to-text and spoken replies; configurable OpenAI-compatible reasoning provider with an offline rule-based fallback.
- **FoziScribe** — offline audio/video transcription application built around faster-whisper.
- **Text-to-Audio Studio** — local narration and text-to-speech studio.
- **LocalMind** — hybrid offline/online AI image-editing workflow.
- **peronal_ai** — multi-provider personal AI workspace (project name is intentionally written this way in the current content).
- **dual-space** — Android app-virtualisation project.

The same data file also contains the About copy, engineering principles, stack groups and Lab entries. Update that file when changing project descriptions, tags, status, notes, URLs or other portfolio facts.

## 2. Visual identity and design direction

The intended visual language is **Obsidian Emerald**:

- Deep obsidian background: `#080D0F`
- Graphite green surfaces: `#101B1B`
- Forest emerald: `#123C35`
- Teal accent: `#18A999`
- Ice mint highlight: `#A4F4D5`
- Warm-white text: `#F2F5F3`
- Muted text: `#A4B2AE`

Use these as design-direction reference values; the actual CSS custom properties in `src/styles.css` are the implementation source of truth. Keep contrast, legibility, responsive layouts and reduced-motion support in mind. Avoid random decorative effects, excessive neon, or effects that compete with the content.

### Motion principles

- Home uses the existing scroll-controlled 483-frame JPEG hero sequence. The sequence scrubs from Home through Work and About, reaching its final frame as Lab enters the top of the viewport; the sticky image remains behind the opening viewport of Lab.
- Other section animations are a future design task unless and until implemented and recorded here.
- Motion should be purposeful and related to each section's subject.
- Respect `prefers-reduced-motion`.
- Avoid unnecessary animation libraries or heavy GPU effects.

## 3. Technology

Current project stack (from `package.json`):

- React 19
- TypeScript
- Vite 8
- TanStack Start / TanStack Router
- Tailwind CSS 4
- Radix UI primitives (including Dialog)
- Lucide React icons
- Vitest and Testing Library
- ESLint and Prettier

The site is primarily a frontend/static portfolio. Do not assume that a backend or database exists unless one is added and documented.

## 4. Repository map

Important paths:

| Path | Responsibility |
|---|---|
| `src/routes/index.tsx` | Main portfolio route, section markup, navigation, interactions and project dialogs |
| `src/routes/__root.tsx` | Root HTML document, metadata, stylesheet registration, TanStack shell and error boundary |
| `src/lib/portfolio-content.ts` | Editable portfolio content: projects, About, principles, stack and Lab |
| `src/components/HeroSequence.tsx` | Reusable canvas-based scroll-sequence hero component |
| `src/components/` | Shared UI and application components |
| `src/styles.css` | Active global stylesheet imported by the root route |
| `src/styles/site.css` | Legacy/unused stylesheet at the time of this documentation; verify imports before changing |
| `src/lib/` | Browser-safe shared utilities and portfolio content modules |
| `public/hero-frames/` | Hero image-sequence frames served as static assets |
| `public/contact-background.mp4` | Optimized muted looping background video used behind the Contact section |
| `public/emerald-engine.jpg` | Check current tree before assuming this exists; the former source asset under `src/assets` was removed |
| `public/` | Static public assets such as favicon, social preview and robots/sitemap files |
| `.github/workflows/deploy-pages.yml` | GitHub Pages build and deployment workflow |
| `vite.config.ts` | Vite/TanStack configuration and GitHub Pages base-path behaviour |
| `package.json` | Dependencies and scripts |
| `CHANGELOG.md` | Chronological record of meaningful changes |

The active page imports `HeroSequence` from `@/components/HeroSequence`. Do not replace or recreate it casually; inspect its implementation and existing tests before changing the hero.

## 5. Hero image sequence

The Home hero uses an image sequence from the separate animation project.

Known sequence details:

- 483 JPEG frames.
- Original frame dimensions: 1280 × 720 (16:9).
- Sequential filenames: `frame_000001.jpg` through `frame_000483.jpg`.
- Public asset directory: `public/hero-frames/`.
- The hero poster/fallback currently points to the first frame using Vite's base URL:
  `\`\`\`tsx
  poster={`${import.meta.env.BASE_URL}hero-frames/frame_000001.jpg`}
  \`\`\`
- The image sequence is intended to be the actual hero background, with existing hero content rendered above it.
- While the exact requested frame is loading, the canvas draws the nearest decoded frame (within a small frame window) so touch-scroll does not freeze on one image. The exact frame replaces the temporary fallback as soon as it decodes. Obsolete in-flight requests are cancelled after large scroll jumps so they cannot block current frames, especially on mobile. The canvas must not be hidden to reveal the first-frame poster, because frame 1 is almost black and would look like a dark flash.

Asset URLs must use `import.meta.env.BASE_URL` (or an equivalent base-aware helper), not hard-coded root paths. This matters because the production site is deployed under `/portfolioabdullah/`, while local development uses `/`.

When changing the sequence:
1. Preserve sequential frame names and verify all expected frames exist.
2. Check the poster and canvas stacking order.
3. Test loading, resizing, fast scrolling and reduced-motion behaviour.
4. Confirm the final frame and sticky/pin release remain synchronised.
5. Verify the frames are present in the production output.

## 6. Local development

Requirements: Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (the project has previously used `http://localhost:8080/`; trust the terminal output if the port changes).

Available scripts:

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run build:dev    # Development-mode build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run test         # Run Vitest once
npm run test:watch   # Vitest watch mode
npm run format       # Prettier write across the project
```

## 7. GitHub Pages deployment

The public site is deployed from the `main` branch using GitHub Actions.

Production build:

```bash
GITHUB_PAGES=true npm run build
```

Build output: `.output/public`.

Deployment notes:

- Keep GitHub Pages **Source** set to **GitHub Actions**.
- The production base path is `/portfolioabdullah/`.
- Local development and preview environments use the root base path.
- The deployment workflow publishes `.output/public` and includes a `404.html` fallback for client-side routing.
- Do not commit generated `.output` files unless the deployment architecture is intentionally changed.
- After pushing to `main`, check the Actions workflow and then verify the live site. A commit being pushed does not mean Pages has finished deploying.

## 8. Content editing guide

For normal content changes, start here:

1. Open `src/lib/portfolio-content.ts`.
2. Edit the relevant project, About paragraph, principle, stack group or Lab item.
3. Preserve the existing object shape and TypeScript compatibility.
4. Run `npm run lint` and `npm run test`.
5. Run `GITHUB_PAGES=true npm run build`.
6. Update [CHANGELOG.md](./CHANGELOG.md) with the date, files changed, user-visible result and validation performed.

For layout or interaction changes, inspect `src/routes/index.tsx` and the active styles in `src/styles.css`. Keep content separate from presentation wherever practical.

## 9. Accessibility, performance and safety

- Preserve semantic section headings, navigation labels and accessible names.
- Keep keyboard navigation and dialog focus behaviour intact.
- External links should retain safe new-tab attributes (`target="_blank"` with `rel="noreferrer"`).
- Respect reduced-motion preferences.
- Avoid scroll handlers that cause unnecessary React renders.
- Clean up event listeners, observers, animation frames and image references.
- Do not add analytics, trackers, external APIs or backend services without explicit project requirements.
- Do not remove build dependencies merely because their package names mention a tool. First determine whether the configuration depends on them.
- Do not remove error handling or accessibility primitives as part of visual cleanup.

## 10. Build configuration and third-party tooling

The project currently uses `@lovable.dev/vite-tanstack-config` as its shared Vite/TanStack build configuration. It supplies required framework plugins, aliases, environment handling and build behaviour. It is retained because replacing it is a separate build-system migration and removing it without a tested replacement could break development or production builds.

The editor-only Lovable error telemetry and connection-specific repository metadata were removed on 2026-11-02. A source search did not find an explicit visible “Made with Lovable” badge or badge component. If a badge still appears in a deployed preview, inspect the rendered page and hosting/editor injection rather than deleting unrelated application dependencies.

## 11. Handoff instructions for another AI or developer

Before editing:

1. Read this README and the full [CHANGELOG.md](./CHANGELOG.md).
2. Inspect the current `main` branch; the changelog is a history, not a guarantee that every old detail is still current.
3. Inspect the relevant source files and current Git status.
4. Identify the exact files to change and explain the plan before destructive or broad edits.
5. Preserve existing design, content, interactions and deployment behaviour unless the task explicitly changes them.

After editing:

1. Run the relevant tests, lint and production build.
2. Report what changed and what was actually verified. Never claim a test passed unless it was run.
3. Update this README if architecture, commands, assets, dependencies, sections or deployment instructions changed.
4. Append a dated entry to `CHANGELOG.md` for every meaningful user-requested change.
5. Include commit SHA(s), changed paths and validation status when available.
6. Do not rewrite published Git history or force-push.

### Required changelog entry format

```md
## YYYY-MM-DD — Short change title

- **Request:** What was asked for.
- **Changed:** Files and behaviour changed.
- **Preserved:** Important functionality intentionally left untouched.
- **Validation:** Commands/tests/builds actually run and their results.
- **Commit:** Git commit SHA or “not committed”.
```

This makes the repository self-documenting and gives future AI assistants a reliable handoff instead of requiring access to previous conversations.
