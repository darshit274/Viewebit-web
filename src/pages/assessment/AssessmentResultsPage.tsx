import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { AssessmentResult } from '../../services/assessment';

const DIMENSION_LABELS: Record<string, string> = {
  aiFluency: 'AI Fluency',
  workflowApplication: 'Recruitment Workflow Application',
  prompting: 'Prompting & AI Communication',
  responsibleAI: 'Responsible AI & Human Oversight',
  organisationalReadiness: 'Organisational AI Readiness'
};

const AssessmentResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<AssessmentResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('assessment_result');
    if (!stored) {
      navigate('/ai-workforce-assessment');
      return;
    }
    setResult(JSON.parse(stored));
  }, [navigate]);

  if (!result) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Your AI Workforce Readiness Snapshot</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center mb-8">
          <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Overall AI Workforce Readiness</p>
          <div className="text-6xl font-bold text-indigo-600 mb-2">{result.overallScore}<span className="text-2xl text-gray-400"> / 100</span></div>
          <p className="text-xl font-semibold text-gray-900 mb-3">{result.maturityLabel}</p>
          <p className="text-gray-600 max-w-xl mx-auto">{result.maturityDescription}</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Capability Profile</h2>
          <div className="space-y-4">
            {Object.entries(result.dimensionScores).map(([key, score]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{DIMENSION_LABELS[key] || key}</span>
                  <span className="text-gray-500">{score}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Where AI Could Create the Most Value</h2>
          <div className="space-y-4">
            {result.topOpportunities.map((o) => (
              <div key={o.key}>
                <p className="font-semibold text-gray-900">{o.title}</p>
                <p className="text-sm text-gray-600">{o.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Biggest Workforce Skill Gaps</h2>
          <div className="space-y-4">
            {result.topGaps.map((g) => (
              <div key={g.key}>
                <p className="font-semibold text-gray-900">{g.title}</p>
                <p className="text-sm text-gray-600">{g.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Your next step isn&apos;t &ldquo;more AI&rdquo;.</h2>
          <p className="text-lg font-medium mb-3">It&apos;s the right AI skills for your workforce.</p>
          <p className="text-indigo-100 max-w-xl mx-auto mb-6">
            Viewebit&apos;s AI Workforce Academy helps organisations identify the AI skills their teams actually need,
            build practical capability through targeted training, and measure adoption over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/contact" className="px-6 py-3 rounded-lg bg-white text-indigo-700 font-semibold hover:bg-indigo-50">
              Talk to Viewebit about your AI Workforce Roadmap
            </a>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-6 py-3 rounded-lg border border-white text-white font-semibold hover:bg-indigo-500"
            >
              Download My Assessment Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultsPage;
