// The shared Vite/TanStack config package already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages serves this project from a subdirectory, so assets and the router
// need the matching base path. Local development uses the root path.
const GITHUB_PAGES_BASE = "/portfolioabdullah/";
const isGithubPagesBuild = process.env.GITHUB_PAGES === "true";
const base = isGithubPagesBuild ? GITHUB_PAGES_BASE : "/";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    // GitHub Pages only serves files, so pre-render the single portfolio route to
    // static HTML at build time. Local builds stay SSR-only.
    ...(isGithubPagesBuild
      ? {
          prerender: { enabled: true, crawlLinks: false },
          pages: [{ path: "/" }],
        }
      : {}),
  },
  vite: {
    base,
  },
});
