## Portfolio import
- Keep portfolio section markup and interaction state in its TanStack route, with preserved content exported from a browser-safe content module and visual tokens in global CSS, to separate factual content from presentation.
- Apply imported document attributes through route staticData and the existing root consumer, so the source's document-level styles remain intact.
- Use native CSS animations and IntersectionObserver for the portfolio motion system, so reduced-motion support and performance do not require overlapping animation libraries.
- Use Radix Dialog primitives for project presentations, so focus trapping, Escape dismissal and keyboard accessibility remain reliable.
