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
