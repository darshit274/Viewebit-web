import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GiftIcon,
  PlayIcon,
  ClockIcon,
  BookOpenIcon,
  ArrowRightIcon,
  SparklesIcon,
  ChevronRightIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import { GiftIcon as GiftIconSolid } from '@heroicons/react/24/solid';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/cn';

interface FreeInPaidCategory {
  uuid: string;
  name: string;
  name_gujarati: string;
  description: string;
  description_gujarati: string;
  test_duration_minutes: number;
  questions_count: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
  series: {
    uuid: string;
    title: string;
    title_gujarati: string;
    price: number;
    currency: string;
  };
  hierarchy_path: Array<{
    uuid: string;
    name: string;
    name_gujarati: string;
    node_type: string;
  }>;
  breadcrumb: string;
}

const FreeInPaidTestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<FreeInPaidCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchFreeInPaidCategories();
  }, [page]);

  const fetchFreeInPaidCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get('/tests/free-in-paid/all', {
        params: {
          page,
          limit: 12,
        }
      });

      if (response.data.success) {
        setCategories(response.data.data.categories || []);
        setTotalPages(response.data.data.pagination?.totalPages || 1);
        setTotal(response.data.data.pagination?.total || 0);
      }
    } catch (error: any) {
      console.error('Failed to fetch free-in-paid categories:', error);
      setError(error.response?.data?.message || 'Failed to load free samples');
      toast.error('Failed to load free samples from paid series');
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleStartQuiz = (category: FreeInPaidCategory) => {
    // Navigate directly to quiz page (access control handled by backend via is_free_in_paid_series flag)
    navigate(`/tests/quiz/${category.uuid}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <GiftIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading free samples</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <div className="mt-6">
              <button
                onClick={fetchFreeInPaidCategories}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <GiftIconSolid className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Free Samples</h1>
              <p className="mt-1 text-gray-600">
                Try before you buy - Free quiz samples from premium test series
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <SparklesIcon className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                These are FREE samples from our PAID test series
              </p>
              <p className="text-sm text-blue-700 mt-1">
                Experience the quality of our premium content at no cost. Like what you see? Subscribe to access the complete series!
              </p>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Available Free Samples {total > 0 && `(${total})`}
          </h2>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded mb-4"></div>
                <div className="flex gap-4 mb-4">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          // Empty State
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <GiftIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Free Samples Available</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are currently no free quiz samples from paid test series.
            </p>
            <p className="mt-1 text-sm text-gray-500">Check back later!</p>
            <div className="mt-6">
              <Link
                to="/tests"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse All Test Series
              </Link>
            </div>
          </div>
        ) : (
          // Categories Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.uuid}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  {/* Header with Badges */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpenIcon className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-xs font-semibold text-blue-600 truncate">
                          {category.series.title}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold text-green-700 bg-green-100 border border-green-200">
                        <GiftIconSolid className="h-3 w-3" />
                        FREE
                      </span>
                    </div>
                  </div>

                  {/* Category Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>

                  {/* Description */}
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Breadcrumb Path */}
                  <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4">
                    <div className="flex items-center gap-1 text-xs text-gray-600 overflow-hidden">
                      <span className="truncate">{category.breadcrumb}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <BookOpenIcon className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{category.questions_count}</span>
                        <span>Questions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ClockIcon className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{category.test_duration_minutes}</span>
                        <span>mins</span>
                      </div>
                    </div>
                    <div>
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border',
                          getDifficultyColor(category.difficulty_level)
                        )}
                      >
                        {category.difficulty_level.charAt(0).toUpperCase() + category.difficulty_level.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleStartQuiz(category)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
                  >
                    <PlayIcon className="h-4 w-4" />
                    <span>Start Free Quiz</span>
                    <ChevronRightIcon className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  {/* Series Price Tag */}
                  <div className="mt-3 pt-3 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                      Full series: <span className="font-semibold text-gray-700">{category.series.currency} {category.series.price}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                page === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              )}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                page === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              )}
            >
              Next
            </button>
          </div>
        )}

        {/* Bottom Spacing */}
        <div className="h-12"></div>
      </div>
    </div>
  );
};

export default FreeInPaidTestsPage;
