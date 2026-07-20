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
