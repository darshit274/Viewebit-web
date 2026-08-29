import api from './api';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  type: 'single-select' | 'multi-select' | 'scale-1-5';
  prompt: string;
  options?: QuestionOption[];
}

export interface MatrixRow {
  id: string;
  label: string;
}

export interface Section {
  id: string;
  title: string;
  matrix?: boolean;
  scaleType?: 'confidence-1-5' | 'frequency-5';
  rows?: MatrixRow[];
  questions?: Question[];
}

export interface LeadField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'single-select';
  required: boolean;
  options?: QuestionOption[];
}

export interface AssessmentSchema {
  sections: Section[];
  leadFields: LeadField[];
}

export interface LeadInfo {
  first_name: string;
  last_name: string;
  work_email: string;
  agency_name: string;
  job_title: string;
  employee_count_band: string;
  phone?: string;
}

export type AnswerValue = string | number | string[];
export type AnswersMap = Record<string, AnswerValue>;

export interface DimensionScores {
  aiFluency: number;
  workflowApplication: number;
  prompting: number;
  responsibleAI: number;
  organisationalReadiness: number;
}

export interface OpportunityOrGap {
  key: string;
  title: string;
  explanation: string;
}

export interface AssessmentResult {
  id: number;
  overallScore: number;
  maturityLevel: string;
  maturityLabel: string;
  maturityDescription: string;
  dimensionScores: DimensionScores;
  topOpportunities: OpportunityOrGap[];
  topGaps: OpportunityOrGap[];
  recommendedPriorities: string[];
}

export const assessmentService = {
  getQuestions: async (): Promise<AssessmentSchema> => {
    const response = await api.get('/assessment/questions');
    return response.data.data;
  },

  submit: async (
    leadInfo: LeadInfo,
    answers: AnswersMap,
    website?: string,
    turnstileToken?: string
  ): Promise<AssessmentResult> => {
    // `website` is a honeypot field - real users never see or fill it (see
    // AssessmentWizardPage), so a non-empty value means a bot blindly filled
    // every input on the page. The backend rejects the submission if set.
    // `turnstileToken` is verified server-side against Cloudflare before the
    // submission is accepted - the check here is just to fail fast.
    const response = await api.post('/assessment/submit', { leadInfo, answers, website, turnstileToken });
    return response.data.data;
  }
};
