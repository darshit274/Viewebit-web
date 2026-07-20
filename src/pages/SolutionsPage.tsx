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
