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
