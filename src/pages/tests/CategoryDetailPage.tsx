import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  FolderIcon,
  DocumentTextIcon,
  PlayIcon,
  ClockIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  BookOpenIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';

interface CategoryDetail {
  uuid: string;
  name: string;
  name_gujarati?: string;
  description?: string;
  description_gujarati?: string;
  hierarchy_level: number;
  parent_id?: string;
  has_subcategories: boolean;
  subcategories?: SubCategory[];
  questions?: Question[];
}

interface SubCategory {
  uuid: string;
  name: string;
  name_gujarati?: string;
  description?: string;
  hierarchy_level: number;
  has_subcategories: boolean;
  subcategories_count?: number;
  questions_count?: number;
}

interface Question {
  id: number;
  uuid: string;
  question_text: string;
  question_text_gujarati?: string;
  option_a: string;
  option_a_gujarati?: string;
  option_b: string;
  option_b_gujarati?: string;
  option_c: string;
  option_c_gujarati?: string;
  option_d: string;
  option_d_gujarati?: string;
  correct_answer: string;
  explanation?: string;
  explanation_gujarati?: string;
  marks: number;
}

const CategoryDetailPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get navigation data from location state
  const { categoryName, seriesUuid, seriesName } = location.state || {};

  useEffect(() => {
    if (uuid) {
      fetchCategoryDetail();
    }
  }, [uuid]);

  const fetchCategoryDetail = async () => {
    try {
      setError(null);
      const response = await api.get(`/dynamic/categories/${uuid}`);
      
      if (response.data.success) {
        const responseData = response.data.data;
        // The API returns { category, content_type, content, breadcrumb, statistics }
        setCategory({
          ...responseData.category,
          has_subcategories: responseData.content_type === 'categories',
          subcategories: responseData.content_type === 'categories' ? responseData.content : [],
          questions: responseData.content_type === 'questions' ? responseData.content : []
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch category detail:', error);
      setError('Failed to load category details');
      toast.error('Failed to load category details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubcategorySelect = async (subcategory: SubCategory) => {
    // Check subscription access before allowing navigation
    try {
      const response = await api.get(`/subscription-access/test-series/${seriesUuid}`);
      if (response.data.success && !response.data.data.hasAccess && response.data.data.testSeries.pricing_type === 'paid') {
        toast.error('This test series requires a subscription. Please purchase to access the content.');
        return;
      }
    } catch (error) {
      console.error('Failed to check subscription access:', error);
      toast.error('Unable to verify access. Please try again.');
      return;
    }

    navigate(`/tests/category/${subcategory.uuid}`, {
      state: { 
        categoryName: subcategory.name,
        seriesUuid,
        seriesName,
        parentCategoryName: category?.name
      }
    });
  };

  const handleStartQuiz = async () => {
    console.log('🎮 Starting quiz - Debug info:', { 
      category: category?.name, 
      seriesUuid, 
      seriesName,
      questionsCount: category?.questions?.length 
    });
    
    if (!category || !category.questions || category.questions.length === 0) {
      toast.error('No questions available in this category');
      return;
    }
    
    // Skip subscription check if seriesUuid is not available
    if (seriesUuid) {
      try {
        console.log('🔍 Checking subscription access for series:', seriesUuid);
        const response = await api.get(`/subscription-access/test-series/${seriesUuid}`);
        console.log('🔍 Subscription response:', response.data);
        
        if (response.data.success && !response.data.data.hasAccess && response.data.data.testSeries.pricing_type === 'paid') {
          toast.error('This test requires a subscription. Please purchase the test series to access this content.');
          return;
        }
      } catch (error) {
        console.error('❌ Failed to check subscription access:', error);
        // Don't block quiz if subscription check fails - let user try
        console.warn('⚠️ Subscription check failed, allowing quiz to proceed');
      }
    } else {
      console.warn('⚠️ No seriesUuid available, skipping subscription check');
    }
    
    console.log('✅ Navigating to quiz page');
    navigate(`/tests/quiz/${uuid}`, {
      state: {
        categoryName: category.name,
        seriesName,
        questionCount: category.questions.length
      }
    });
  };

  const SubcategoryCard = ({ subcategory }: { subcategory: SubCategory }) => (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={() => handleSubcategorySelect(subcategory)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <FolderIcon className="h-5 w-5 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900 truncate">
            {subcategory.name}
          </h3>
          <div className="mt-1">
            <p className="text-sm text-gray-500">
              {subcategory.has_subcategories 
                ? `${subcategory.subcategories_count} subcategories`
                : `${subcategory.questions_count} questions`}
            </p>
          </div>
          {subcategory.description && (
            <p className="mt-2 text-sm text-gray-600 line-clamp-2">
              {subcategory.description}
            </p>
          )}
        </div>
        <ChevronRightIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );

  const QuizCard = ({ questions }: { questions: Question[] }) => (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={handleStartQuiz}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <PlayIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Start Quiz
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-1" />
                <span>{questions.length} questions</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span>{Math.ceil(questions.length * 1.5)} min</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            Free Practice
          </span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 mt-3">
        <p className="text-sm text-gray-600">
          Practice questions from <strong>{category?.name}</strong> category. Test your knowledge and improve your understanding.
        </p>
      </div>
    </div>
  );

  const BreadcrumbNav = () => (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <button
        onClick={() => navigate('/tests')}
        className="hover:text-gray-700 transition-colors"
      >
        Test Series
      </button>
      <ChevronRightIcon className="h-4 w-4" />
      {seriesName && (
        <>
          <button
            onClick={() => navigate(`/tests/series/${seriesUuid}`)}
            className="hover:text-gray-700 transition-colors truncate max-w-32"
          >
            {seriesName}
          </button>
          <ChevronRightIcon className="h-4 w-4" />
        </>
      )}
      <span className="font-medium text-gray-900 truncate">
        {category?.name || categoryName || 'Category'}
      </span>
    </nav>
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse mr-3"></div>
          <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="w-full h-20 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Error</h1>
        </div>
        
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load category</h3>
          <p className="text-gray-600 mb-6">Please try again later</p>
          <button
            onClick={fetchCategoryDetail}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 mr-3"
        >
          <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-gray-900 truncate">
            {category.name}
          </h1>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <BreadcrumbNav />

      {/* Category Description */}
      {category.description && (
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">{category.description}</p>
        </div>
      )}

      {/* Subcategories */}
      {category.has_subcategories && category.subcategories && category.subcategories.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Subcategories ({category.subcategories.length})
          </h2>
          <div className="space-y-4">
            {category.subcategories.map((subcategory) => (
              <SubcategoryCard key={subcategory.uuid} subcategory={subcategory} />
            ))}
          </div>
        </div>
      )}

      {/* Quiz/Questions */}
      {category.questions && category.questions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Practice Quiz ({category.questions.length} questions)
          </h2>
          <QuizCard questions={category.questions} />
        </div>
      )}

      {/* Empty State */}
      {(!category.subcategories || category.subcategories.length === 0) && 
       (!category.questions || category.questions.length === 0) && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No content available</h3>
          <p className="text-gray-600">This category doesn't have any subcategories or tests yet.</p>
        </div>
      )}
    </div>
  );
};

export default CategoryDetailPage;