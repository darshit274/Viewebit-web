import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssessmentIntroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Workforce Skills Assessment</h1>
      <p className="text-lg text-gray-600 mb-6">
        Discover where your recruitment team can use AI &mdash; and what skills they need to get there.
      </p>
      <p className="text-gray-700 mb-2">A practical 5&ndash;7 minute assessment for UK recruitment agencies.</p>
      <p className="font-medium text-indigo-700 mb-8">No technical knowledge required.</p>
      <button
        type="button"
        onClick={() => navigate('/ai-workforce-assessment/start')}
        className="inline-flex items-center px-8 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
      >
        Start Assessment
      </button>
    </div>
  );
};

export default AssessmentIntroPage;
