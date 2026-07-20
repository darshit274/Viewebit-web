import { api } from './api';

export type LessonType = 'video' | 'document' | 'quiz' | 'live';

export interface CourseListItem {
  uuid: string;
  title: string;
  description?: string;
  thumbnail_url?: string | null;
  educator: { id: string; name: string; avatar?: string | null; designation?: string };
  isPremium: boolean;
  price: number;
  hasAccess: boolean;
}

export interface Lesson {
  uuid: string;
  title: string;
  lesson_type: LessonType;
  video_url?: string | null;
  content_html?: string | null;
  duration_minutes?: number | null;
  is_free_preview?: boolean;
  locked?: boolean;
  quizCategory?: { id: number; uuid: string; name: string } | null;
  pdf?: { id: string; title: string } | null;
}

export interface CourseModule {
  uuid: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseDetail {
  uuid: string;
  title: string;
  description?: string;
  status: string;
  testSeries?: { id: number; uuid: string; name: string; pricing_type: string; price: number } | null;
  educator: { id: string; name: string; avatar?: string | null; designation?: string };
  modules: CourseModule[];
  hasAccess: boolean;
}

export const coursesService = {
  getCourses: async (): Promise<CourseListItem[]> => {
    const response = await api.get('/courses');
    return response.data.data;
  },

  getCourseByUuid: async (uuid: string): Promise<CourseDetail> => {
    const response = await api.get(`/courses/${uuid}`);
    return response.data.data;
  },

  updateLessonProgress: async (lessonUuid: string, status: 'in_progress' | 'completed', watch_seconds?: number) => {
    const response = await api.patch(`/courses/lessons/${lessonUuid}/progress`, { status, watch_seconds });
    return response.data;
  },
};
