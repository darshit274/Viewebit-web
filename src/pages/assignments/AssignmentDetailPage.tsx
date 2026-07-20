import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { assignmentsService } from '../../services/assignments';
import type { AssignmentDetail } from '../../services/assignments';
import toast from 'react-hot-toast';

const AssignmentDetailPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionText, setSubmissionText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    if (!uuid) return;
    setIsLoading(true);
    try {
      const data = await assignmentsService.getAssignmentByUuid(uuid);
      setAssignment(data);
      setSubmissionText(data.submission?.submission_text || '');
    } catch (error) {
      console.error('Failed to load assignment:', error);
      toast.error('Failed to load assignment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uuid]);

  const handleSubmitText = async () => {
    if (!uuid || !submissionText.trim()) return;
    setSubmitting(true);
    try {
      await assignmentsService.submitText(uuid, submissionText.trim());
      toast.success('Submitted successfully');
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitFile = async () => {
    if (!uuid || !selectedFile) return;
    setSubmitting(true);
    try {
      await assignmentsService.submitFile(uuid, selectedFile);
      toast.success('Submitted successfully');
      setSelectedFile(null);
      await load();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!assignment) {
    return <div className="p-6 text-center text-gray-600">Assignment not found</div>;
  }

  const isGraded = assignment.submission?.status === 'graded';

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{assignment.title}</h1>
        {assignment.course && <p className="text-gray-600">{assignment.course.title}</p>}
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
          {assignment.due_date && <span>Due {new Date(assignment.due_date).toLocaleDateString()}</span>}
          {assignment.max_points != null && <span>{assignment.max_points} points</span>}
        </div>
      </div>

      {assignment.description && (
        <p className="whitespace-pre-line text-gray-700 mb-6">{assignment.description}</p>
      )}

      {assignment.submission?.status === 'graded' || assignment.submission?.feedback ? (
        <div className={`card p-4 mb-6 ${isGraded ? 'border-green-200 bg-green-50' : ''}`}>
          <div className="flex items-center gap-2 mb-1">
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-gray-900">
              Graded: {assignment.submission.grade}/{assignment.max_points}
            </span>
          </div>
          {assignment.submission.feedback && (
            <p className="text-sm text-gray-700">{assignment.submission.feedback}</p>
          )}
        </div>
      ) : null}

      {assignment.submission_type === 'quiz' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <QuestionMarkCircleIcon className="h-10 w-10 mx-auto mb-2 text-primary-500" />
          <p className="text-gray-700 mb-4">This assignment is completed via a quiz.</p>
          {assignment.quizCategory ? (
            <button
              onClick={() => navigate(`/tests/quiz/${assignment.quizCategory!.uuid}`)}
              className="btn-primary"
            >
              Start Quiz
            </button>
          ) : (
            <p className="text-sm text-red-600">No quiz is linked to this assignment yet.</p>
          )}
          {assignment.quizResult && (
            <p className="text-sm text-gray-600 mt-4">
              Your score: {assignment.quizResult.calculated_score} ({assignment.quizResult.percentage}%)
            </p>
          )}
        </div>
      )}

      {assignment.submission_type === 'text' && (
        <div>
          <label className="form-label">Your answer</label>
          <textarea
            className="form-input"
            rows={8}
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            disabled={isGraded || submitting}
            placeholder="Type your answer here..."
          />
          {!isGraded && (
            <button
              onClick={handleSubmitText}
              disabled={submitting || !submissionText.trim()}
              className="btn-primary mt-3"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      )}

      {assignment.submission_type === 'file_upload' && (
        <div>
          {assignment.submission?.file_url && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <DocumentIcon className="h-4 w-4" />
              <span>Previously submitted:</span>
              <a
                href={assignment.submission.file_url}
                target="_blank"
                rel="noreferrer"
                className="text-primary-600 hover:underline"
              >
                View file
              </a>
            </div>
          )}
          {!isGraded && (
            <>
              <label className="form-label">Upload file</label>
              <input
                type="file"
                className="form-input"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
              <button
                onClick={handleSubmitFile}
                disabled={submitting || !selectedFile}
                className="btn-primary mt-3 inline-flex items-center"
              >
                <ArrowUpTrayIcon className="h-4 w-4 mr-2" />
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailPage;
