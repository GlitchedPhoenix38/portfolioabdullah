## 2026-11-02 — Remove redundant JPEG sequence from deployed assets

- **Request:** Eliminate the duplicate hero asset setup while keeping the user's verified 4 MB MP4.
- **Changed:** Kept `public/hero-sequence.mp4` unchanged. Moved the first JPEG frame to `public/hero-poster.jpg`, updated `src/routes/index.tsx` to use that poster, and removed the 482 remaining JPEG frames plus the old `public/hero-frames/` directory from the branch.
- **Preserved:** The MP4 blob and its exact contents, scroll-scrubbing implementation, hero overlay/content, and a static poster fallback. This is an asset cleanup, not a video re-encode.
- **Validation:** Confirmed the MP4 remains the same existing repository asset; verified the poster source exists and the route reference is updated. No lint, tests, production build, browser test or Pages deployment check was run.
- **Commit:** Pending.

# Changelog

## 2026-11-02 — Prepare video-based scroll-scrubbed hero

- **Request:** Replace the unreliable 483-individual-JPEG runtime loader with a video-based hero sequence.
- **Changed:** Reworked `src/components/HeroSequence.tsx` to map scroll progress to a timestamp in one H.264 video and draw decoded video frames to the canvas. Added a hidden decoder element in `src/styles.css`. The video is encoded all-intra (every frame is a keyframe) to support frequent seeking. Prepared `hero-sequence.mp4` from all 483 original JPEGs: 1280×720, 30 fps, 16.1 seconds, H.264, approximately 13 MB.
- **Preserved:** The original 483 JPEG source frames, frame count, scroll range, hero poster and overlaid hero content.
- **Important deployment dependency:** The MP4 is available as a generated file in the current conversation, but has not yet been committed to `public/hero-sequence.mp4`. The connected GitHub file-write action accepts UTF-8 text files, not binary video uploads. The code expects that exact public path; the video asset must be uploaded there before the new hero can work on the live site.
- **Validation:** Verified the generated MP4 with ffprobe (H.264, 1280×720, 30 fps, 483 frames, 16.1 seconds). Source edits were committed. No local lint, tests, production build, browser test or live deployment check has been run.
- **Commit(s):** Video renderer `ebff74e15bd8be3b9ca37e2bc2041ced8a367fd8`; decoder CSS `55df2624e944aaa9169ef7d65c0a859c29309216`; final-frame timestamp `b927b5069d467ad32a100b8a151ac930239bf84c`.

## 2026-11-02 — Stop hero sequence from jumping between cached frames

- **Request:** Investigate intermittent frame skipping where the hero appears to jump from the requested frame to much later frames (for example, around 110 to 135 to 180).
- **Cause found:** The renderer selected and drew the nearest already-cached frame whenever the exact requested frame had not finished loading. During scrolling, that could display a much later or earlier frame instead of preserving the current visual position.
- **Changed:** In `src/components/HeroSequence.tsx`, removed nearest-cached-frame substitution. The canvas now holds the last successfully drawn frame until the exact requested frame is decoded, then draws that exact frame. Removed the now-unused nearest-frame search logic.
- **Preserved:** All 483 JPEG assets, their numbering and image content, scroll-to-frame mapping, and sequence duration.
- **Validation:** Re-fetched the updated source after committing. No local lint, tests, production build, browser test or live deployment check has been run yet.
- **Commit(s):** Renderer change `84ec1691f2ba94ee86a3003296622bee140926b0`; obsolete fallback removal `eefa302d896496df175d3332cf54c98429fe22dd`.

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
