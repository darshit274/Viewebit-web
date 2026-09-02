import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentService } from '../../services/assessment';

const AssessmentIntroPage: React.FC = () => {
  const navigate = useNavigate();
  const [introVideoUrl, setIntroVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    assessmentService
      .getConfig()
      .then((config) => setIntroVideoUrl(config.intro_video_url))
      .catch(() => setIntroVideoUrl(null));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-3">AI Workforce Skills Assessment</h1>
      <p className="text-lg text-gray-600 mb-6">
        Discover where your recruitment team can use AI &mdash; and what skills they need to get there.
      </p>
      <p className="text-gray-700 mb-2">A practical 5&ndash;7 minute assessment for UK recruitment agencies.</p>
      <p className="font-medium text-indigo-700 mb-8">No technical knowledge required.</p>
      {introVideoUrl && (
        <div
          className="w-full mx-auto mb-8 rounded-lg overflow-hidden shadow-md"
          style={{ maxWidth: '700px', aspectRatio: '7 / 5' }}
        >
          <iframe
            width="100%"
            height="100%"
            src={introVideoUrl}
            title="Assessment intro video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}
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
