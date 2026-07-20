import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AcademicCapIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { coursesService } from '../../services/courses';
import type { CourseListItem } from '../../services/courses';
import toast from 'react-hot-toast';

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await coursesService.getCourses();
        setCourses(data);
      } catch (error) {
        console.error('Failed to load courses:', error);
        toast.error('Failed to load courses');
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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Courses</h1>
        <p className="text-gray-600">Video lectures, notes, and quizzes from your instructors</p>
      </div>

      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <AcademicCapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available yet</h3>
          <p className="text-gray-600">Check back soon — your instructors are getting things ready.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Link
              key={course.uuid}
              to={`/courses/${course.uuid}`}
              className="card card-hover block overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <AcademicCapIcon className="h-12 w-12 text-primary-400" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{course.educator.name}</span>
                  {course.hasAccess ? (
                    <span className="badge badge-green">Enrolled</span>
                  ) : (
                    <span className="badge badge-yellow inline-flex items-center gap-1">
                      <LockClosedIcon className="h-3 w-3" />
                      {course.isPremium ? `₹${course.price}` : 'Locked'}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
