# Viewebit Web: Multi-Page Marketing Site Redesign

## Context

The public marketing site (`Viewebit-web`'s `HomePage.tsx`) is currently one long scrolling
page with anchor-nav sections (`#features`, `#about`, `#demo`), rewritten most recently in the
2026-07-14 landing-page redesign (`2026-07-14-lms-landing-page-redesign-design.md`). That spec
explicitly kept the single-page structure and treated the "For Teachers/Admins/Institutions"
section as **aspirational marketing copy**, since none of that functionality existed yet — it
called out multi-page expansion (Pricing/Solutions/Resources) as a deliberately deferred future
initiative.

That future has since arrived: this project has since built a real Educator Panel (course/
lesson/assignment authoring, live sessions, quiz/PDF tools), real Admin Panel institution/branch/
department management, and a real student-facing feature set (courses, assignments, PDFs,
certificates, rankings). The "every role" story is no longer aspirational copy — it describes an
actual, working platform. The user's request — more features now exist, so give each area of the
site its own real page — is exactly the point where the deferred initiative becomes the right
call.

Separately, while auditing the current site to scope this work, two structural gaps were found
that this redesign fixes as part of the same effort (not scope creep — both directly affect the
work of adding more pages/nav items):
1. **No shared public layout.** `HomePage.tsx` has its header/footer embedded inline;
   `ContactPage.tsx` and the legal pages (`/privacy`, `/terms`, `/refund-policy`, `/help`,
   `/source`) have no header at all — navigating away from Home loses the nav entirely.
2. **No mobile navigation.** The current header nav is `hidden lg:flex` — on phones there is
   zero way to reach Features/About/Contact/etc., only the logo and auth buttons. Adding 3 more
   nav items without fixing this would make an existing gap worse.

## Decisions (from user Q&A)

- **7 public pages**: Home, Features, Product Tour, Solutions, Pricing, About, Contact.
- **Visual direction**: refresh within the current brand (violet/purple gradient palette, Inter
  typeface, existing `.gradient-text`/`.card-hover`/`.section-spacing`/`.page-container` utility
  classes) — no new color system, no new fonts. More layout variety per page, not a new identity.
- **Nav**: flat, all 7 items visible (no dropdown grouping).
- **Pricing**: no public numbers — "Contact us"/"Request a Quote" style, matching the platform's
  actual per-institution sales model.
- **Solutions**: one page, 4 sections (Coaching Institutes / Schools / Colleges / Corporate
  Training) — not 4 separate sub-pages.
- **Scope boundary**: marketing pages only. Login/Register/Forgot-Password/Verify-OTP are
  explicitly out of scope — left as-is.
- **Fix as part of this work**: shared public layout (header+footer) and a mobile nav — both
  pre-existing gaps this redesign directly touches.
- **No fabricated content**: no invented team bios/photos, no fake real-looking pricing numbers,
  no dead links (the current `/contact` page's `/#faqs` link is removed since no FAQ page exists).

## Architecture

- New `src/components/layout/PublicLayout.tsx` — extracted from `HomePage.tsx`'s current inline
  header/footer. Renders the 7-item nav + logo + Sign In/Get Started buttons in the header, and
  the existing 5-column footer (Platform/Solutions/Resources/Newsletter/Copyright), plus a new
  mobile hamburger menu (see below). Rendered via a layout `<Route>` wrapping every public page.
- Routes (all public, no auth), added to `src/App.tsx`:
  - `/` → `HomePage.tsx` (rewritten, trimmed)
  - `/features` → `FeaturesPage.tsx` (new)
  - `/tour` → `ProductTourPage.tsx` (new)
  - `/solutions` → `SolutionsPage.tsx` (new)
  - `/pricing` → `PricingPage.tsx` (new)
  - `/about` → `AboutPage.tsx` (new)
  - `/contact` → `ContactPage.tsx` (existing, content unchanged, re-wrapped in `PublicLayout`)
  - `/privacy`, `/terms`, `/refund-policy`, `/help`, `/source` — existing pages, re-wrapped in
    `PublicLayout` for nav consistency, content unchanged.
- File placement matches this codebase's existing flat convention (`src/pages/*.tsx`, no
  subfolder), same as `HomePage.tsx`/`ContactPage.tsx` today.

### Mobile navigation

`PublicLayout`'s header adds a hamburger icon (visible below the `lg` breakpoint, mirroring the
already-established `hidden lg:flex` / mobile-toggle pattern used in the authenticated app's
`ModernSidebar.tsx`) that opens a slide-down or off-canvas panel listing all 7 nav items plus
Sign In/Get Started — closing on item click or outside-tap. This is new functionality (the gap
described above), not a re-skin of something that already worked.

## Page-by-page content

1. **Home** (`HomePage.tsx`, rewritten) — hero (kept, refined copy), a 3-item teaser strip
   linking to `/features`, `/solutions`, `/pricing`, the stats bar, the trusted-by logo row, and
   a closing CTA linking to `/contact` and `/pricing`. Trimmed from today's version — the full
   feature grid and role cards move to their own pages so Home stops trying to be the whole site.

2. **Features** (`FeaturesPage.tsx`, new) — expands today's 6-item feature grid into
   categories reflecting what's actually built across the platform: Course Management
   (modules/lessons), Live & Recorded Learning, Assessments (quiz categories, test series,
   negative marking), Assignments & Grading, Study Materials (secure PDF library), Certificates
   (auto-issued on completion), Rankings/Leaderboards, Payments/Subscriptions, and multi-tenant
   Institution management. Grounded in real platform capability, not generic filler.

3. **Product Tour** (`ProductTourPage.tsx`, new) — three journeys (Student / Educator / Admin),
   each an alternating left/right timeline of steps, e.g. Student: enroll → attend live classes →
   take quizzes → submit assignments → track rank → earn certificate. Illustrative UI-mockup
   blocks in the existing gradient-card style (like the hero's Students/Teachers/Analytics/
   Courses grid) — no real screenshots.

4. **Solutions** (`SolutionsPage.tsx`, new) — one page, 4 full-width sections (Coaching
   Institutes / Schools / Colleges / Corporate Training), each with pain points addressed +
   relevant feature callouts + a "Book a Demo" CTA.

5. **Pricing** (`PricingPage.tsx`, new) — 3 illustrative tiers (Starter / Growth / Enterprise) as
   feature-comparison cards with no listed prices, each ending in "Request a Quote" (links to
   `/contact`), plus a short FAQ on how billing actually works (per-student, custom institutional
   deals) — no invented numbers presented as real pricing.

6. **About** (`AboutPage.tsx`, new) — mission/story copy, the 4 role cards (Students/Teachers/
   Admins/Institutions) moved from Home, and the stats bar consolidated here (removed from Home
   to avoid duplication). No fabricated team bios/photos.

7. **Contact** (`ContactPage.tsx`, existing) — content unchanged, just re-wrapped in
   `PublicLayout`; the dead `/#faqs` link is removed since no FAQ page exists.

## Visual approach

Refresh within the current brand — same `--primary-*` violet/purple gradient tokens, Inter
typeface, and existing utility classes (`.gradient-text`, `.card-hover`, `.section-spacing`,
`.page-container`, `.btn`/`.btn-primary`/`.btn-outline`). No `tailwind.config.js` changes, no new
fonts. Layout varies by page so the site doesn't read as the same repeated card grid everywhere:
- Features → grouped category grid
- Product Tour → alternating left/right timeline blocks per role
- Solutions → 4 stacked full-width sections
- Pricing → 3-column comparison cards
- About → mission statement + stats + role grid

## Responsiveness

The whole site must work cleanly at mobile widths, not just the new hamburger menu:
- Header collapses to logo + hamburger below `lg`, as described above.
- All grids (feature cards, role cards, pricing cards, stats) already use responsive Tailwind
  column classes in the existing codebase (`sm:grid-cols-2 lg:grid-cols-3` etc.) — new pages
  follow the same pattern, verified at mobile/tablet/desktop widths.
- Footer's 5-column grid collapses to a single column on small screens (already `md:grid-cols-5`
  in the existing footer — carried into `PublicLayout` unchanged).

## Out of scope

- Login/Register/Forgot-Password/Verify-OTP pages — untouched.
- Legal page **content** (Privacy/Terms/Refund/Help/Source) — untouched, only re-wrapped in the
  new shared layout for nav consistency.
- No backend changes — this is a pure `Viewebit-web` frontend redesign.
- No real trusted-by logos, no real pricing numbers, no fabricated team bios.

## Critical Files

- `Viewebit-web/src/components/layout/PublicLayout.tsx` (new)
- `Viewebit-web/src/pages/HomePage.tsx` (rewritten)
- `Viewebit-web/src/pages/FeaturesPage.tsx` (new)
- `Viewebit-web/src/pages/ProductTourPage.tsx` (new)
- `Viewebit-web/src/pages/SolutionsPage.tsx` (new)
- `Viewebit-web/src/pages/PricingPage.tsx` (new)
- `Viewebit-web/src/pages/AboutPage.tsx` (new)
- `Viewebit-web/src/pages/ContactPage.tsx` (re-wrapped, content unchanged)
- `Viewebit-web/src/App.tsx` (new routes)
- `Viewebit-web/src/index.css` / `tailwind.config.js` (referenced, not modified)

## Verification

- `npx tsc --noEmit` and `npm run build` both clean.
- Click through all 7 pages plus the 5 legal pages in a running dev server, confirming the same
  header/footer appears everywhere and every nav link/CTA resolves to a real page (no dead
  anchors).
- Resize to a mobile viewport (or use browser device emulation) and confirm the hamburger menu
  opens, lists all 7 items, and closes correctly on selection.
- Confirm the existing `/contact` form still submits successfully (no regression from
  re-wrapping it in the new layout).
