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
