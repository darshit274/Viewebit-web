# Viewebit LMS Landing Page Redesign

## Context

The public site is currently branded "Viewebit Academy" — a single-role mock-test/exam-prep platform for Gujarat competitive exams (GPSC, GSSSB, GPSSB, Police Constable, PSI, Talati, Junior Clerk), used only by students. The business is repositioning to "Viewebit LMS", a multi-role Learning Management System serving institutions, teachers, admins, and students, per a supplied mockup image.

This spec covers **only the public marketing landing page** (`Viewebit-web`'s `HomePage.tsx`) reflecting the new positioning with fresh content. Real teacher/institution accounts, live classes, and admin analytics dashboards are **not** being built now — the new "For Teachers/Admins/Institutions" section is aspirational/descriptive marketing copy describing where the product is headed, not a description of features that exist today. That is a separate, future initiative.

## Goals

- Replace the current exam-prep-focused landing page content with LMS-positioned content matching the supplied mockup's section rhythm.
- Rebrand from "Viewebit Academy" to "Viewebit LMS" across the header, footer, and page metadata.
- Keep the existing single-page (anchor-nav) structure — no new routes for Pricing/Solutions/Resources.
- Reuse the existing Tailwind utility classes and violet/indigo brand palette already established in `index.css` / `tailwind.config.js` — no new color system.
- Extend the existing contact-query flow into a proper "Book a Free Demo" form (adds `role` and `institution_name` fields) rather than building a parallel demo-request system.

## Non-goals

- No new backend roles (teacher/institution), no live-classes feature, no real admin analytics dashboard.
- No new routes/pages for Pricing, Solutions, or Resources — these remain anchor links or are dropped from the nav.
- No real trusted-by logos or verified stats — numbers/logos are placeholder marketing content, easy to tune later.
- No detailed coded dashboard-preview UI in the hero — replaced with a simpler illustration/graphic.
- No newsletter-signup backend — the footer's newsletter field is visual only unless/until a real subscribe endpoint is requested.

## Page structure (replaces current `HomePage.tsx` content)

1. **Header** — logo text "Viewebit LMS"; nav: Home / Features / About Us / Contact (anchor links); Login + Get Started buttons (existing auth routes).
2. **Hero** — headline "The Complete Learning Management System for Modern Education", supporting paragraph, two CTAs (Book a Demo → anchors to the demo form section; Explore Features → anchors to features section), trust badges (All-in-One Platform, Secure & Scalable, Easy to Use), and a simple illustration/graphic (not a detailed coded dashboard mockup) alongside the headline.
3. **Feature icons row** — 6 items using Heroicons, each with a short one-line description: Smart Learning, Live Classes, Online Exams, Detailed Reports, Mobile App, Secure & Reliable.
4. **"A Powerful Platform for Every Role"** — 4 cards (Students / Teachers / Admins / Institutions), each with a short aspirational description and a text link (styled like existing CTAs; links can point at `#contact` or be non-functional placeholders since dedicated portals don't exist).
5. **Stats bar** — 500+ Institutions, 1M+ Students, 10K+ Courses, 99.9% Uptime, 24/7 Support — placeholder marketing numbers.
6. **Trusted-by logos row** — "Trusted by Educational Institutions Across India" heading with generic placeholder logo cards (icon + "Institute Logo" label), matching the mockup's placeholder treatment.
7. **Book a Free Demo** — extended form (Full Name, Email, Phone Number, Your Role dropdown, Institution Name) submitting to the extended `contact_queries` backend flow (see below).
8. **Footer** — 4 link columns (Platform / Solutions / Resources / Company) plus a Newsletter signup field (visual only), reusing/re-linking existing legal routes (`/privacy`, `/terms`, `/refund-policy`, `/contact`, `/help`).

Dropped from the current page: the FAQ accordion section and the dark "Download App" band (Mobile App becomes one of the 6 feature icons instead).

## Technical implementation

### Frontend (`Viewebit-web`)

- Rewrite `src/pages/HomePage.tsx` in place with the sections above, reusing existing utility classes (`.btn`, `.btn-primary`, `.btn-outline`, `.card`, `.card-hover`, `.gradient-text`, `.page-container`, `.section-spacing`) and the current violet/indigo Tailwind theme — no `tailwind.config.js` changes.
- Update brand references: header/footer logo text and `index.html` `<title>`/meta description, from "Viewebit Academy" to "Viewebit LMS".
- Extend `src/components/ContactQueryForm.tsx` (or split into a sibling component if the demo-specific fields diverge too much from the existing compact/full contact variants) to add:
  - `role` — dropdown (Institution / Teacher / Admin / Student / Other)
  - `institution_name` — text input
  These two new fields are used only in the new "Book a Demo" section; the existing `/contact` page and its compact/full variants keep working unchanged.

### Backend (`Viewebit-backend`)

- New Sequelize migration adding nullable `role` (string) and `institution_name` (string) columns to `contact_queries`.
- Update `models/ContactQuery.js` to include the two new fields.
- Update `controllers/contactQueryController.js` and the `express-validator` rules in `routes/contactQueryRoutes.js` so `POST /contact/submit` accepts the two new optional fields. No new endpoint.

## Verification

- Run the new migration against the local MySQL database (already running); confirm `contact_queries` has the two new columns via `DESCRIBE`.
- With `Viewebit-web`'s dev server running, visually walk through every section of the redesigned homepage in a browser.
- Submit the new "Book a Demo" form end-to-end once and confirm a row lands in `contact_queries` with `role` and `institution_name` populated.
- Load the existing `/contact` page and confirm the shared form component still works there unchanged (no role/institution fields shown, since those are demo-form-only).
