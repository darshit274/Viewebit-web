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
