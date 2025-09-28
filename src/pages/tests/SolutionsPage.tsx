import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  TrophyIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  Squares2X2Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import HTMLContent from '../../components/common/HTMLContent';
import '../../styles/html-content.css';

interface Question {
  id: number;
  uuid: string;
  question_text: string;
  question_text_gujarati?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct_answer: string;
  explanation?: string;
  explanation_gujarati?: string;
  marks: number;
}

interface SolutionsData {
  category: {
    id: number;
    uuid: string;
    name: string;
    description?: string;
  };
  solutions: Question[];
  metadata: {
    total_questions: number;
    language: string;
  };
}

const SolutionsPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [solutionsData, setSolutionsData] = useState<SolutionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Expandable explanations state
  const [showExplanations, setShowExplanations] = useState<{[key: number]: boolean}>({});
  const [showAllExplanations, setShowAllExplanations] = useState(false);
  
  // Retake/Practice mode state - ON by default
  const [practiceMode, setPracticeMode] = useState(true);
  const [reattemptAnswers, setReattemptAnswers] = useState<{[key: number]: string}>({});
  const [hasReattempted, setHasReattempted] = useState<{[key: number]: boolean}>({});
  
  // Navigator modal state
  const [showNavigator, setShowNavigator] = useState(false);

  // Get quiz result data from location state
  const { categoryName, userAnswers, score, percentage } = location.state || {};

  useEffect(() => {
    if (uuid) {
      fetchSolutions();
    }
  }, [uuid]);

  const fetchSolutions = async () => {
    try {
      console.log('Fetching solutions for UUID:', uuid);
      console.log('API URL:', `/dynamic/categories/${uuid}/solutions`);
      
      const response = await api.get(`/dynamic/categories/${uuid}/solutions`, {
        params: { 
          language: 'english'
        }
      });
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      if (response.data.success) {
        setSolutionsData(response.data.data);
        console.log('Solutions data set:', response.data.data);
      } else {
        console.error('API returned success: false', response.data);
        toast.error(response.data.message || 'Failed to load solutions');
      }
    } catch (error: any) {
      console.error('Failed to fetch solutions - Full error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load solutions';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading solutions...</p>
        </div>
      </div>
    );
  }

  if (!solutionsData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">No solutions found.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = solutionsData.solutions[currentQuestionIndex];
  const userAnswer = userAnswers ? userAnswers[currentQuestionIndex] : null;
  const isCorrect = userAnswer === currentQuestion.correct_answer;
  
  // Helper functions
  const toggleExplanation = (questionIndex: number) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: !prev[questionIndex]
    }));
  };
  
  const toggleAllExplanations = () => {
    const newState = !showAllExplanations;
    setShowAllExplanations(newState);
    
    if (solutionsData) {
      const allExplanations: {[key: number]: boolean} = {};
      solutionsData.solutions.forEach((_, index) => {
        allExplanations[index] = newState;
      });
      setShowExplanations(allExplanations);
    }
  };
  
  const handleReattempt = (questionIndex: number, selectedOption: string) => {
    const question = solutionsData?.solutions[questionIndex];
    if (!question) return;
    
    setReattemptAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
    
    setHasReattempted(prev => ({
      ...prev,
      [questionIndex]: true
    }));
    
    // Show explanation after reattempt
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: true
    }));
  };
  
  const resetQuestion = (questionIndex: number) => {
    setReattemptAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionIndex];
      return newAnswers;
    });
    
    setHasReattempted(prev => ({
      ...prev,
      [questionIndex]: false
    }));
    
    setShowExplanations(prev => ({
      ...prev,
      [questionIndex]: false
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Solutions</h1>
            <p className="text-sm text-gray-500">
              {categoryName} • Question {currentQuestionIndex + 1} of {solutionsData.solutions.length}
            </p>
          </div>
        </div>
        
        {/* Score Display */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Your Score</p>
            <p className="text-lg font-semibold text-gray-900">
              {score}/{solutionsData.solutions.length} ({percentage}%)
            </p>
          </div>
          <div className="flex items-center">
            <TrophyIcon className={`h-6 w-6 ${
              percentage >= 70 ? 'text-green-600' : 
              percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`} />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Practice Mode Toggle */}
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={practiceMode}
                  onChange={(e) => setPracticeMode(e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  practiceMode ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    practiceMode ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`} />
                </div>
              </label>
              <span className="text-sm font-medium text-gray-700">
                Practice Mode {practiceMode ? 'ON' : 'OFF'}
              </span>
              <ArrowPathIcon className={`h-4 w-4 ${
                practiceMode ? 'text-blue-600' : 'text-gray-400'
              }`} />
            </div>
          </div>
          
          {/* Show All/Hide All Explanations */}
          <button
            onClick={toggleAllExplanations}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {showAllExplanations ? (
              <>
                <EyeSlashIcon className="h-4 w-4" />
                <span>Hide All Explanations</span>
              </>
            ) : (
              <>
                <EyeIcon className="h-4 w-4" />
                <span>Show All Explanations</span>
              </>
            )}
          </button>
        </div>
        
        {practiceMode && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Practice Mode:</strong> Click on any option to reattempt wrong answers. 
              Explanations will be revealed after you make your choice.
            </p>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm text-gray-500">
            {currentQuestionIndex + 1} / {solutionsData.solutions.length}
          </span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / solutionsData.solutions.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl border border-gray-100 p-8 mb-6">
        {/* Question Header */}
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0">
            {isCorrect ? (
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            ) : (
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isCorrect 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isCorrect ? 'Correct' : 'Incorrect'}
              </span>
              <span className="text-sm text-gray-500">
                +{currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
              </span>
            </div>
            <h2 className="text-xl font-medium text-gray-900">
              {currentQuestion.question_text}
            </h2>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 mb-8">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionText = currentQuestion.options[option as keyof typeof currentQuestion.options];
            const isUserAnswer = userAnswer === option;
            const isCorrectAnswer = currentQuestion.correct_answer === option;
            
            // Reattempt logic
            const reattemptAnswer = reattemptAnswers[currentQuestionIndex];
            const isReattemptAnswer = reattemptAnswer === option;
            const hasUserReattempted = hasReattempted[currentQuestionIndex];
            const isReattemptCorrect = isReattemptAnswer && isCorrectAnswer;
            const isReattemptIncorrect = isReattemptAnswer && !isCorrectAnswer;
            
            // Show original answers by default, or if user has reattempted in practice mode
            const showOriginalAnswers = !practiceMode || hasUserReattempted;
            
            let optionClass = 'border-gray-200 bg-white';
            let labelClass = 'border-gray-300 text-gray-600';
            
            if (showOriginalAnswers) {
              if (isCorrectAnswer) {
                optionClass = 'border-green-500 bg-green-50 text-green-900';
                labelClass = 'border-green-500 bg-green-500 text-white';
              } else if (isUserAnswer && !isCorrectAnswer) {
                optionClass = 'border-red-500 bg-red-50 text-red-900';
                labelClass = 'border-red-500 bg-red-500 text-white';
              }
            }
            
            // Override with reattempt styling if applicable
            if (practiceMode && hasUserReattempted) {
              if (isReattemptCorrect) {
                optionClass = 'border-green-500 bg-green-100 text-green-900';
                labelClass = 'border-green-500 bg-green-600 text-white';
              } else if (isReattemptIncorrect) {
                optionClass = 'border-red-500 bg-red-100 text-red-900';  
                labelClass = 'border-red-500 bg-red-600 text-white';
              }
            }
            
            const isClickable = practiceMode && !hasUserReattempted && !isCorrect;
            
            return (
              <div
                key={option}
                className={`p-4 rounded-lg border transition-all ${optionClass} ${
                  isClickable ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300' : ''
                }`}
                onClick={() => {
                  if (isClickable) {
                    handleReattempt(currentQuestionIndex, option);
                  }
                }}
              >
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium mr-3 ${labelClass}`}>
                    {option}
                  </span>
                  <span className="flex-1">{optionText}</span>
                  
                  {/* Original answer indicators */}
                  {showOriginalAnswers && isCorrectAnswer && (
                    <CheckCircleIcon className="h-5 w-5 text-green-600 ml-2" />
                  )}
                  {showOriginalAnswers && isUserAnswer && !isCorrectAnswer && (
                    <XCircleIcon className="h-5 w-5 text-red-600 ml-2" />
                  )}
                  
                  {/* Reattempt indicators */}
                  {practiceMode && hasUserReattempted && isReattemptAnswer && (
                    <>
                      {isReattemptCorrect && (
                        <div className="flex items-center ml-2">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <span className="text-xs text-green-600 ml-1 font-medium">Reattempt ✓</span>
                        </div>
                      )}
                      {isReattemptIncorrect && (
                        <div className="flex items-center ml-2">
                          <XCircleIcon className="h-5 w-5 text-red-600" />
                          <span className="text-xs text-red-600 ml-1 font-medium">Reattempt ✗</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Practice Mode Controls */}
        {practiceMode && hasReattempted[currentQuestionIndex] && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-blue-900">Reattempt Complete</h4>
                <p className="text-sm text-blue-700">
                  {reattemptAnswers[currentQuestionIndex] === currentQuestion.correct_answer 
                    ? '🎉 Great job! You got it right this time.' 
                    : '🤔 That\'s still not correct, but you can see the explanation below.'}
                </p>
              </div>
              <button
                onClick={() => resetQuestion(currentQuestionIndex)}
                className="flex items-center space-x-1 px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
              >
                <ArrowPathIcon className="h-3 w-3" />
                <span>Try Again</span>
              </button>
            </div>
          </div>
        )}

        {/* Answer Summary - Hide when Practice Mode is ON unless user has reattempted */}
        {(!practiceMode || hasReattempted[currentQuestionIndex]) && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Your Answer</p>
                <p className={`text-lg font-semibold ${
                  isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {userAnswer ? `${userAnswer} - ${currentQuestion.options[userAnswer as keyof typeof currentQuestion.options]}` : 'Not answered'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer</p>
                <p className="text-lg font-semibold text-green-600">
                  {currentQuestion.correct_answer} - {currentQuestion.options[currentQuestion.correct_answer as keyof typeof currentQuestion.options]}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Explanation */}
        {currentQuestion.explanation && (
          <div className="bg-blue-50 rounded-lg border border-blue-200">
            {/* Explanation Header - Always Visible */}
            <button
              onClick={() => toggleExplanation(currentQuestionIndex)}
              className="w-full p-4 flex items-center justify-between hover:bg-blue-100 transition-colors rounded-t-lg"
            >
              <div className="flex items-center space-x-3">
                <LightBulbIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <h3 className="text-lg font-medium text-blue-900">
                  View Explanation
                  {practiceMode && !hasReattempted[currentQuestionIndex] && (
                    <span className="text-sm font-normal text-blue-600 ml-2">
                      (Available after reattempt)
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {practiceMode && !hasReattempted[currentQuestionIndex] && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    Locked
                  </span>
                )}
                {showExplanations[currentQuestionIndex] ? (
                  <EyeSlashIcon className="h-5 w-5 text-blue-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
            </button>
            
            {/* Explanation Content - Expandable */}
            {showExplanations[currentQuestionIndex] && 
             (!practiceMode || hasReattempted[currentQuestionIndex] || !practiceMode) && (
              <div className="px-6 pb-6 border-t border-blue-200">
                <div className="pt-4">
                  <HTMLContent
                    content={currentQuestion.explanation}
                    className="text-blue-800 leading-relaxed"
                  />
                  
                  {/* Show additional context for practice mode */}
                  {practiceMode && hasReattempted[currentQuestionIndex] && (
                    <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                      <div className="text-sm text-blue-700">
                        <strong>Practice Summary:</strong>
                        <ul className="mt-2 space-y-1">
                          <li>• Original answer: {userAnswer || 'Not answered'}</li>
                          <li>• Your reattempt: {reattemptAnswers[currentQuestionIndex]}</li>
                          <li>• Correct answer: {currentQuestion.correct_answer}</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Locked state message for practice mode */}
            {practiceMode && !hasReattempted[currentQuestionIndex] && showExplanations[currentQuestionIndex] && (
              <div className="px-6 pb-6 border-t border-blue-200">
                <div className="pt-4 text-center">
                  <div className="text-blue-600 mb-2">
                    <LightBulbIcon className="h-8 w-8 mx-auto opacity-50" />
                  </div>
                  <p className="text-blue-700 text-sm">
                    Reattempt the question above to unlock the explanation
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {/* Question Numbers */}
        <div className="flex space-x-2 max-w-xs overflow-x-auto">
          {solutionsData.solutions.map((_, index) => {
            const questionUserAnswer = userAnswers ? userAnswers[index] : null;
            const questionIsCorrect = questionUserAnswer === solutionsData.solutions[index].correct_answer;
            
            return (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded text-sm font-medium flex-shrink-0 ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : questionIsCorrect
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : questionUserAnswer
                    ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setCurrentQuestionIndex(Math.min(solutionsData.solutions.length - 1, currentQuestionIndex + 1))}
          disabled={currentQuestionIndex === solutionsData.solutions.length - 1}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === solutionsData.solutions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
          </div>

          {/* Right Sidebar - Question Navigator */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Navigator</h3>
                
                {/* Question Grid */}
                <div className="grid grid-cols-6 gap-2 mb-6">
                  {solutionsData && solutionsData.solutions.map((question, index) => {
                    const isCurrentQuestion = index === currentQuestionIndex;
                    const originalUserAnswer = userAnswers ? userAnswers[index] : null;
                    const isOriginalCorrect = originalUserAnswer === question.correct_answer;
                    const hasReattemptedThis = hasReattempted[index];
                    const reattemptAnswer = reattemptAnswers[index];
                    const isReattemptCorrect = reattemptAnswer === question.correct_answer;
                    
                    // Determine question status
                    let statusClass = '';
                    let statusColor = '';
                    
                    if (isCurrentQuestion) {
                      statusClass = 'border-blue-500 border-2 bg-blue-100 text-blue-800';
                      statusColor = 'current';
                    } else if (practiceMode && hasReattemptedThis) {
                      if (isReattemptCorrect) {
                        statusClass = 'bg-green-100 text-green-800 border border-green-300';
                        statusColor = 'reattempt-correct';
                      } else {
                        statusClass = 'bg-orange-100 text-orange-800 border border-orange-300';
                        statusColor = 'reattempt-incorrect';
                      }
                    } else if (originalUserAnswer) {
                      if (isOriginalCorrect) {
                        statusClass = 'bg-green-50 text-green-700 border border-green-200';
                        statusColor = 'correct';
                      } else {
                        statusClass = 'bg-red-50 text-red-700 border border-red-200';
                        statusColor = 'incorrect';
                      }
                    } else {
                      statusClass = 'bg-gray-50 text-gray-500 border border-gray-200';
                      statusColor = 'unanswered';
                    }
                    
                    return (
                      <button
                        key={question.id}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`w-12 h-12 rounded-lg flex items-center justify-center text-sm font-semibold transition-all hover:scale-105 ${statusClass}`}
                        title={`Question ${index + 1}`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="space-y-2 text-xs">
                  <h4 className="font-medium text-gray-700 mb-2">Legend:</h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-blue-100 border border-blue-300"></div>
                    <span className="text-gray-600">Current Question</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-green-50 border border-green-200"></div>
                    <span className="text-gray-600">Correct Answer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-red-50 border border-red-200"></div>
                    <span className="text-gray-600">Wrong Answer</span>
                  </div>
                  {practiceMode && (
                    <>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded bg-green-100 border border-green-300"></div>
                        <span className="text-gray-600">Reattempt Correct</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded bg-orange-100 border border-orange-300"></div>
                        <span className="text-gray-600">Reattempt Wrong</span>
                      </div>
                    </>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-gray-50 border border-gray-200"></div>
                    <span className="text-gray-600">Unanswered</span>
                  </div>
                </div>

                {/* Statistics */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-700 mb-3">Progress</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Questions:</span>
                      <span className="font-medium">{solutionsData?.solutions.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Score:</span>
                      <span className="font-medium">{score || 0}/{solutionsData?.solutions.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage:</span>
                      <span className={`font-medium ${
                        (percentage || 0) >= 70 ? 'text-green-600' : 
                        (percentage || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {percentage || 0}%
                      </span>
                    </div>
                    {practiceMode && Object.keys(hasReattempted).length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reattempted:</span>
                        <span className="font-medium text-blue-600">
                          {Object.values(hasReattempted).filter(Boolean).length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionsPage;