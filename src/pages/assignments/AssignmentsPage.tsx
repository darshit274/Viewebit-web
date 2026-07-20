import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardDocumentListIcon,
  QuestionMarkCircleIcon,
  PencilSquareIcon,
  ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';
import { assignmentsService } from '../../services/assignments';
import type { AssignmentListItem, SubmissionType, SubmissionStatus } from '../../services/assignments';
import toast from 'react-hot-toast';

const TYPE_ICON: Record<SubmissionType, React.ComponentType<{ className?: string }>> = {
  quiz: QuestionMarkCircleIcon,
  text: PencilSquareIcon,
  file_upload: ArrowUpTrayIcon,
};

const STATUS_BADGE: Record<SubmissionStatus, { label: string; className: string }> = {
  not_started: { label: 'Not started', className: 'badge-yellow' },
  submitted: { label: 'Submitted', className: 'badge-blue' },
  late: { label: 'Late', className: 'badge-red' },
  graded: { label: 'Graded', className: 'badge-green' },
  returned: { label: 'Returned', className: 'badge-purple' },
};

const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<AssignmentListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await assignmentsService.getAssignments();
        setAssignments(data);
      } catch (error) {
        console.error('Failed to load assignments:', error);
        toast.error('Failed to load assignments');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Assignments</h1>
        <p className="text-gray-600">Homework, quizzes, and submissions from your instructors</p>
      </div>

      {assignments.length === 0 ? (
        <div className="card p-12 text-center">
          <ClipboardDocumentListIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
          <p className="text-gray-600">Check back soon — your instructors are getting things ready.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments.map((assignment) => {
            const Icon = TYPE_ICON[assignment.submission_type];
            const badge = STATUS_BADGE[assignment.submissionStatus];
            return (
              <Link
                key={assignment.uuid}
                to={`/assignments/${assignment.uuid}`}
                className="card card-hover block p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    <h3 className="font-semibold text-gray-900">{assignment.title}</h3>
                  </div>
                  <span className={`badge ${badge.className} flex-shrink-0`}>{badge.label}</span>
                </div>
                {assignment.course && (
                  <p className="text-sm text-gray-500 mb-2">{assignment.course.title}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  {assignment.due_date && (
                    <span>Due {new Date(assignment.due_date).toLocaleDateString()}</span>
                  )}
                  {assignment.max_points != null && (
                    <span>
                      {assignment.grade != null ? `${assignment.grade}/${assignment.max_points}` : assignment.max_points} pts
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignmentsPage;
