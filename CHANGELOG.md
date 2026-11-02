## 2026-11-03 — Apply extra-slow hero scrubbing on mobile

- **Request:** Keep laptop/desktop hero scrolling at its current speed, but slow the animation a little more on mobile.
- **Changed:** Split the scrub-distance multiplier by viewport width in `src/components/HeroSequence.tsx`: desktop remains at 1.25x (80% of baseline frame progression), while mobile uses 1.5x (about 66.7% of baseline progression).
- **Preserved:** Desktop behaviour, all 483 JPEG assets, frame loading/fallback behaviour, Home-to-Lab target, Contact video and reduced-motion handling.
- **Validation:** Source and documentation changes inspected. No local lint, test, production build or browser/device scroll test was run; GitHub Actions will validate the deployment build after the commit.
- **Commit:** pending.

## 2026-11-03 — Slow hero scroll progression to 80% of original speed

- **Request:** Reduce the hero animation's scroll-driven playback speed to 80% of its original speed on mobile and desktop.
- **Changed:** Increased the shared scrub-distance multiplier from 1.15x to 1.25x in `src/components/HeroSequence.tsx`. This spreads the same 483 frames across 25% more scroll distance, which makes frame progression run at 80% of the original baseline rate.
- **Preserved:** The 483 JPEG assets, frame loading and fallback behaviour, Home-to-Lab target, Contact video, and reduced-motion handling.
- **Validation:** Source and documentation changes inspected. No local lint, test, production build or browser/device scroll test was run; GitHub Actions will validate the deployment build after the commit.
- **Commit:** pending.

## 2026-11-02 — Reduce hero scroll sensitivity across devices

- **Request:** Slow down the Home hero frame progression on mobile and laptop/desktop scrolling.
- **Changed:** Added a shared 1.15x scrub-distance multiplier in `src/components/HeroSequence.tsx`. The same 483 frames now span 15% more scroll distance on every device, so each pixel of scrolling advances the animation less. The sequence finishes slightly farther into Lab.
- **Preserved:** The 483 JPEG assets, frame loading and fallback behaviour, responsive canvas, Home content, Contact video and reduced-motion handling.
- **Validation:** Source-level change inspected. No local lint, test, production build or browser/device scroll test was run; GitHub Actions will run the deployment build after the commit.
- **Commit:** pending.

## 2026-11-02 — Improve mobile and fast-scroll hero frame playback

- **Request:** Fix the 483-frame hero sequence appearing frozen during scrolling, especially on mobile, then updating only after scrolling stops.
- **Changed:** Updated `src/components/HeroSequence.tsx` to draw the nearest already-decoded frame while the exact requested frame loads, then replace it with the exact frame when decoding completes. Large scroll jumps now cancel obsolete in-flight image requests so stale downloads cannot occupy all mobile loading slots. Late decode callbacks from cancelled requests are ignored.
- **Preserved:** All 483 original JPEG assets, frame order, scroll-to-frame mapping, Home-to-Lab scrub range, canvas sizing, reduced-motion handling, and the Contact video.
- **Validation:** Source-level changes inspected. No local lint, test, production build, device test or browser scroll test was run in this environment; GitHub Actions will validate the deployment build after the commit.
- **Commit:** pending.

## 2026-11-02 — Add cinematic video background to Contact

- **Request:** Use the supplied `contact.mp4` as the Contact section background.
- **Changed:** Added a muted, looping, inline video layer to the Contact section, with a dark emerald overlay and responsive cover sizing. The video is served from `public/contact-background.mp4` using Vite's base URL.
- **Media preparation:** Re-encoded the supplied 1920×1080, 24 FPS, 120-second H.264 source to 1280×720 H.264 at 24 FPS, removed audio and enabled fast-start metadata. Final asset: 6,618,482 bytes (about 6.3 MiB).
- **Preserved:** The Home → Work → About → Lab JPEG scroll sequence and all existing Contact copy, links and navigation.
- **Validation:** Confirmed the video blob exists in the main branch at `public/contact-background.mp4`. GitHub Actions run [#48](https://github.com/GlitchedPhoenix38/portfolioabdullah/actions/runs/41498105497) completed successfully; both static build and Pages deployment jobs passed. No separate manual browser playback test was performed.
- **Commits:** Source integration `c2a345668256c2feaa6ba5ea43e313ba338eb28f`; media upload `edb47bbfda9dc9d348f583084d5253c4b5d6f5cc`.

## 2026-11-02 — Extend the JPEG hero sequence through Lab

- **Request:** Extend the Home image sequence beyond About so all 483 frames finish as the Lab section is reached.
- **Changed:** Updated the Home `HeroSequence` end target from `about` to `lab`. The existing dynamic measurement now maps the full scroll distance from Home through Work and About to the Lab boundary; the final frame is held as Lab enters the viewport.
- **Preserved:** All 483 JPEG assets, frame loading/rendering behaviour, section positions, portfolio content, and reduced-motion handling.
- **Validation:** Inspected the source and confirmed the Lab section uses `id="lab"`. No local build, browser scroll test or live deployment verification was run.
- **Commit:** pending.

## 2026-11-02 — Extend the JPEG hero sequence through Work to About

- **Request:** Start the 483-frame image animation at Home and finish it as the About section is reached.
- **Changed:** Added an optional `endAt` target to `HeroSequence`. The Home instance now measures the About section's position and dynamically extends its sticky scroll range to that boundary. A compensating negative margin preserves the original positions of the identity strip, Work and About sections. The Home introduction fades away as the user scrolls into the page, while later sections render above the sequence; the final frame is held through the opening viewport of About.
- **Accessibility:** The existing reduced-motion behaviour remains in place; the extended scroll range is disabled when reduced motion is preferred.
- **Preserved:** All 483 JPEG assets, exact-frame rendering/loading logic, portfolio content and section order.
- **Validation:** Source-level changes inspected. No local build, browser scroll test, lint or live deployment verification was run.
- **Commit:** pending.

## 2026-11-02 — Restore JPEG-based hero sequence

- **Request:** Return the portfolio to the last working-code version that used the 483 JPEG frames instead of the MP4 video.
- **Changed:** Restored `src/components/HeroSequence.tsx` and the hero-related CSS from commit `eefa302d896496df175d3332cf54c98429fe22dd`. Restored all 483 original files under `public/hero-frames/`. Updated the Home route to use `frame_000001.jpg` as its poster again. Removed `public/hero-sequence.mp4` and the temporary `public/hero-poster.jpg`.
- **Preserved:** Other current portfolio content and sections; only the hero implementation and its assets were rolled back to the JPEG-based version.
- **Validation:** Verified the source snapshot and all 483 frame blobs exist in Git history before restoring. No local build, browser test or live deployment check was run.
- **Reference commit:** `eefa302d896496df175d3332cf54c98429fe22dd`. **Restore commit:** pending.

# Changelog

## 2026-11-02 — Prevent dark flashes during hero frame loading

- **Request:** Investigate and fix intermittent dark flashes in the 483-frame Home hero sequence.
- **Changed:** In `src/components/HeroSequence.tsx`, changed the no-nearby-frame fallback to keep the last successfully rendered canvas frame visible while the requested frame loads. It no longer hides the canvas and exposes the almost-black first-frame poster during a fast scroll.
- **Asset analysis:** Inspected the supplied `mergered video_frames.zip`: all 483 files decode as 1280×720 JPEGs and the prior structural inspection found no missing/corrupt files. A luminance pass across all frames shows frame 1 is near-black (mean luma ≈ 0.0043), consistent with the sequence's gradual opening fade. The sequence is intentionally very dark overall (mean luma across frames ≈ 0.089); the contact sheet shows a gradual reveal and later visual transformation, not random corrupted dark frames. The 97 duplicate pairs documented earlier create brief holds, not dark flashes.
- **Preserved:** All 483 original image files, frame numbering, scroll mapping, poster, and animation timing.
- **Validation:** Inspected all 483 source images and the fallback logic. Re-fetched the updated component and documentation. No browser reproduction, lint, tests or production build was run, so the deployed visual result still needs a live check.
- **Commit:** `299d32ff0ad031d4affdb0afe60c77b301e56180`.

## 2026-11-02 — Remove unnecessary Lovable editor integration

- **Request:** Search the portfolio for Lovable branding/integrations and remove only unnecessary pieces without breaking useful project tooling.
- **Changed:** Removed the editor-only error telemetry import/call from `src/routes/__root.tsx` and deleted `src/lib/lovable-error-reporting.ts`. Removed the obsolete Lovable connection warning block from `AGENTS.md`, cleaned Lovable-specific wording from `vite.config.ts`, and removed unused package exceptions from `bunfig.toml`.
- **Preserved:** Kept `@lovable.dev/vite-tanstack-config` in `package.json` and both lockfiles because it is the active shared Vite/TanStack configuration package. The app's build setup depends on it; replacing it safely requires a separate migration and validation. No explicit visible “Made with Lovable” badge was found in source search.
- **Validation:** Re-fetched and inspected the affected files and confirmed the root error boundary no longer imports the deleted module. No lint, tests, production build or live-site visual check was run.
- **Commit(s):** Root cleanup `347b6fafc8050ad69a27c6069ef1fd5411e2633f`; telemetry file deletion `9549527edb775385273aa6db279ae183efd2ab16`; repository metadata cleanup `19e05eb99d89397c348f148af303205c331c11ad`; Vite comment cleanup `896cbb7d85f886f1617db18757c498d8f87ba12e`; Bun install exception cleanup `59f33b0e716c4c544cb87d1442aebd9b38a7e5a1`.

Meaningful portfolio changes are recorded here in reverse chronological order. This file is intended to give future maintainers and AI assistants a durable record of what changed, why it changed, what was preserved and what was actually tested.

For project structure, setup, architecture and handoff rules, see [README.md](./README.md).

## 2026-11-02 — Add project documentation and AI handoff guide

- **Request:** Create a README that explains the whole portfolio and a step-by-step history so another AI assistant can understand the project without previous chat context.
- **Changed:** Replaced the short README with a project guide covering sections, project content, design direction, technology, repository map, hero image sequence, local setup, scripts, GitHub Pages deployment, editing workflow, accessibility, Lovable-related tooling and AI handoff instructions.
- **Changed:** Added this changelog as the chronological record of meaningful changes.
- **Preserved:** Existing application code, dependencies, design and deployment workflow.
- **Validation:** Documentation was written against the repository files inspected during this task. No application build, lint or test command was run for this documentation-only update.
- **Commit:** See the GitHub commit history for the README and CHANGELOG commits.

## 2026-11-02 — Rename voice assistant project to Zayro

- **Request:** Replace the portfolio project name “Mustaqeem” with “Zayro”.
- **Changed:** In `src/lib/portfolio-content.ts`, changed the project display name to `Zayro` and its data ID to `zayro`.
- **Preserved:** Project description, technical details, tags, engineering notes and external repository URL.
- **Validation:** Re-fetched the main-branch content and verified that the active project entry uses the new name and ID and that the old active entry is absent. No production build was run as part of the rename.
- **Commit:** `a64a972f3d268ebb88c6f6d6a7c950f688cb008c`

## 2026-11-02 — Remove redundant emerald-engine source image

- **Request:** Remove the old static emerald-engine image that conflicted with the new animated hero sequence.
- **Changed:** Removed the import of `src/assets/emerald-engine.jpg` from `src/routes/index.tsx`; changed the HeroSequence poster/fallback reference to the first sequence frame at `hero-frames/frame_000001.jpg`; deleted `src/assets/emerald-engine.jpg`.
- **Preserved:** The 483-frame animation sequence and the rest of the portfolio hero content.
- **Clarification:** The reported `.output/public/assets/emerald-engine-CYke-5Wb.jpg` was not found in the GitHub repository. The `.output` directory is ignored build output, so it is regenerated by the next build rather than maintained as a source asset.
- **Validation:** Verified on GitHub that the old source image is absent, the old import is gone, the route points to the first animation frame, and `public/hero-frames/frame_000001.jpg` exists. A fresh production build and Pages deployment were not run/verified in that task.
- **Commit(s):** Route update `8957519911c49eaf15143806e985a9050df81c51`; source image deletion `c3569caa72d79da7df35ba17c4ea807e1a8dbc94`.

## Ongoing maintenance rule

For every meaningful future change:

1. Add a dated entry at the top of this file.
2. State the user request and exact files/behaviour changed.
3. Record what was deliberately preserved.
4. List only tests/builds that were actually run, including failures or skipped checks.
5. Include the commit SHA when the change is committed.
6. Update README sections if the change affects architecture, setup, assets, dependencies, content structure or deployment.

Do not invent historical steps or claim successful validation without evidence. If an older decision is unknown, mark it as unknown rather than guessing.
