import { api } from './api';

export type SubmissionType = 'quiz' | 'file_upload' | 'text';
export type SubmissionStatus = 'not_started' | 'submitted' | 'late' | 'graded' | 'returned';

export interface AssignmentListItem {
  uuid: string;
  title: string;
  submission_type: SubmissionType;
  due_date: string | null;
  max_points: number | null;
  course: { id: number; uuid: string; title: string } | null;
  submissionStatus: SubmissionStatus;
  grade: number | null;
}

export interface AssignmentSubmission {
  uuid: string;
  submission_text?: string | null;
  file_url?: string | null;
  status: SubmissionStatus;
  grade: number | null;
  feedback: string | null;
}

export interface QuizResult {
  calculated_score: number;
  percentage: number;
}

export interface AssignmentDetail extends AssignmentListItem {
  description?: string;
  quizCategory?: { id: number; uuid: string; name: string } | null;
  submission?: AssignmentSubmission | null;
  quizResult?: QuizResult | null;
}

export const assignmentsService = {
  getAssignments: async (): Promise<AssignmentListItem[]> => {
    const response = await api.get('/assignments');
    return response.data.data;
  },

  getAssignmentByUuid: async (uuid: string): Promise<AssignmentDetail> => {
    const response = await api.get(`/assignments/${uuid}`);
    return response.data.data;
  },

  submitText: async (uuid: string, submission_text: string) => {
    const response = await api.post(`/assignments/${uuid}/submit`, { submission_text });
    return response.data;
  },

  submitFile: async (uuid: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post(`/assignments/${uuid}/submit`, formData);
    return response.data;
  },
};
