import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  Squares2X2Icon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";

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

interface QuizData {
  category: {
    id: number;
    uuid: string;
    name: string;
    description?: string;
  };
  questions: Question[];
  metadata: {
    total_questions: number;
    language: string;
    shuffled: boolean;
  };
}

const TakeTestPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [markedQuestions, setMarkedQuestions] = useState<{
    [key: number]: boolean;
  }>({});
  const [language, setLanguage] = useState<"english" | "gujarati">("english");
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get category info from location state
  const { categoryName, seriesName, questionCount } = location.state || {};

  useEffect(() => {
    if (uuid) {
      fetchQuizQuestions();
    }
  }, [uuid, language]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeRemaining > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeRemaining, showResults]);

  const fetchQuizQuestions = async () => {
    try {
      // First try to get questions directly from category (existing logic)
      let response;
      try {
        response = await api.get(`/dynamic/categories/${uuid}/questions`, {
          params: {
            language: language,
            shuffle: true,
          },
        });

        if (response.data.success) {
          setQuizData(response.data.data);
          // Set timer: 1.5 minutes per question
          setTimeRemaining(response.data.data.questions.length * 90);
          return;
        }
      } catch (categoryError: any) {
        console.log("Category endpoint failed, trying test series approach...");

        // If category approach fails, try test series approach (for free tests)
        try {
          // Get test series details first
          const seriesResponse = await api.get(`/dynamic/test-series/${uuid}`);

          if (seriesResponse.data.success) {
            const testSeries = seriesResponse.data.data;

            if (!testSeries.categories || testSeries.categories.length === 0) {
              toast.error("This test has no questions available yet.");
              setIsLoading(false);
              return;
            }

            // Find the first category that has questions
            let questionsFound = false;
            for (const category of testSeries.categories) {
              if (
                category.has_questions ||
                category.total_questions_recursive > 0
              ) {
                try {
                  const questionsResponse = await api.get(
                    `/dynamic/categories/${category.uuid}/questions`,
                    {
                      params: {
                        language: "english",
                        shuffle: true,
                      },
                    }
                  );

                  if (
                    questionsResponse.data.success &&
                    questionsResponse.data.data.questions.length > 0
                  ) {
                    setQuizData(questionsResponse.data.data);
                    setTimeRemaining(
                      questionsResponse.data.data.questions.length * 90
                    );
                    questionsFound = true;
                    break;
                  }
                } catch (err) {
                  continue; // Try next category
                }
              }
            }

            if (!questionsFound) {
              toast.error("No questions found in this test series.");
              setIsLoading(false);
              return;
            }
          }
        } catch (seriesError: any) {
          // If both approaches fail, show the original error
          throw categoryError;
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch quiz questions:", error);

      // Handle authentication errors
      if (error?.response?.status === 401) {
        console.log("❌ 401 Authentication error - redirecting to login");
        toast.error("Authentication required. Please log in again.");
        window.location.href = "/login";
        return;
      }

      // Handle access denied errors
      if (error?.response?.status === 403) {
        console.log("❌ 403 Access denied error");
        toast.error("Access denied. This quiz requires a subscription.");
        return;
      }

      toast.error("Failed to load quiz questions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkForReview = () => {
    setMarkedQuestions((prev) => ({
      ...prev,
      [currentQuestionIndex]: !prev[currentQuestionIndex],
    }));
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResults) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (!quizData) return;

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      if (
        Object.values(markedQuestions).filter((value) => value === true).length
      ) {
        setShowReviewModal(true);
      } else {
        handleSubmitQuiz();
      }
    }
  };

  const handleReviewAndSubmit = () => {
    if (
      Object.values(markedQuestions).filter((value) => value === true).length
    ) {
      setShowReviewModal(true);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // State to store backend-calculated results
  const [backendResults, setBackendResults] = useState<{
    score: number;
    percentage: number;
    finalScore: number;
    negativeMarkingEnabled: boolean;
    negativeMarks: number;
  } | null>(null);

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      // Prepare answers for submission
      const answers = Object.entries(selectedAnswers).map(
        ([questionIndex, selectedOption]) => ({
          questionId: quizData?.questions[parseInt(questionIndex)]?.id,
          selectedOption: selectedOption,
          isCorrect:
            selectedOption ===
            quizData?.questions[parseInt(questionIndex)]?.correct_answer,
          timeSpent: 60, // Default time per question
        })
      );

      // Submit to backend API
      console.log("Submitting quiz to backend...", {
        testId: uuid,
        answers: answers,
        totalTimeSpent: Math.max(
          0,
          (quizData?.questions.length || 0) * 90 - timeRemaining
        ),
      });

      // Use the simple quiz submission API
      const submitResponse = await api.post(`/quiz/submit`, {
        userId: localStorage.getItem("mocktail_user")
          ? JSON.parse(localStorage.getItem("mocktail_user")!).uuid
          : `quiz-user-${Date.now()}`,
        testSeriesId: uuid, // Treat uuid as test series ID (to match leaderboard expectation)
        answers: answers,
        totalTimeSpent: Math.max(
          0,
          (quizData?.questions.length || 0) * 90 - timeRemaining
        ),
      });

      console.log("Quiz submission response:", submitResponse.data);

      if (submitResponse.data.success) {
        // Store backend-calculated results
        const data = submitResponse.data.data;
        setBackendResults({
          score: data.correctAnswers,
          percentage: data.percentage,
          finalScore: data.finalScore || data.score,
          negativeMarkingEnabled: data.negativeMarkingEnabled || false,
          negativeMarks: data.negativeMarksDeducted || 0,
        });

        console.log("✅ Using backend-calculated results:", {
          percentage: data.percentage,
          finalScore: data.finalScore,
          negativeMarking: data.negativeMarkingEnabled,
        });

        toast.success("Quiz submitted successfully!");
        // Only show results if API call succeeds
        setShowResults(true);
        setQuizStarted(false);
      } else {
        console.error("Quiz submission failed:", submitResponse.data.message);
        toast.error("Failed to submit quiz. Please try again.");
        return; // Don't show results if submission fails
      }
    } catch (error: any) {
      console.error("Error submitting quiz:", error);
      toast.error(
        "Failed to submit quiz. Please check your connection and try again."
      );
      return; // Don't show results if submission fails
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScore = () => {
    if (!quizData) return { score: 0, percentage: 0 };

    let correctCount = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correctCount++;
      }
    });

    const percentage = Math.round(
      (correctCount / quizData.questions.length) * 100
    );
    return { score: correctCount, percentage };
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-600">No quiz questions found.</p>
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

  const currentQuestion = quizData.questions[currentQuestionIndex];

  // Use backend results if available, otherwise fallback to local calculation
  const getDisplayResults = () => {
    if (showResults && backendResults) {
      return {
        score: backendResults.score,
        percentage: backendResults.percentage,
        finalScore: backendResults.finalScore,
      };
    }
    return showResults
      ? calculateScore()
      : { score: 0, percentage: 0, finalScore: 0 };
  };

  const { score, percentage, finalScore } = getDisplayResults();

  // Pre-quiz screen
  if (!quizStarted && !showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 mr-3"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Quiz Ready</h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {quizData.category.name}
          </h2>

          {quizData.category.description && (
            <p className="text-gray-600 mb-6">
              {quizData.category.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-6 mb-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {quizData.questions.length}
              </div>
              <div className="text-sm text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm text-gray-500">Time Limit</div>
            </div>
          </div>

          <button
            onClick={startQuiz}
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quiz Results
          </h1>
          <p className="text-gray-600">{quizData.category.name}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center mb-8">
          <div className="text-6xl font-bold mb-4">
            <span
              className={
                percentage >= 70
                  ? "text-green-600"
                  : percentage >= 50
                  ? "text-yellow-600"
                  : "text-red-600"
              }
            >
              {percentage}%
            </span>
          </div>

          <p className="text-xl text-gray-900 mb-2">
            {score} out of {quizData.questions.length} correct
          </p>

          {/* Show negative marking info if enabled */}
          {backendResults?.negativeMarkingEnabled && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-medium">
                ⚠️ Negative Marking Applied
              </p>
              <p className="text-sm text-amber-700 mt-1">
                Final Score: {backendResults.finalScore}
                {backendResults.negativeMarks > 0 && (
                  <span>
                    {" "}
                    (minus {backendResults.negativeMarks} negative marks)
                  </span>
                )}
              </p>
            </div>
          )}

          <p className="text-gray-600 mb-6 mt-4">
            {percentage >= 70
              ? "Excellent work!"
              : percentage >= 50
              ? "Good effort!"
              : "Keep practicing!"}
          </p>

          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                // Navigate to solutions page
                navigate(`/tests/solutions/${uuid}`, {
                  state: {
                    categoryName: quizData.category.name,
                    userAnswers: selectedAnswers,
                    score,
                    percentage,
                  },
                });
              }}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              View Solutions
            </button>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setSelectedAnswers({});
                setTimeRemaining(quizData.questions.length * 90);
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retake Quiz
            </button>
            <button
              onClick={() => {
                // Navigate to leaderboard for this category
                navigate(`/tests/leaderboard/${uuid}`, {
                  state: {
                    categoryName: quizData.category.name,
                    userScore: score,
                    totalQuestions: quizData.questions.length,
                  },
                });
              }}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Leaderboard
            </button>
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Answer Review
          </h3>
          <div className="space-y-4">
            {quizData.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct_answer;

              return (
                <div
                  key={question.uuid}
                  className="border-b border-gray-100 pb-4 last:border-b-0"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {isCorrect ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        {index + 1}. {question.question_text}
                      </p>
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-gray-600">Your answer:</span>{" "}
                          <span
                            className={
                              isCorrect ? "text-green-600" : "text-red-600"
                            }
                          >
                            {userAnswer
                              ? `${userAnswer} - ${
                                  question.options[
                                    userAnswer as keyof typeof question.options
                                  ]
                                }`
                              : "Not answered"}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p>
                            <span className="text-gray-600">
                              Correct answer:
                            </span>{" "}
                            <span className="text-green-600">
                              {question.correct_answer} -{" "}
                              {
                                question.options[
                                  question.correct_answer as keyof typeof question.options
                                ]
                              }
                            </span>
                          </p>
                        )}
                        {question.explanation && (
                          <p className="text-gray-600 italic">
                            {question.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-xl font-semibold text-gray-900">
                {quizData.category.name}
              </h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of{" "}
                {quizData.questions.length}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span
                className={
                  timeRemaining < 300 ? "text-red-600 font-medium" : ""
                }
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            <button
              onClick={() => setShowNavigator(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Question Navigator"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={handleReviewAndSubmit}
              // onClick={() => setShowReviewModal(true)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentQuestionIndex + 1) / quizData.questions.length) * 100
                }%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleMarkForReview}
              className={`px-6 py-2 rounded-lg border font-medium transition-colors ${
                markedQuestions[currentQuestionIndex]
                  ? "bg-yellow-100 border-yellow-400 text-yellow-700 hover:bg-yellow-200"
                  : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {markedQuestions[currentQuestionIndex]
                ? "Marked As Review"
                : "Mark As Review"}
            </button>
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {currentQuestionIndex === quizData.questions.length - 1
                ? "Submit"
                : "Next"}
            </button>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl border border-gray-100 p-8 mb-6">
          <h2 className="text-xl font-medium text-gray-900 mb-6">
            {currentQuestion.question_text}
          </h2>

          <div className="space-y-3">
            {["A", "B", "C", "D"].map((option) => {
              const optionText =
                currentQuestion.options[
                  option as keyof typeof currentQuestion.options
                ];
              const isSelected =
                selectedAnswers[currentQuestionIndex] === option;

              return (
                <button
                  key={option}
                  onClick={() => handleAnswerSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center">
                    <span
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium mr-3 ${
                        isSelected
                          ? "border-blue-500 bg-blue-500 text-white"
                          : "border-gray-300 text-gray-600"
                      }`}
                    >
                      {option}
                    </span>
                    <span>{optionText}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center">
          <div className="flex space-x-2">
            {quizData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded text-sm font-medium ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 text-white"
                    : selectedAnswers[index]
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Navigator Modal */}
        {showNavigator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h3 className="text-xl font-semibold text-gray-900">
                  Question Navigator
                </h3>
                <button
                  onClick={() => setShowNavigator(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Question Grid */}
                <div className="grid grid-cols-8 gap-3 mb-8">
                  {quizData.questions.map((question, index) => {
                    const isCurrentQuestion = index === currentQuestionIndex;
                    const isAnswered = selectedAnswers.hasOwnProperty(index);

                    // Determine question status
                    let statusClass = "";

                    if (isCurrentQuestion) {
                      statusClass =
                        "border-blue-500 border-3 bg-blue-100 text-blue-800 ring-2 ring-blue-200";
                    } else if (isAnswered) {
                      statusClass =
                        "bg-green-50 text-green-700 border-2 border-green-200 hover:bg-green-100";
                    } else {
                      statusClass =
                        "bg-gray-50 text-gray-500 border-2 border-gray-200 hover:bg-gray-100";
                    }

                    return (
                      <button
                        key={question.id}
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          setShowNavigator(false);
                        }}
                        className={`w-14 h-14 rounded-xl flex items-center justify-center text-sm font-bold transition-all hover:scale-110 transform ${statusClass}`}
                        title={`Question ${index + 1} ${
                          isAnswered ? "(Answered)" : "(Not Answered)"
                        }`}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Language:
                  </h4>
                  <select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as "english" | "gujarati")
                    }
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm w-full"
                  >
                    <option value="english">English</option>
                    <option value="gujarati">Gujarati</option>
                  </select>
                </div>

                {/* Legend */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 mb-4">Legend:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-lg bg-blue-100 border-2 border-blue-500 ring-1 ring-blue-200"></div>
                      <span className="text-gray-700">Current Question</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-lg bg-green-50 border-2 border-green-200"></div>
                      <span className="text-gray-700">Answered</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-lg bg-gray-50 border-2 border-gray-200"></div>
                      <span className="text-gray-700">Not Answered</span>
                    </div>
                  </div>
                </div>

                {/* Progress Statistics */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Quiz Progress
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {quizData.questions.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Total Questions
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {Object.keys(selectedAnswers).length}
                      </div>
                      <div className="text-sm text-gray-600">Answered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {quizData.questions.length -
                          Object.keys(selectedAnswers).length}
                      </div>
                      <div className="text-sm text-gray-600">Remaining</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${
                          timeRemaining < 300 ? "text-red-600" : "text-blue-600"
                        }`}
                      >
                        {formatTime(timeRemaining)}
                      </div>
                      <div className="text-sm text-gray-600">Time Left</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Completion Progress</span>
                      <span>
                        {Math.round(
                          (Object.keys(selectedAnswers).length /
                            quizData.questions.length) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (Object.keys(selectedAnswers).length /
                              quizData.questions.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowNavigator(false)}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Continue Quiz
                    </button>
                    <button
                      onClick={() => {
                        handleSubmitQuiz();
                        setShowNavigator(false);
                      }}
                      className="flex-1 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      disabled={
                        Object.keys(selectedAnswers).length === 0 ||
                        isSubmitting
                      }
                    >
                      {isSubmitting && (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {isSubmitting
                        ? "Submitting..."
                        : `Submit Quiz (${
                            Object.keys(selectedAnswers).length
                          }/${quizData.questions.length})`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showReviewModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Review Your Answers</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {quizData.questions.map((q, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isMarked = markedQuestions[index];

                  if (!isMarked) return <></>;
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestionIndex(index); // jump to question
                        setShowReviewModal(false); // close modal
                      }}
                      className="w-full text-left border-b border-gray-200 pb-3 last:border-b-0 hover:bg-gray-50 rounded-lg px-2"
                    >
                      <p className="font-medium flex items-center justify-between">
                        <span>
                          {index + 1}. {q.question_text}
                        </span>
                        {isMarked && (
                          <span className="ml-2 text-yellow-600">(Marked)</span>
                        )}
                      </p>
                      <p className="text-sm">
                        Your Answer:{" "}
                        <span
                          className={
                            userAnswer === q.correct_answer
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {userAnswer
                            ? `${userAnswer} - ${
                                q.options[userAnswer as keyof typeof q.options]
                              }`
                            : "Not Answered"}
                        </span>
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    handleSubmitQuiz();
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeTestPage;
