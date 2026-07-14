import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  LightBulbIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  BuildingLibraryIcon,
  BookOpenIcon,
  ClockIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline';
import ViewebitLogoPng from './../assets/Viewebit.png';
import ContactQueryForm from '../components/ContactQueryForm';

const FEATURES = [
  {
    icon: LightBulbIcon,
    title: 'Smart Learning',
    description: 'Engaging content delivery with advanced tools'
  },
  {
    icon: VideoCameraIcon,
    title: 'Live Classes',
    description: 'Interactive live sessions with recordings'
  },
  {
    icon: DocumentTextIcon,
    title: 'Online Exams',
    description: 'Secure assessments and auto-evaluation'
  },
  {
    icon: ChartBarIcon,
    title: 'Detailed Reports',
    description: 'Insightful analytics for better decisions'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile App',
    description: 'Learn anytime, anywhere on mobile'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Reliable',
    description: 'Enterprise-grade security and 99.9% uptime'
  }
];

const ROLES = [
  {
    icon: AcademicCapIcon,
    title: 'For Students',
    description: 'Access courses, attend live classes, submit assignments, take tests, and track your progress.'
  },
  {
    icon: UserGroupIcon,
    title: 'For Teachers',
    description: 'Create courses, conduct live classes, evaluate performance, and engage with students.'
  },
  {
    icon: Cog6ToothIcon,
    title: 'For Admins',
    description: 'Manage users, courses, reports, payments, and everything from one centralized dashboard.'
  },
  {
    icon: BuildingLibraryIcon,
    title: 'For Institutions',
    description: 'Multi-branch management, custom branding, and role-based access control.'
  }
];

const STATS = [
  { icon: BuildingLibraryIcon, value: '500+', label: 'Institutions' },
  { icon: UserGroupIcon, value: '1M+', label: 'Students' },
  { icon: BookOpenIcon, value: '10K+', label: 'Courses' },
  { icon: ShieldCheckIcon, value: '99.9%', label: 'Uptime' },
  { icon: ClockIcon, value: '24/7', label: 'Support' }
];

const HomePage: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setNewsletterEmail('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-purple-50">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-cyan-50 via-primary-50 to-secondary-50 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-primary-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo - Left */}
            <Link to="/" className="flex items-center relative group">
              <img
                src={ViewebitLogoPng}
                alt="Viewebit LMS"
                className="relative h-20 sm:h-24 w-auto drop-shadow-lg transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Navigation - Center */}
            <nav className="hidden lg:flex items-center space-x-2 bg-white/60 backdrop-blur-md rounded-full px-3 py-2 shadow-lg shadow-primary-500/10 border border-white/50">
              <Link
                to="/"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Home
              </Link>
              <a
                href="#features"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Features
              </a>
              <a
                href="#about"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200"
              >
                About Us
              </a>
              <a
                href="#demo"
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 hover:bg-white rounded-full transition-all duration-200"
              >
                Contact
              </a>
            </nav>

            {/* Auth Buttons - Right */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 bg-white/60 hover:bg-white backdrop-blur-md rounded-full transition-all duration-200 shadow-md hover:shadow-lg border border-white/50"
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
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-r from-primary-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        </div>

        <div className="page-container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              {/* Tagline Badge */}
              <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary-100 to-purple-100 text-primary-900 text-sm font-semibold mb-8 animate-fade-in shadow-md">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Empowering Education
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 animate-slide-up leading-tight">
                The Complete{' '}
                <span className="gradient-text">Learning Management System</span>{' '}
                for Modern Education
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-8 animate-slide-up leading-relaxed">
                Viewebit LMS helps educational institutions deliver engaging learning experiences,
                streamline operations, and drive better results.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 animate-scale-in">
                <a href="#demo" className="btn btn-primary btn-lg group">
                  Book a Demo
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#features" className="btn btn-outline btn-lg group border-2">
                  Explore Features
                  <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Trust badges */}
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

            {/* Right: Simple decorative illustration */}
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
                    <BookOpenIcon className="w-10 h-10 mb-2" />
                    <span className="text-sm font-semibold">Courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-spacing bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need in{' '}
              <span className="gradient-text">One Platform</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Viewebit LMS brings learning, teaching, and administration together in a single, powerful platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, description }) => (
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

      {/* Roles Section */}
      <section id="about" className="section-spacing bg-gradient-to-br from-gray-50 to-primary-50">
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

      {/* Book a Free Demo */}
      <section id="demo" className="section-spacing bg-gradient-to-br from-primary-50 to-cyan-50">
        <div className="page-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Book a{' '}
                <span className="gradient-text">Free Demo</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                See how Viewebit LMS can transform your institution. Our experts will walk you through the platform.
              </p>
              <ul className="space-y-3 text-left inline-block">
                {['Personalized Demo', 'Expert Consultation', 'No Obligation', 'Quick Response'].map((item) => (
                  <li key={item} className="flex items-center text-gray-700">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
              <ContactQueryForm variant="demo" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="page-container">
          <div className="grid md:grid-cols-5 gap-8 mb-8">
            {/* Logo & Description */}
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

            {/* Platform */}
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Student Portal</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Teacher Portal</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-white font-bold mb-4">Solutions</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#about" className="hover:text-white transition-colors">Coaching Institutes</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Schools</a></li>
                <li><a href="#about" className="hover:text-white transition-colors">Colleges</a></li>
                <li><a href="#demo" className="hover:text-white transition-colors">Corporate Training</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/source" className="hover:text-white transition-colors">Sources &amp; Disclaimer</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">Terms &amp; Conditions</Link></li>
                <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
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

          {/* Copyright */}
          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>© 2026 Viewebit LMS. All rights reserved.</p>
            <div className="mt-2 flex items-center justify-center gap-4 text-xs">
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

export default HomePage;
