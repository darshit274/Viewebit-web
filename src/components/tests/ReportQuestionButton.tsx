import React, { useState } from 'react';
import { Flag } from 'lucide-react';
import ReportQuestionModal from './ReportQuestionModal';

interface ReportQuestionButtonProps {
  questionId: number;
  questionNumber: number;
  userAnswer?: string;
}

const ReportQuestionButton: React.FC<ReportQuestionButtonProps> = ({
  questionId,
  questionNumber,
  userAnswer,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all border border-gray-300 hover:border-red-300 group"
        title="Report an issue with this question"
      >
        <Flag className="h-4 w-4 group-hover:scale-110 transition-transform" />
        <span className="font-medium">Report</span>
      </button>

      {showModal && (
        <ReportQuestionModal
          questionId={questionId}
          questionNumber={questionNumber}
          userAnswer={userAnswer}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default ReportQuestionButton;
