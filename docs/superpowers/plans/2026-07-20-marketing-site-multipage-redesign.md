# Marketing Site Multi-Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the public marketing site from one long scrolling page into 7 real pages (Home, Features, Product Tour, Solutions, Pricing, About, Contact) sharing a common header/footer layout with working mobile navigation, while staying within the existing visual brand.

**Architecture:** Extract a new `PublicLayout` component (header nav + mobile hamburger menu + footer) from `HomePage.tsx`'s current inline markup, rendered via a layout `<Route>` wrapping every public page (mirroring the existing `MainLayout`/`Outlet` pattern already used for the authenticated app). Build 5 new page files plus a trimmed `HomePage.tsx`, re-wrap the existing `ContactPage.tsx` and 5 legal pages in the new layout, and wire all routes into `App.tsx`.

**Tech Stack:** React 19 + TypeScript, React Router v7, Tailwind CSS (existing utility classes only), `@heroicons/react/24/outline`.

## Global Constraints

- No `tailwind.config.js` changes — reuse existing `--primary-*`/`secondary` color tokens and utility classes (`.gradient-text`, `.card-hover`, `.section-spacing`, `.page-container`, `.btn`/`.btn-primary`/`.btn-outline`) defined in `src/index.css`.
- No new npm dependencies.
- No backend changes.
- Login/Register/Forgot-Password/Verify-OTP pages are out of scope — do not touch `src/pages/auth/*` or `AuthLayout.tsx`.
- Legal page **content** (Privacy/Terms/Refund/Help/Source) is out of scope — only wrap them in the new layout, do not edit their body content.
- No fabricated content: no invented team bios/photos, no pricing numbers presented as real, no dead links.
- This repo has no automated test framework (confirmed in prior work on this codebase) — verification is `npx tsc --noEmit` (must be clean) + `npm run build` (must succeed) + manual browser click-through, not a test suite.
- Every new page must be responsive at mobile/tablet/desktop widths using the same responsive Tailwind grid patterns already used elsewhere in this codebase (e.g. `sm:grid-cols-2 lg:grid-cols-3`).

---

### Task 1: Extract `PublicLayout` with working mobile navigation

**Files:**
- Create: `Viewebit-web/src/components/layout/PublicLayout.tsx`

**Interfaces:**
- Produces: a default-exported `PublicLayout` component with no props, rendering `<Outlet />` for page content between a shared header and footer. Every subsequent task's routes are wrapped by this component via a layout `<Route element={<PublicLayout />}>` in `App.tsx` (Task 8).
- Consumes: `ViewebitLogoPng` from `../../assets/Viewebit.png`, icons from `@heroicons/react/24/outline` (`Bars3Icon`, `XMarkIcon`, plus the existing set already used in `HomePage.tsx`'s header/footer: `ArrowRightIcon`, `EnvelopeIcon`, `PaperAirplaneIcon`).

- [ ] **Step 1: Write the component**

This is extracted from `HomePage.tsx`'s current header (lines 102-161) and footer (lines 367-468), generalized to accept the current route path so nav items can highlight when active, and with a mobile menu added.

```tsx
// Viewebit-web/src/components/layout/PublicLayout.tsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  ArrowRightIcon,
  Bars3Icon,
  EnvelopeIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ViewebitLogoPng from '../../assets/Viewebit.png';

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Features', to: '/features' },
  { label: 'Product Tour', to: '/tour' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const PublicLayout: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const isActive = (to: string) => location.pathname === to;

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-primary-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-cyan-50 via-primary-50 to-secondary-50 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-primary-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link to="/" className="flex items-center relative group" onClick={() => setMobileMenuOpen(false)}>
              <img
                src={ViewebitLogoPng}
                alt="Viewebit LMS"
                className="relative h-16 sm:h-20 lg:h-24 w-auto drop-shadow-lg transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center space-x-1 bg-white/60 backdrop-blur-md rounded-full px-2 py-2 shadow-lg shadow-primary-500/10 border border-white/50">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2.5 text-sm font-semibold rounded-full transition-all duration-200 ${
                    isActive(item.to)
                      ? 'text-primary-700 bg-white shadow-sm'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 bg-white/60 hover:bg-white backdrop-blur-md rounded-full transition-all duration-200 shadow-md hover:shadow-lg border border-white/50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-bold text-white bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600 bg-size-200 bg-pos-0 hover:bg-pos-100 rounded-full shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 transition-all duration-300 hover:scale-105 border border-primary-400/50"
              >
                <span>Get Started</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-white/60 transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-white/30 bg-white/95 backdrop-blur-xl shadow-lg">
            <nav className="px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive(item.to)
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-200 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-3 rounded-lg text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-3 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-primary-600 to-secondary-500 shadow-md"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="page-container">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center mb-4">
                <Link to="/" className="flex items-center relative group">
                  <img
                    src={ViewebitLogoPng}
                    alt="Viewebit LMS"
                    className="relative h-20 sm:h-24 w-auto drop-shadow-lg transition-transform group-hover:scale-105"
                  />
                </Link>
              </div>
              <div className="text-lg font-bold text-white mb-2">Viewebit LMS</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                The complete learning management solution for modern educational institutions.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link to="/tour" className="hover:text-white transition-colors">Product Tour</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/solutions" className="hover:text-white transition-colors">Coaching Institutes</Link></li>
                <li><Link to="/solutions" className="hover:text-white transition-colors">Schools</Link></li>
                <li><Link to="/solutions" className="hover:text-white transition-colors">Colleges</Link></li>
                <li><Link to="/solutions" className="hover:text-white transition-colors">Corporate Training</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/source" className="hover:text-white transition-colors">Sources &amp; Disclaimer</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-4">Subscribe to get updates and educational insights.</p>
              {newsletterSubmitted ? (
                <p className="text-primary-400 text-sm font-semibold">Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="min-w-0 flex-1 px-3 py-2 text-sm rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="flex-shrink-0 p-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white transition-colors"
                  >
                    <PaperAirplaneIcon className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2026 Viewebit LMS. All rights reserved.</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <span className="text-gray-600">•</span>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <span className="text-gray-600">•</span>
              <Link to="/refund-policy" className="hover:text-white transition-colors">Refunds</Link>
              <span className="text-gray-600">•</span>
              <div className="flex items-center">
                <EnvelopeIcon className="w-3.5 h-3.5 mr-1" />
                viewebit@gmail.com
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
```

- [ ] **Step 2: Verify it typechecks in isolation**

Run: `cd "Viewebit-web" && npx tsc --noEmit 2>&1 | grep PublicLayout`
Expected: no output (it has no consumers yet, so this only checks the file's own syntax/types — `Outlet` renders `null` outside a `<Routes>` tree, which is fine for a standalone typecheck).

- [ ] **Step 3: Commit**

```bash
cd "Viewebit-web" && git add src/components/layout/PublicLayout.tsx && git commit -m "Add shared PublicLayout with header, footer, and mobile nav for the marketing site"
```

---

### Task 2: Rewrite `HomePage.tsx` (trimmed, header/footer removed)

**Files:**
- Modify: `Viewebit-web/src/pages/HomePage.tsx` (full rewrite)

**Interfaces:**
- Consumes: nothing new — `Link` from `react-router-dom`, icons already imported today, `ContactQueryForm` is **removed** from this page (the demo form now lives only on `/contact` and is linked to, not embedded, since Home is being trimmed — see content notes below).
- Produces: default export `HomePage`, rendered inside `PublicLayout`'s `<Outlet />` by the route added in Task 8. No header/footer markup — those now come from `PublicLayout`.

- [ ] **Step 1: Rewrite the file**

Keep the hero section (lines 163-247 of the current file) essentially as-is content-wise, but remove the header (now in `PublicLayout`) and footer (now in `PublicLayout`), replace the full feature grid / role cards / demo form sections with a trimmed teaser + stats + trusted-by + closing CTA, and update in-page anchor links (`#features`, `#demo`) to real routes.

```tsx
// Viewebit-web/src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  BookOpenIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  VideoCameraIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const TEASERS = [
  {
    icon: SparklesIcon,
    title: 'Everything You Need',
    description: 'Courses, live classes, assessments, assignments, and certificates — one platform.',
    to: '/features',
    linkLabel: 'Explore Features',
  },
  {
    icon: BuildingLibraryIcon,
    title: 'Built for Every Institution',
    description: 'Coaching institutes, schools, colleges, and corporate training teams.',
    to: '/solutions',
    linkLabel: 'See Solutions',
  },
  {
    icon: ChartBarIcon,
    title: 'Simple, Transparent Plans',
    description: "Pricing that scales with your institution — no hidden fees.",
    to: '/pricing',
    linkLabel: 'View Pricing',
  },
];

const STATS = [
  { icon: BuildingLibraryIcon, value: '500+', label: 'Institutions' },
  { icon: UserGroupIcon, value: '1M+', label: 'Students' },
  { icon: BookOpenIcon, value: '10K+', label: 'Courses' },
  { icon: ShieldCheckIcon, value: '99.9%', label: 'Uptime' },
  { icon: ClockIcon, value: '24/7', label: 'Support' },
];

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="page-container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 text-primary-900 text-sm font-semibold mb-8 animate-fade-in shadow-md">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Empowering Education
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 animate-slide-up leading-tight">
                The Complete{' '}
                <span className="gradient-text">Learning Management System</span>{' '}
                for Modern Education
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 animate-slide-up leading-relaxed">
                Viewebit LMS helps educational institutions deliver engaging learning experiences,
                streamline operations, and drive better results.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 animate-scale-in">
                <Link to="/contact" className="btn btn-primary btn-lg group">
                  Book a Demo
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/features" className="btn btn-outline btn-lg group border-2">
                  Explore Features
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-sm md:text-base text-gray-700 animate-fade-in">
                <span className="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  All-in-One Platform
                </span>
                <span className="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Secure &amp; Scalable
                </span>
                <span className="flex items-center bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm">
                  <CheckCircleIcon className="w-4 h-4 text-green-500 mr-2" />
                  Easy to Use
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-white/50">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <AcademicCapIcon className="w-10 h-10 mb-2" />
                    <span className="text-sm font-semibold">Students</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <UserGroupIcon className="w-10 h-10 mb-2" />
                    <span className="text-sm font-semibold">Teachers</span>
                  </div>
                  <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <ChartBarIcon className="w-10 h-10 mb-2" />
                    <span className="text-sm font-semibold">Analytics</span>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
                    <VideoCameraIcon className="w-10 h-10 mb-2" />
                    <span className="text-sm font-semibold">Live Classes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaser Strip */}
      <section className="section-spacing bg-white">
        <div className="page-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TEASERS.map(({ icon: Icon, title, description, to, linkLabel }) => (
              <Link key={title} to={to} className="card-hover p-8 group bg-white block">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{description}</p>
                <span className="text-primary-600 font-semibold inline-flex items-center group-hover:translate-x-1 transition-transform">
                  {linkLabel}
                  <ArrowRightIcon className="w-4 h-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-900 py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary-400" />
                <div className="text-2xl md:text-3xl font-extrabold text-white">{value}</div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="section-spacing bg-white">
        <div className="page-container">
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-10">
            Trusted by Educational Institutions Across India
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 bg-gray-50 border border-gray-100 rounded-xl py-6 px-3 text-gray-400"
              >
                <BuildingLibraryIcon className="w-6 h-6" />
                <span className="text-xs font-medium">Institute Logo</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-spacing bg-gradient-to-br from-primary-50 to-cyan-50">
        <div className="page-container text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your{' '}
            <span className="gradient-text">Institution?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            See how Viewebit LMS fits your institution, or explore what it costs to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/contact" className="btn btn-primary btn-lg group">
              Book a Demo
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/pricing" className="btn btn-outline btn-lg group border-2">
              View Pricing
              <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
```

- [ ] **Step 2: Verify**

Run: `cd "Viewebit-web" && npx tsc --noEmit 2>&1 | grep HomePage`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd "Viewebit-web" && git add src/pages/HomePage.tsx && git commit -m "Trim HomePage to a hero + teaser strip, moving full content to dedicated pages"
```

---

### Task 3: Create `FeaturesPage.tsx` and `ProductTourPage.tsx`

**Files:**
- Create: `Viewebit-web/src/pages/FeaturesPage.tsx`
- Create: `Viewebit-web/src/pages/ProductTourPage.tsx`

**Interfaces:**
- Consumes: `Link` from `react-router-dom`, `@heroicons/react/24/outline` icons.
- Produces: default exports `FeaturesPage`, `ProductTourPage`, routed at `/features` and `/tour` in Task 8.

- [ ] **Step 1: Write `FeaturesPage.tsx`**

```tsx
// Viewebit-web/src/pages/FeaturesPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BuildingLibraryIcon,
  ChartBarIcon,
  CheckBadgeIcon,
  ClipboardDocumentCheckIcon,
  CreditCardIcon,
  DocumentTextIcon,
  TrophyIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';

const FEATURE_CATEGORIES = [
  {
    icon: AcademicCapIcon,
    title: 'Course Management',
    description: 'Build structured courses with modules and lessons — video, documents, quizzes, and live sessions in one flow.',
  },
  {
    icon: VideoCameraIcon,
    title: 'Live & Recorded Learning',
    description: 'Schedule live classes via your existing video platform, with recordings available for later review.',
  },
  {
    icon: DocumentTextIcon,
    title: 'Online Assessments',
    description: 'Quiz categories with configurable negative marking, test series, and instant auto-evaluated results.',
  },
  {
    icon: ClipboardDocumentCheckIcon,
    title: 'Assignments & Grading',
    description: 'Text, file-upload, or quiz-based assignments with a dedicated grading workflow for educators.',
  },
  {
    icon: BuildingLibraryIcon,
    title: 'Study Materials',
    description: 'A secure PDF library with view-only protections, organized by course or category.',
  },
  {
    icon: CheckBadgeIcon,
    title: 'Certificates',
    description: 'Certificates are automatically issued the moment a student crosses your course completion threshold.',
  },
  {
    icon: TrophyIcon,
    title: 'Rankings & Leaderboards',
    description: 'Students see how they rank against peers on every test, keeping engagement and motivation high.',
  },
  {
    icon: ChartBarIcon,
    title: 'Analytics & Reports',
    description: 'Revenue, enrollment, and performance reporting for admins, exportable for deeper analysis.',
  },
  {
    icon: CreditCardIcon,
    title: 'Payments & Subscriptions',
    description: 'Built-in subscription and payment handling so students can enroll in paid courses and test series.',
  },
];

const FeaturesPage: React.FC = () => {
  return (
    <div>
      <section className="pt-16 pb-16 bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600">
        <div className="page-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything You Need in One Platform
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Viewebit LMS brings learning, teaching, and administration together — built for how institutions actually run.
          </p>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="page-container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURE_CATEGORIES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card-hover p-8 group bg-white">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-gradient-to-br from-primary-50 to-cyan-50">
        <div className="page-container text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            See It in Action
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Walk through how students, educators, and admins actually use the platform day to day.
          </p>
          <Link to="/tour" className="btn btn-primary btn-lg group">
            Take the Product Tour
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
```

- [ ] **Step 2: Write `ProductTourPage.tsx`**

```tsx
// Viewebit-web/src/pages/ProductTourPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ArrowRightIcon,
  Cog6ToothIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface TourStep {
  title: string;
  description: string;
}

interface TourJourney {
  role: string;
  icon: React.ElementType;
  color: string;
  steps: TourStep[];
}

const JOURNEYS: TourJourney[] = [
  {
    role: 'Student',
    icon: AcademicCapIcon,
    color: 'from-primary-500 to-primary-600',
    steps: [
      { title: 'Enroll in a Course', description: 'Browse published courses and enroll — free or paid via built-in subscriptions.' },
      { title: 'Attend Live Classes', description: 'Join scheduled live sessions from the course, or catch up with recordings later.' },
      { title: 'Take Quizzes & Tests', description: 'Work through quiz categories and test series with instant, auto-evaluated results.' },
      { title: 'Submit Assignments', description: 'Turn in text, file, or quiz-based assignments and get feedback from your educator.' },
      { title: 'Track Your Rank', description: "See how you're performing against peers on every test you take." },
      { title: 'Earn a Certificate', description: 'Certificates are issued automatically once you complete the course.' },
    ],
  },
  {
    role: 'Educator',
    icon: UserGroupIcon,
    color: 'from-purple-500 to-purple-600',
    steps: [
      { title: 'Build a Course', description: 'Structure modules and lessons — video, documents, quizzes, or live sessions.' },
      { title: 'Create Quiz Categories', description: 'Author quiz categories with configurable negative marking and difficulty.' },
      { title: 'Schedule Live Sessions', description: 'Link your existing video platform and schedule sessions tied to your course.' },
      { title: 'Create Assignments', description: 'Set up text, file-upload, or quiz-based assignments for your students.' },
      { title: 'Grade Submissions', description: 'Review and grade file/text submissions from a dedicated grading workflow.' },
      { title: 'See Who’s Enrolled', description: 'View your students, their subscriptions, and their quiz-attempt history in one place.' },
    ],
  },
  {
    role: 'Admin',
    icon: Cog6ToothIcon,
    color: 'from-cyan-500 to-cyan-600',
    steps: [
      { title: 'Set Up Your Institution', description: 'Configure branches and departments to match your organization.' },
      { title: 'Manage Educators & Roles', description: 'Add educator accounts and control what each role can access.' },
      { title: 'Review Admissions', description: 'Approve or reject student applications as they come in.' },
      { title: 'Oversee Subscriptions', description: 'Track active subscriptions and revenue across the institution.' },
      { title: 'Moderate Content', description: 'Review reported questions and content issues raised by students.' },
      { title: 'Export Reports', description: 'Pull revenue and enrollment reports for deeper analysis.' },
    ],
  },
];

const ProductTourPage: React.FC = () => {
  return (
    <div>
      <section className="pt-16 pb-16 bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600">
        <div className="page-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            A Tour of Viewebit LMS
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            See how students, educators, and admins each move through the platform.
          </p>
        </div>
      </section>

      {JOURNEYS.map((journey, journeyIndex) => (
        <section
          key={journey.role}
          className={`section-spacing ${journeyIndex % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-primary-50'}`}
        >
          <div className="page-container">
            <div className="flex items-center gap-4 mb-12 justify-center">
              <div className={`w-14 h-14 bg-gradient-to-r ${journey.color} rounded-2xl flex items-center justify-center`}>
                <journey.icon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                For {journey.role}s
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {journey.steps.map((step, stepIndex) => (
                <div
                  key={step.title}
                  className={`flex items-start gap-6 ${stepIndex % 2 === 1 ? 'md:flex-row-reverse md:text-right' : ''}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${journey.color} text-white flex items-center justify-center font-bold`}>
                    {stepIndex + 1}
                  </div>
                  <div className="card p-6 flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section-spacing bg-gradient-to-br from-primary-50 to-cyan-50">
        <div className="page-container text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to See It Live?
          </h2>
          <Link to="/contact" className="btn btn-primary btn-lg group">
            Book a Demo
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProductTourPage;
```

- [ ] **Step 3: Verify**

Run: `cd "Viewebit-web" && npx tsc --noEmit 2>&1 | grep -E "FeaturesPage|ProductTourPage"`
Expected: no output.

- [ ] **Step 4: Commit**

```bash
cd "Viewebit-web" && git add src/pages/FeaturesPage.tsx src/pages/ProductTourPage.tsx && git commit -m "Add Features and Product Tour pages"
```

---

### Task 4: Create `SolutionsPage.tsx`

**Files:**
- Create: `Viewebit-web/src/pages/SolutionsPage.tsx`

**Interfaces:**
- Consumes: `Link` from `react-router-dom`, `@heroicons/react/24/outline` icons.
- Produces: default export `SolutionsPage`, routed at `/solutions` in Task 8.

- [ ] **Step 1: Write the file**

```tsx
// Viewebit-web/src/pages/SolutionsPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface Solution {
  icon: React.ElementType;
  title: string;
  painPoint: string;
  features: string[];
}

const SOLUTIONS: Solution[] = [
  {
    icon: AcademicCapIcon,
    title: 'Coaching Institutes',
    painPoint: 'Running test series, live doubt-clearing sessions, and study materials across scattered tools makes it hard to track student progress.',
    features: [
      'Test series with negative marking and instant results',
      'Live classes tied directly to your course structure',
      'Secure, view-only PDF study material library',
      'Rankings that keep students motivated',
    ],
  },
  {
    icon: BuildingLibraryIcon,
    title: 'Schools',
    painPoint: 'Coordinating multiple subjects, teachers, and assessment formats needs a system built for structured, ongoing curricula.',
    features: [
      'Course and module structure per subject',
      'Assignments with text, file, and quiz submission types',
      'Certificates issued automatically on completion',
      'Branch and department-level administration',
    ],
  },
  {
    icon: UserGroupIcon,
    title: 'Colleges',
    painPoint: 'Larger student bodies and more educators need clear role-based access and reliable reporting across departments.',
    features: [
      'Multi-department institution structure',
      'Educator accounts with course-level ownership',
      'Revenue and enrollment reporting for admins',
      'Subscription-based access control per course',
    ],
  },
  {
    icon: BriefcaseIcon,
    title: 'Corporate Training',
    painPoint: 'Upskilling teams needs fast course rollout, clear completion tracking, and proof of training for compliance.',
    features: [
      'Quick course authoring for internal training content',
      'Automatic certificates as proof of completion',
      'Assignment-based skills assessment',
      'Grading workflow for manager or trainer review',
    ],
  },
];

const SolutionsPage: React.FC = () => {
  return (
    <div>
      <section className="pt-16 pb-16 bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600">
        <div className="page-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Solutions Built for Your Institution
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Whatever you teach, Viewebit LMS adapts to how you already run things.
          </p>
        </div>
      </section>

      {SOLUTIONS.map((solution, index) => (
        <section
          key={solution.title}
          className={`section-spacing ${index % 2 === 0 ? 'bg-white' : 'bg-gradient-to-br from-gray-50 to-primary-50'}`}
        >
          <div className="page-container">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center mb-6">
                  <solution.icon className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{solution.title}</h2>
                <p className="text-lg text-gray-600 mb-6">{solution.painPoint}</p>
                <Link to="/contact" className="btn btn-primary group">
                  Book a Demo for {solution.title}
                  <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className={`card p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <ul className="space-y-4">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default SolutionsPage;
```

- [ ] **Step 2: Verify**

Run: `cd "Viewebit-web" && npx tsc --noEmit 2>&1 | grep SolutionsPage`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd "Viewebit-web" && git add src/pages/SolutionsPage.tsx && git commit -m "Add Solutions page with 4 audience sections"
```

---

### Task 5: Create `PricingPage.tsx`

**Files:**
- Create: `Viewebit-web/src/pages/PricingPage.tsx`

**Interfaces:**
- Consumes: `Link` from `react-router-dom`, `@heroicons/react/24/outline` icons.
- Produces: default export `PricingPage`, routed at `/pricing` in Task 8.

- [ ] **Step 1: Write the file**

No real prices are shown anywhere on this page — every tier ends in a "Request a Quote" CTA linking to `/contact`, per the plan's explicit decision.

```tsx
// Viewebit-web/src/pages/PricingPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface PricingTier {
  name: string;
  tagline: string;
  highlighted?: boolean;
  features: { label: string; included: boolean }[];
}

const TIERS: PricingTier[] = [
  {
    name: 'Starter',
    tagline: 'Small coaching institutes and single-course educators',
    features: [
      { label: 'Course & lesson authoring', included: true },
      { label: 'Test series & quiz categories', included: true },
      { label: 'Assignments & grading', included: true },
      { label: 'Certificates', included: true },
      { label: 'Multi-branch management', included: false },
      { label: 'Custom reporting exports', included: false },
    ],
  },
  {
    name: 'Growth',
    tagline: 'Growing institutes with multiple educators and branches',
    highlighted: true,
    features: [
      { label: 'Everything in Starter', included: true },
      { label: 'Multi-branch & department management', included: true },
      { label: 'Role-based admin access', included: true },
      { label: 'Revenue & enrollment reporting', included: true },
      { label: 'Priority support', included: true },
      { label: 'Dedicated onboarding', included: false },
    ],
  },
  {
    name: 'Enterprise',
    tagline: 'Schools, colleges, and multi-institution organizations',
    features: [
      { label: 'Everything in Growth', included: true },
      { label: 'Dedicated onboarding', included: true },
      { label: 'Custom institutional agreements', included: true },
      { label: 'Priority feature requests', included: true },
      { label: 'SLA-backed support', included: true },
      { label: 'Volume-based pricing', included: true },
    ],
  },
];

const FAQS = [
  {
    question: 'How is Viewebit LMS priced?',
    answer: 'Pricing is tailored per institution based on student volume and the features you need — we don’t publish flat per-seat rates because institutions vary widely in size and requirements.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Book a demo and we’ll walk through a trial setup tailored to your institution before any commitment.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes — as your institution grows, your plan can be adjusted without disrupting existing courses or student data.',
  },
];

const PricingPage: React.FC = () => {
  return (
    <div>
      <section className="pt-16 pb-16 bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600">
        <div className="page-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Institution-First Pricing
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Every institution is different — talk to us and we'll build a plan that fits yours.
          </p>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="page-container">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`card p-8 ${tier.highlighted ? 'border-2 border-primary-500 shadow-xl relative' : ''}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                <p className="text-gray-600 mb-6 min-h-[3rem]">{tier.tagline}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature.label} className="flex items-start">
                      {feature.included ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.label}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`btn w-full justify-center ${tier.highlighted ? 'btn-primary' : 'btn-outline'}`}
                >
                  Request a Quote
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="page-container max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
            Pricing Questions
          </h2>
          <div className="space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question} className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
```

- [ ] **Step 2: Verify**

Run: `cd "Viewebit-web" && npx tsc --noEmit 2>&1 | grep PricingPage`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd "Viewebit-web" && git add src/pages/PricingPage.tsx && git commit -m "Add Pricing page with illustrative tiers and no public prices"
```

---

### Task 6: Create `AboutPage.tsx`

**Files:**
- Create: `Viewebit-web/src/pages/AboutPage.tsx`

**Interfaces:**
- Consumes: `Link` from `react-router-dom`, `@heroicons/react/24/outline` icons.
- Produces: default export `AboutPage`, routed at `/about` in Task 8.

- [ ] **Step 1: Write the file**

This moves the 4 role cards and stats bar out of the old `HomePage.tsx` (they're no longer duplicated there after Task 2). No fabricated team bios/photos are added.

```tsx
// Viewebit-web/src/pages/AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  ArrowRightIcon,
  BuildingLibraryIcon,
  ClockIcon,
  Cog6ToothIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const ROLES = [
  {
    icon: AcademicCapIcon,
    title: 'For Students',
    description: 'Access courses, attend live classes, submit assignments, take tests, and track your progress.',
  },
  {
    icon: UserGroupIcon,
    title: 'For Teachers',
    description: 'Create courses, conduct live classes, evaluate performance, and engage with students.',
  },
  {
    icon: Cog6ToothIcon,
    title: 'For Admins',
    description: 'Manage users, courses, reports, payments, and everything from one centralized dashboard.',
  },
  {
    icon: BuildingLibraryIcon,
    title: 'For Institutions',
    description: 'Multi-branch management, custom branding, and role-based access control.',
  },
];

const STATS = [
  { icon: BuildingLibraryIcon, value: '500+', label: 'Institutions' },
  { icon: UserGroupIcon, value: '1M+', label: 'Students' },
  { icon: AcademicCapIcon, value: '10K+', label: 'Courses' },
  { icon: ShieldCheckIcon, value: '99.9%', label: 'Uptime' },
  { icon: ClockIcon, value: '24/7', label: 'Support' },
];

const AboutPage: React.FC = () => {
  return (
    <div>
      <section className="pt-16 pb-16 bg-gradient-to-r from-primary-600 via-cyan-500 to-primary-600">
        <div className="page-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About Viewebit LMS
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            We build the tools institutions need to teach, assess, and grow — without stitching together five different products.
          </p>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="page-container max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Educational institutions juggle course delivery, live teaching, assessments, grading, and
            administration across too many disconnected tools. Viewebit LMS brings all of it — course
            authoring, live and recorded learning, assessments, assignments, certificates, and
            institution-wide administration — into one platform, so institutions can spend less time
            managing software and more time teaching.
          </p>
        </div>
      </section>

      <section className="section-spacing bg-gradient-to-br from-gray-50 to-primary-50">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              A Powerful Platform for{' '}
              <span className="gradient-text">Every Role</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Viewebit LMS is designed to simplify teaching, learning, and administration.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {ROLES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card-hover p-8 bg-white">
                <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-12">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary-400" />
                <div className="text-2xl md:text-3xl font-extrabold text-white">{value}</div>
                <div className="text-sm text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="page-container text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Want to Talk to Us?
          </h2>
          <Link to="/contact" className="btn btn-primary btn-lg group">
            Get in Touch
            <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
```

- [ ] **Step 2: Verify**

Run: `cd "Viewebit-web" && npx tsc --noEmit 2>&1 | grep AboutPage`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd "Viewebit-web" && git add src/pages/AboutPage.tsx && git commit -m "Add About page with mission, role cards, and stats"
```

---

### Task 7: Update `ContactPage.tsx` (remove header, drop dead FAQ link)

**Files:**
- Modify: `Viewebit-web/src/pages/ContactPage.tsx`

**Interfaces:**
- Consumes: unchanged (`ContactQueryForm` from `../components/ContactQueryForm`).
- Produces: default export `ContactPage`, unchanged content otherwise, now rendered inside `PublicLayout`'s `<Outlet />` (Task 8 wraps its route, no route path change — stays `/contact`).

- [ ] **Step 1: Remove the outer `min-h-screen` wrapper div's background gradient duplication is fine to keep (it's page-local background, not a layout concern) — only two changes needed: drop the dead `/#faqs` link since no FAQ page exists, and remove the `<footer>`... wait, `ContactPage.tsx` has no header/footer today, so nothing to remove there. Just fix the dead link.**

In `Viewebit-web/src/pages/ContactPage.tsx`, find this block (lines 60-75 today):

```tsx
              {/* FAQ Link */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Looking for quick answers?
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out our FAQ page for instant answers to common questions.
                </p>
                <a href="/#faqs" className="text-primary-600 hover:underline font-medium inline-flex items-center">
                  Visit FAQs
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
```

Replace with a link to the real Help Center page (`/help`) that already exists, instead of a nonexistent FAQ page:

```tsx
              {/* Help Center Link */}
              <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-primary-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Looking for quick answers?
                </h3>
                <p className="text-gray-600 mb-4">
                  Check out our Help Center for guidance on using the platform.
                </p>
                <Link to="/help" className="text-primary-600 hover:underline font-medium inline-flex items-center">
                  Visit Help Center
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
```

Add `Link` to the existing `react-router-dom` usage — the file currently has no `react-router-dom` import at all, so add this line at the top of the file alongside the other imports:

```tsx
import { Link } from 'react-router-dom';
```

- [ ] **Step 2: Verify**

Run: `cd "Viewebit-web" && npx tsc --noEmit 2>&1 | grep ContactPage`
Expected: no output.

- [ ] **Step 3: Commit**

```bash
cd "Viewebit-web" && git add src/pages/ContactPage.tsx && git commit -m "Fix dead FAQ anchor on Contact page to link to the real Help Center"
```

---

### Task 8: Wire all routes through `PublicLayout` in `App.tsx`

**Files:**
- Modify: `Viewebit-web/src/App.tsx`

**Interfaces:**
- Consumes: `PublicLayout` (Task 1), `HomePage` (Task 2), `FeaturesPage`/`ProductTourPage` (Task 3), `SolutionsPage` (Task 4), `PricingPage` (Task 5), `AboutPage` (Task 6), `ContactPage` (Task 7, existing import already present), plus the 5 existing legal pages already imported (`PrivacySecurityPage`, `HelpSupportPage`, `TermsConditionsPage`, `RefundPolicyPage`, `SourcesDisclaimer`).

- [ ] **Step 1: Add new page imports**

In `Viewebit-web/src/App.tsx`, find the existing import block (around line 22-30):

```tsx
// Main Pages
import AppComingSoonPage from './pages/AppComingSoonPage';
import ContactPage from './pages/ContactPage';
import DashboardPage from './pages/DashboardPage';
import HelpSupportPage from './pages/HelpSupportPage';
import HomePage from './pages/HomePage';
import PDFsPage from './pages/pdfs/PDFsPage';
import PDFViewerPage from './pages/pdfs/PDFViewerPage';
import PrivacySecurityPage from './pages/PrivacySecurityPage';
```

Add these lines directly below `import AppComingSoonPage from './pages/AppComingSoonPage';`:

```tsx
import AboutPage from './pages/AboutPage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import ProductTourPage from './pages/ProductTourPage';
import SolutionsPage from './pages/SolutionsPage';
```

Also add the new layout import directly below the existing layout imports (around line 12-13):

```tsx
import PublicLayout from './components/layout/PublicLayout';
```

- [ ] **Step 2: Replace the public routes block**

Find this block (currently lines 94-95 and 184-191):

```tsx
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
```

and further down:

```tsx
          {/* Privacy & Support Routes - Public Access */}
          <Route path="/privacy" element={<PrivacySecurityPage />} />
          <Route path="/help" element={<HelpSupportPage />} />
          <Route path="/terms" element={<TermsConditionsPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/source" element={<SourcesDisclaimer />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/app-coming-soon" element={<AppComingSoonPage />} />
```

Replace **both** blocks with a single layout-wrapped group. Remove the first block entirely (`{/* Public Routes */}` through the old `<Route path="/" element={<HomePage />} />` line), and replace the second block with:

```tsx
          {/* Public Marketing Site Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/tour" element={<ProductTourPage />} />
            <Route path="/solutions" element={<SolutionsPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacySecurityPage />} />
            <Route path="/help" element={<HelpSupportPage />} />
            <Route path="/terms" element={<TermsConditionsPage />} />
            <Route path="/refund-policy" element={<RefundPolicyPage />} />
            <Route path="/source" element={<SourcesDisclaimer />} />
          </Route>

          {/* App Coming Soon - standalone, no marketing chrome */}
          <Route path="/app-coming-soon" element={<AppComingSoonPage />} />
```

(`/app-coming-soon` is intentionally kept outside `PublicLayout` — it's a standalone interstitial page, not part of the marketing site's page set, and this plan doesn't touch its content.)

- [ ] **Step 3: Verify routing compiles and the app builds**

Run: `cd "Viewebit-web" && npx tsc --noEmit 2>&1 | grep -E "App\.tsx"`
Expected: no output.

Run: `cd "Viewebit-web" && npm run build`
Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
cd "Viewebit-web" && git add src/App.tsx && git commit -m "Wire all marketing pages through PublicLayout and add new page routes"
```

---

### Task 9: End-to-end manual verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

```bash
cd "Viewebit-web" && npm run dev
```

- [ ] **Step 2: Desktop click-through**

In a browser at desktop width, visit `/` and confirm:
1. The header shows all 7 nav items (Home, Features, Product Tour, Solutions, Pricing, About, Contact) plus Sign In/Get Started, and the same header appears on every page after navigating.
2. Click each nav item in turn — confirm each lands on a distinct page with real content (not a scroll-jump to an anchor), and the active nav item is visually highlighted.
3. On Home, click each of the 3 teaser cards — confirm they land on `/features`, `/solutions`, `/pricing` respectively.
4. On the Pricing page, confirm no dollar/rupee amounts are displayed anywhere, and each tier's button says "Request a Quote" and navigates to `/contact`.
5. On the Contact page, confirm the "Looking for quick answers?" card now links to `/help` (not a broken `#faqs` anchor), and the contact form still renders.
6. Visit `/privacy`, `/terms`, `/refund-policy`, `/help`, `/source` — confirm the same header/footer now appears on all of them (previously they had none).
7. Confirm the footer's link columns all navigate correctly and there are no dead links.

- [ ] **Step 3: Mobile responsiveness check**

Using browser dev tools' device emulation (or resizing to <1024px width):
1. Confirm the desktop nav and desktop auth buttons disappear, replaced by a hamburger icon.
2. Click the hamburger — confirm a menu opens listing all 7 nav items plus Sign In/Get Started.
3. Click a nav item in the mobile menu — confirm it navigates to the correct page AND the menu closes.
4. Re-open the menu and click the close (X) icon — confirm it closes without navigating.
5. Check that page content (feature grids, pricing cards, role cards, stats) reflows to a single or two-column layout at mobile width without horizontal scrolling or overlapping text.

- [ ] **Step 4: Submit the Contact form**

Fill out and submit the contact form on `/contact` — confirm it still succeeds (no regression from moving the page under the new layout).

- [ ] **Step 5: Final build check**

```bash
cd "Viewebit-web" && npx tsc --noEmit && npm run build
```
Expected: both commands complete with zero errors.
