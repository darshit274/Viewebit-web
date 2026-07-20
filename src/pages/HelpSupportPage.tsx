import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  EnvelopeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BookOpenIcon,
  LightBulbIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  DocumentTextIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'courses' | 'features';
}

const HelpSupportPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqs: FAQ[] = [
    {
      id: 1,
      question: 'How do I enroll in a course?',
      answer: 'Navigate to the "Courses" section from the sidebar menu. Browse courses published by your institution, then click on one to view its modules and lessons. Free courses give you instant access; paid courses take you to checkout to activate your subscription.',
      category: 'general',
    },
    {
      id: 2,
      question: 'What can I do on Viewebit LMS?',
      answer: 'Viewebit LMS brings courses, live and recorded classes, quizzes and test series, assignments, certificates, and rankings together in one platform, so you can learn, practice, and track your progress without switching between tools.',
      category: 'general',
    },
    {
      id: 3,
      question: 'How do I join a live class?',
      answer: 'Open the "Live & Recorded" section or the relevant lesson inside your course. Scheduled sessions show a "Join" link that opens the class in your video platform of choice. If you miss a session, check back later for the recording.',
      category: 'courses',
    },
    {
      id: 4,
      question: 'How is my leaderboard rank calculated?',
      answer: 'Your rank is based on your FIRST ATTEMPT score for each quiz. The leaderboard ranks users by score (highest first). In case of a tie, whoever completed the quiz earlier receives the higher rank — this keeps rankings fair and prevents gaming the system by retaking a quiz after viewing solutions.',
      category: 'features',
    },
    {
      id: 5,
      question: 'Can I attempt a quiz more than once?',
      answer: 'Once you have completed a quiz and viewed its solutions, you can reattempt it as many times as you like to reinforce what you learned. Only your FIRST attempt score counts toward leaderboard rankings, so take your time and prepare before your first try.',
      category: 'features',
    },
    {
      id: 6,
      question: 'How do I view detailed solutions with explanations?',
      answer: 'After submitting any quiz, click "View Solutions" on the results page. You will see explanations for every question, including why the correct answer is right, why the other options are wrong, and key concepts to remember.',
      category: 'courses',
    },
    {
      id: 7,
      question: 'How do assignments work?',
      answer: 'Your educator may assign text answers, file uploads, or quiz-based assignments. Open "Assignments" from the sidebar, submit your work before the due date, and check back for your grade and feedback once your educator has reviewed it.',
      category: 'courses',
    },
    {
      id: 8,
      question: 'How do I get a certificate?',
      answer: 'Certificates are issued automatically once you complete a course — finishing its lessons and any linked quizzes past your educator\'s completion threshold. You can view and download your certificates anytime from the "Certificates" section.',
      category: 'features',
    },
    {
      id: 9,
      question: 'My progress or results are not showing. What should I do?',
      answer: 'First, try refreshing your browser (Ctrl+R or Cmd+R). If the issue persists, check "Test History" from the sidebar to view your completed quizzes, and confirm your internet connection was stable when you submitted. If results still don\'t appear after a few minutes, please contact our support team.',
      category: 'technical',
    },
    {
      id: 10,
      question: 'How do performance analytics work?',
      answer: 'Viewebit LMS tracks your accuracy, subject-wise performance, time spent per question, and progress over time, so you can see exactly where to focus your effort. Access your analytics from the Dashboard or Profile sections.',
      category: 'features',
    },
    {
      id: 11,
      question: 'What is negative marking and how is it calculated?',
      answer: 'Some quizzes deduct marks for wrong answers, matching real exam patterns — the exact deduction per wrong answer is set by whoever authored the quiz and shown before you start. Your final score = (Correct answers × Marks per question) − (Wrong answers × Negative marks per question). The results page always shows your score breakdown clearly.',
      category: 'courses',
    },
    {
      id: 12,
      question: 'How do I reset my password or update my profile?',
      answer: 'Click on your profile picture/name in the top-right corner and select "Profile" from the dropdown menu. Use "Account Settings" to update your name, email, or profile picture. For password changes, go to the "Privacy & Security" section and use the "Change Password" form.',
      category: 'technical',
    },
  ];

  const categories = [
    { id: 'all', name: 'All FAQs', icon: BookOpenIcon, color: 'from-primary-500 to-cyan-500' },
    { id: 'general', name: 'General', icon: QuestionMarkCircleIcon, color: 'from-purple-500 to-pink-500' },
    { id: 'courses', name: 'Courses & Quizzes', icon: AcademicCapIcon, color: 'from-green-500 to-emerald-500' },
    { id: 'features', name: 'Features', icon: SparklesIcon, color: 'from-orange-500 to-red-500' },
    { id: 'technical', name: 'Technical', icon: DocumentTextIcon, color: 'from-secondary-500 to-primary-500' },
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-primary-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-600 to-primary-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-white/90 hover:text-white transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
              <QuestionMarkCircleIcon className="h-12 w-12" />
            </div>
            <h1 className="text-5xl font-bold mb-4">Help & Support Center</h1>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Find answers, get help, and learn everything about Viewebit LMS
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">

        {/* Quick Contact Cards */}
        <div className="grid gap-6 mb-12">
          <a
            href="mailto:info@viewebit.com"
            className="group bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-105"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <EnvelopeIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Email Support</h3>
                <p className="text-white/90 mb-2">Get detailed help via email</p>
                <p className="text-lg font-semibold">info@viewebit.com</p>
                <p className="text-sm text-white/70 mt-2">Response time: 24-48 hours</p>
              </div>
            </div>
          </a>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-primary-500 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <BookOpenIcon className="h-10 w-10" />
              <div>
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                <p className="text-white/90 text-lg">Find quick answers to common questions</p>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                        : 'bg-white text-gray-700 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{cat.name}</span>
                    {cat.id === 'all' && (
                      <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                        {faqs.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FAQ List */}
          <div className="p-6">
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                        {faq.id}
                      </div>
                      <span className="font-semibold text-gray-900 text-lg pr-4">{faq.question}</span>
                    </div>
                    {expandedFaq === faq.id ? (
                      <ChevronUpIcon className="h-6 w-6 text-primary-600 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {expandedFaq === faq.id && (
                    <div className="px-6 pb-6 bg-gradient-to-br from-primary-50 to-purple-50">
                      <div className="pl-14">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-primary-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
            <LightBulbIcon className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Pro Tip</h3>
            <p className="text-white/90">
              Work through quizzes regularly and review solutions thoroughly to track your progress and identify weak areas.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
            <TrophyIcon className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Best Practice</h3>
            <p className="text-white/90">
              Focus on your first attempt! Only your first quiz score counts for rankings, so prepare well before starting.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
            <AcademicCapIcon className="h-12 w-12 mb-4 opacity-90" />
            <h3 className="text-xl font-bold mb-2">Stay Enrolled</h3>
            <p className="text-white/90">
              Complete a course's lessons and quizzes to automatically unlock its certificate — no extra steps needed.
            </p>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <AcademicCapIcon className="h-10 w-10" />
              Getting Started Guide
            </h2>
            <p className="text-white/90 text-lg mt-2">Step-by-step guide for new users</p>
          </div>
          <div className="p-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your Account</h3>
                  <p className="text-gray-700">Sign up with your email and complete your profile. Choose a display name for leaderboards.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Courses</h3>
                  <p className="text-gray-700">Explore courses published by your institution. Start with a free course or free preview lesson to get familiar with the platform.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Learn, Attempt, and Submit</h3>
                  <p className="text-gray-700">Work through lessons, attend live classes, take quizzes, and submit assignments as your educator schedules them.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Review & Track Progress</h3>
                  <p className="text-gray-700">Check quiz results, review detailed solutions, and follow your analytics and certificates as you complete each course.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-1 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow">
            <ClockIcon className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Test History</h3>
            <p className="text-gray-700 mb-4">
              View all your completed quizzes, scores, and performance analytics in one place.
            </p>
            <button
              onClick={() => navigate('/test-history')}
              className="text-purple-600 font-semibold hover:underline flex items-center gap-2"
            >
              View History →
            </button>
          </div>
        </div>

        {/* Still Need Help Section */}
        <div className="bg-gradient-to-br from-purple-600 to-primary-600 rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-12 text-white text-center">
            <EnvelopeIcon className="h-20 w-20 mx-auto mb-6 opacity-90" />
            <h2 className="text-4xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:info@viewebit.com"
                className="inline-flex items-center gap-3 bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
              >
                <EnvelopeIcon className="h-6 w-6" />
                Email Us
              </a>
            </div>
            <p className="text-white/70 text-sm mt-6">
              Email: We respond within 24-48 hours
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-lg">© 2026 Viewebit LMS. All rights reserved.</p>
          <p className="mt-2">Everything you need to teach, learn, and grow — in one platform.</p>
        </div>

      </div>
    </div>
  );
};

export default HelpSupportPage;
