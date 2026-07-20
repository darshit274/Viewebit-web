import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PlayCircleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  VideoCameraIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { coursesService } from '../../services/courses';
import type { CourseDetail, Lesson } from '../../services/courses';
import { pdfsService } from '../../services/pdfs';
import SecureBase64PdfViewer from '../../components/pdf/SecureBase64PdfViewer';
import HTMLContent from '../../components/common/HTMLContent';
import toast from 'react-hot-toast';

const LESSON_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  video: VideoCameraIcon,
  document: DocumentTextIcon,
  quiz: QuestionMarkCircleIcon,
  live: PlayCircleIcon,
};

const CoursePlayerPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completing, setCompleting] = useState(false);
  const [lessonPdfContent, setLessonPdfContent] = useState<string | null>(null);
  const [lessonPdfLoading, setLessonPdfLoading] = useState(false);

  useEffect(() => {
    setLessonPdfContent(null);
    if (selectedLesson?.lesson_type !== 'document' || selectedLesson.content_html || !selectedLesson.pdf) return;

    let cancelled = false;
    setLessonPdfLoading(true);
    pdfsService
      .getSecureContent(selectedLesson.pdf.id)
      .then((secure) => {
        if (!cancelled) setLessonPdfContent(secure.content);
      })
      .catch((error) => {
        console.error('Failed to load lesson document:', error);
        if (!cancelled) toast.error('Failed to load this document');
      })
      .finally(() => {
        if (!cancelled) setLessonPdfLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedLesson]);

  useEffect(() => {
    if (!uuid) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await coursesService.getCourseByUuid(uuid);
        setCourse(data);
        const firstLesson = data.modules.find((m) => m.lessons.length > 0)?.lessons[0];
        if (firstLesson && !firstLesson.locked) setSelectedLesson(firstLesson);
      } catch (error) {
        console.error('Failed to load course:', error);
        toast.error('Failed to load course');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [uuid]);

  const handleSelectLesson = (lesson: Lesson) => {
    if (lesson.locked) {
      toast.error('Enroll in this course to unlock this lesson');
      return;
    }
    setSelectedLesson(lesson);
    if (lesson.lesson_type !== 'quiz') {
      coursesService.updateLessonProgress(lesson.uuid, 'in_progress').catch(() => {});
    }
  };

  const handleMarkComplete = async () => {
    if (!selectedLesson) return;
    setCompleting(true);
    try {
      await coursesService.updateLessonProgress(selectedLesson.uuid, 'completed');
      toast.success('Lesson marked as complete');
    } catch (error) {
      toast.error('Failed to update progress');
    } finally {
      setCompleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!course) {
    return <div className="p-6 text-center text-gray-600">Course not found</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
        <p className="text-sm text-gray-500 mt-1">Instructor: {course.educator.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          {!selectedLesson ? (
            <div className="text-center py-16 text-gray-500">
              {course.hasAccess ? 'Select a lesson to begin' : 'Enroll in this course to access its lessons'}
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">{selectedLesson.title}</h2>

              {selectedLesson.lesson_type === 'video' && selectedLesson.video_url && (
                <video controls className="w-full rounded-lg bg-black" src={selectedLesson.video_url} />
              )}

              {selectedLesson.lesson_type === 'document' && (
                selectedLesson.content_html ? (
                  <HTMLContent content={selectedLesson.content_html} />
                ) : selectedLesson.pdf ? (
                  lessonPdfLoading ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
                    </div>
                  ) : lessonPdfContent ? (
                    <SecureBase64PdfViewer base64Content={lessonPdfContent} title={selectedLesson.pdf.title} />
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-600">
                      <DocumentTextIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      Unable to load {selectedLesson.pdf.title}.
                    </div>
                  )
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-600">
                    <DocumentTextIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                    This document is not available.
                  </div>
                )
              )}

              {selectedLesson.lesson_type === 'quiz' && selectedLesson.quizCategory && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <QuestionMarkCircleIcon className="h-10 w-10 mx-auto mb-2 text-primary-500" />
                  <p className="text-gray-700 mb-4">This lesson is a quiz — completing it counts toward course completion.</p>
                  <button onClick={() => navigate(`/tests/quiz/${selectedLesson.quizCategory!.uuid}`)} className="btn-primary">
                    Start Quiz
                  </button>
                </div>
              )}

              {selectedLesson.lesson_type === 'live' && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-600">
                  <PlayCircleIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  Check the Live Sessions page to join this class when it starts.
                </div>
              )}

              {(selectedLesson.lesson_type === 'video' || selectedLesson.lesson_type === 'document') && (
                <button onClick={handleMarkComplete} disabled={completing} className="btn-secondary inline-flex items-center gap-2 disabled:opacity-50">
                  <CheckCircleIcon className="h-4 w-4" />
                  {completing ? 'Saving...' : 'Mark as Complete'}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="card p-4 space-y-4">
          {course.modules.map((module) => (
            <div key={module.uuid}>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">{module.title}</h3>
              <div className="space-y-1">
                {module.lessons.map((lesson) => {
                  const Icon = LESSON_ICON[lesson.lesson_type] || DocumentTextIcon;
                  const isSelected = selectedLesson?.uuid === lesson.uuid;
                  return (
                    <button
                      key={lesson.uuid}
                      onClick={() => handleSelectLesson(lesson)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                        isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lesson.locked ? <LockClosedIcon className="h-4 w-4 text-gray-400 flex-shrink-0" /> : <Icon className="h-4 w-4 flex-shrink-0" />}
                      <span className="flex-1 truncate">{lesson.title}</span>
                      {lesson.is_free_preview && !course.hasAccess && (
                        <span className="badge badge-green text-[10px]">Free</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayerPage;
