import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  BookOpenIcon,
  ClockIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';

const SourcesDisclaimer: React.FC = () => {
  const navigate = useNavigate();
  const lastUpdated = "2026";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-primary-50 to-purple-50">

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <ShieldCheckIcon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Sources & Disclaimer</h1>
              <p className="text-white/90 text-lg">
                Transparency about who creates content on Viewebit LMS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-white/80 text-sm">
            <ClockIcon className="h-4 w-4" />
            <span>Last updated: {lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to <strong className="text-primary-600">Viewebit LMS</strong>.
              Transparency and trust are important to us. This page explains who
              is responsible for the courses, quizzes, and study materials you
              see on the platform, and clearly outlines our disclaimer regarding
              any exam or certification bodies.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Viewebit LMS is a learning management platform that institutions
              and educators use to build and deliver their own courses. We do
              not author exam content ourselves — please review the sections
              below to understand exactly who does, and what that means for you.
            </p>
          </div>
        </div>

        <div className="space-y-6">

          {/* Section 1: Disclaimer */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <ExclamationTriangleIcon className="h-7 w-7" />
                Important Disclaimer
              </h2>
            </div>
            <div className="p-8 space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>
                  Viewebit LMS does NOT represent, affiliate with, authorize,
                  or claim any association with any government entity,
                  department, or examination authority.
                </strong>
              </p>
              <p>
                Viewebit LMS is an <strong>independent learning management
                platform</strong>. Institutions and educators use it to publish
                their own courses, live sessions, quizzes, and assignments —
                we provide the platform, not the curriculum.
              </p>
              <p>
                The platform <strong>does NOT provide</strong> official exam
                notifications, application submission services, recruitment
                processing, result publication, or any government services.
              </p>
            </div>
          </div>

          {/* Section 2: Who owns the content */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-secondary-500 to-primary-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <UserGroupIcon className="h-7 w-7" />
                Who Creates the Content
              </h2>
            </div>
            <div className="p-8 text-gray-700 space-y-4">
              <p>
                Every course, lesson, quiz, assignment, and study material on
                Viewebit LMS is authored, uploaded, and owned by the institution
                or educator who published it — not by Viewebit LMS itself.
                Institutions are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>The accuracy and completeness of their own course content</li>
                <li>Ensuring their materials comply with applicable copyright and licensing laws</li>
                <li>Keeping quiz questions, solutions, and study materials up to date</li>
                <li>Any claims made about certifications, outcomes, or exam alignment</li>
              </ul>
              <p>
                If you have a concern about specific course content, please
                reach out to the institution or educator who published it, or
                contact our support team and we will help route your concern.
              </p>
            </div>
          </div>

          {/* Section 3: Platform role */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <BookOpenIcon className="h-7 w-7" />
                Our Role as a Platform
              </h2>
            </div>
            <div className="p-8 text-gray-700 space-y-4">
              <p>
                Viewebit LMS provides the infrastructure — course authoring
                tools, live session scheduling, quiz and assignment
                engines, certificates, rankings, and payments — that
                institutions and educators use to deliver their own
                curriculum. We do not review or endorse individual course
                content before it is published.
              </p>
              <p>
                Where our own platform features reference general study
                aids (such as negative-marking rules or certificate
                thresholds), those are configuration options set by the
                educator for their own course or quiz, not claims made by
                Viewebit LMS about any specific exam or curriculum.
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>© 2026 Viewebit LMS. All rights reserved.</p>
          <p className="mt-2">
            This page is provided to ensure transparency about how content on
            our platform is created and owned.
          </p>
        </div>

      </div>
    </div>
  );
};

export default SourcesDisclaimer;
