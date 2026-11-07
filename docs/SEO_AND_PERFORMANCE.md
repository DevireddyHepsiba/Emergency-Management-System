# SEO and performance setup

## Public SEO routes

- `/` is the public, indexable product overview.
- `/llms.txt` provides a short, factual guide for language models and search agents.
- `/llms-full.txt` provides the detailed workflow, role, location, and limitation notes.
- `/robots.txt` permits the public overview and disallows operational workspace routes from crawling. This is a crawler hint, not an access-control measure.
- `/sitemap.xml` is generated with the public root only. Authenticated routes and account screens are not included.

Set `VITE_SITE_URL` in `frontend/.env.local` to the deployed HTTPS origin before a production build, for example `https://your-real-domain.example`. The configured origin is used for the canonical URL, Open Graph URL, and sitemap location. Do not deploy with an example domain. Without a configured origin, the development and build sitemap is an empty but valid URL set, and robots.txt omits the sitemap declaration.

## Motion and loading

The current UI intentionally uses native browser scrolling and small CSS transitions. GSAP, ScrollTrigger, and Lenis are not dependencies and no instances or timelines are created, so there are no animation instances to leak or synchronize. React Strict Mode is enabled. A reduced-motion media query removes transitions and animation; no loading splash is used. Fonts use system stacks and the landing illustration is inline CSS/SVG, so the initial view has no remote font or hero-image dependency.

## Deployment checks

- Run `npm run build` and `npm run lint` from `frontend/`.
- Set `VITE_SITE_URL` before building and inspect `dist/index.html`, `dist/robots.txt`, `dist/sitemap.xml`, `dist/llms.txt`, and `dist/llms-full.txt`.
- Measure Core Web Vitals on the deployed origin with Lighthouse or PageSpeed Insights. This repository does not include Lighthouse or a production origin, so deployment-level measurements cannot be recorded from a local build.
