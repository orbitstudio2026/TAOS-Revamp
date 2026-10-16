# The Alchemy of Sovereignty — revamp

Vite + React 19 + TypeScript + Tailwind v4. Motion (Framer Motion) for micro-interactions and parallax, GSAP ScrollTrigger + SplitText for pinned and scrubbed scenes, and Lenis for smooth scroll.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static output in dist/
```

- **Copy** lives verbatim in `src/content/*.ts` (copied from the live site). Edit text there only.
- **Brand tokens** live in the `@theme` block in `src/index.css`. Components use Tailwind utilities only.
- **21st.dev components** (adapted to the brand):
  - Radial Orbital Timeline → `sections/ModalityOrbit.tsx`
  - Stacking Cards → `sections/OfferingsStack.tsx`
  - Magnetic → `motion/Magnetic.tsx`
- **Newsletter:** set `VITE_NEWSLETTER_ENDPOINT` to POST sign-ups to your list provider. Without it, sign-ups are only stored in the visitor's browser, which matches the current live site.
- **Booking:** Calendly `v2516065/30min` (inline, brand colours). The 1:1 offering links to the existing Stripe checkout.
- **SPA hosting:** rewrite all routes to `index.html` (Netlify/Vercel do this with a one-line rule).
- **Reduced motion:** honoured everywhere (Lenis, GSAP matchMedia, Motion `reducedMotion="user"`).
