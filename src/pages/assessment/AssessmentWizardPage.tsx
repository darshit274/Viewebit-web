import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  assessmentService,
  type AssessmentSchema,
  type AnswersMap,
  type AnswerValue,
  type LeadInfo
} from '../../services/assessment';
import QuestionRenderer from './QuestionRenderer';
import TurnstileWidget from './TurnstileWidget';

const LEAD_CAPTURE_AFTER_SECTION = 'use_case_maturity';

const AssessmentWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [schema, setSchema] = useState<AssessmentSchema | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [showLeadCapture, setShowLeadCapture] = useState(false);
  const [answers, setAnswers] = useState<AnswersMap>({});
  const [leadInfo, setLeadInfo] = useState<Partial<LeadInfo>>({});
  const [website, setWebsite] = useState(''); // honeypot - stays empty for real users
  const [turnstileToken, setTurnstileToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useMemo(() => Date.now(), []);

  useEffect(() => {
    assessmentService.getQuestions()
      .then(setSchema)
      .catch(() => toast.error('Could not load the assessment. Please refresh and try again.'));
  }, []);

  if (!schema) {
    return <div className="max-w-2xl mx-auto px-4 py-24 text-center text-gray-500">Loading assessment&hellip;</div>;
  }

  const totalQuestions = schema.sections.reduce(
    (sum, s) => sum + (s.matrix && s.rows ? s.rows.length : s.questions?.length || 0),
    0
  );
  const questionsBeforeCurrentSection = schema.sections
    .slice(0, stepIndex)
    .reduce((sum, s) => sum + (s.matrix && s.rows ? s.rows.length : s.questions?.length || 0), 0);
  const currentSection = schema.sections[stepIndex];
  const currentSectionSize = currentSection.matrix && currentSection.rows ? currentSection.rows.length : currentSection.questions?.length || 0;
  const answeredSoFar = questionsBeforeCurrentSection + currentSectionSize;
  const progressPercent = Math.round((answeredSoFar / totalQuestions) * 100);

  const elapsedMinutes = (Date.now() - startedAt) / 60000;
  const paceMinutesPerQuestion = answeredSoFar > 0 ? elapsedMinutes / answeredSoFar : 0.2;
  const remainingQuestions = totalQuestions - answeredSoFar;
  const estimatedMinutesRemaining = Math.max(1, Math.round(remainingQuestions * paceMinutesPerQuestion));

  const handleAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const isCurrentSectionComplete = () => {
    if (currentSection.matrix && currentSection.rows) {
      return currentSection.rows.every((row) => answers[row.id] !== undefined);
    }
    return (currentSection.questions || []).every((q) => {
      const value = answers[q.id];
      if (q.type === 'multi-select') return Array.isArray(value) && value.length > 0;
      return value !== undefined && value !== '';
    });
  };

  const handleContinue = () => {
    if (!isCurrentSectionComplete()) {
      toast.error('Please answer every question on this screen before continuing.');
      return;
    }
    if (currentSection.id === LEAD_CAPTURE_AFTER_SECTION && !showLeadCapture) {
      setShowLeadCapture(true);
      return;
    }
    setShowLeadCapture(false);
    if (stepIndex < schema.sections.length - 1) {
      setStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (showLeadCapture) {
      setShowLeadCapture(false);
      return;
    }
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  };

  const isLeadInfoComplete = () =>
    !!(leadInfo.first_name && leadInfo.last_name && leadInfo.work_email && leadInfo.agency_name && leadInfo.job_title && leadInfo.employee_count_band);

  const handleLeadCaptureContinue = () => {
    if (!isLeadInfoComplete()) {
      toast.error('Please fill in every required field.');
      return;
    }
    setShowLeadCapture(false);
    setStepIndex((i) => i + 1);
  };

  const handleSubmit = async () => {
    if (!isCurrentSectionComplete()) {
      toast.error('Please answer every question on this screen before finishing.');
      return;
    }
    if (!isLeadInfoComplete()) {
      toast.error('We are missing some of your details. Please go back and fill them in.');
      return;
    }
    if (!turnstileToken) {
      toast.error('Please complete the verification check before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await assessmentService.submit(leadInfo as LeadInfo, answers, website, turnstileToken);
      sessionStorage.setItem('assessment_result', JSON.stringify(result));
      navigate('/ai-workforce-assessment/results');
    } catch {
      toast.error('Something went wrong submitting your assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isLastSection = stepIndex === schema.sections.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Question {Math.min(answeredSoFar, totalQuestions)} of {totalQuestions}</span>
            <span>Estimated time remaining: {estimatedMinutesRemaining} minute{estimatedMinutesRemaining === 1 ? '' : 's'}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {showLeadCapture ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Where should we send your AI Workforce Skills Report?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Your information is used to provide your assessment results and relevant Viewebit follow-up.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="First name"
                  value={leadInfo.first_name || ''}
                  onChange={(e) => setLeadInfo((p) => ({ ...p, first_name: e.target.value }))}
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Last name"
                  value={leadInfo.last_name || ''}
                  onChange={(e) => setLeadInfo((p) => ({ ...p, last_name: e.target.value }))}
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2 sm:col-span-2"
                  placeholder="Work email"
                  type="email"
                  value={leadInfo.work_email || ''}
                  onChange={(e) => setLeadInfo((p) => ({ ...p, work_email: e.target.value }))}
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Agency name"
                  value={leadInfo.agency_name || ''}
                  onChange={(e) => setLeadInfo((p) => ({ ...p, agency_name: e.target.value }))}
                />
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Job title"
                  value={leadInfo.job_title || ''}
                  onChange={(e) => setLeadInfo((p) => ({ ...p, job_title: e.target.value }))}
                />
                <select
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  value={leadInfo.employee_count_band || ''}
                  onChange={(e) => setLeadInfo((p) => ({ ...p, employee_count_band: e.target.value }))}
                >
                  <option value="">Number of employees</option>
                  {schema.leadFields.find((f) => f.id === 'employee_count_band')?.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  className="border border-gray-200 rounded-lg px-3 py-2"
                  placeholder="Phone number (optional)"
                  value={leadInfo.phone || ''}
                  onChange={(e) => setLeadInfo((p) => ({ ...p, phone: e.target.value }))}
                />
                {/* Honeypot: real users never see this field. Off-screen rather than
                    display:none/type=hidden, since some bots skip those specifically. */}
                <div style={{ position: 'absolute', left: '-9999px', top: 'auto' }} aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <QuestionRenderer section={currentSection} answers={answers} onAnswer={handleAnswer} />
          )}
          {isLastSection && !showLeadCapture && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <TurnstileWidget onToken={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0 && !showLeadCapture}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-40"
          >
            Back
          </button>
          {showLeadCapture ? (
            <button
              type="button"
              onClick={handleLeadCaptureContinue}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Continue
            </button>
          ) : isLastSection ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !turnstileToken}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'See My Results'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssessmentWizardPage;
