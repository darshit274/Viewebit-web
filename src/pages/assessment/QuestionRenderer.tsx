import React from 'react';
import type { Section, AnswersMap, AnswerValue } from '../../services/assessment';

const SCALE_LABELS: Record<string, string[]> = {
  'confidence-1-5': ['Not confident', 'Slightly confident', 'Moderately confident', 'Very confident', 'Highly confident'],
  'frequency-5': ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often']
};

interface QuestionRendererProps {
  section: Section;
  answers: AnswersMap;
  onAnswer: (questionId: string, value: AnswerValue) => void;
}

const OptionButton: React.FC<{ selected: boolean; label: string; onClick: () => void }> = ({ selected, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
      selected
        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-medium'
        : 'border-gray-200 bg-white hover:border-indigo-300 text-gray-800'
    }`}
  >
    {label}
  </button>
);

const ScaleRow: React.FC<{
  rowId: string;
  label: string;
  scaleType: string;
  value: AnswerValue | undefined;
  onAnswer: (questionId: string, value: AnswerValue) => void;
}> = ({ rowId, label, scaleType, value, onAnswer }) => {
  const labels = SCALE_LABELS[scaleType] || SCALE_LABELS['confidence-1-5'];
  return (
    <div className="py-4 border-b border-gray-100 last:border-b-0">
      <p className="text-sm font-medium text-gray-800 mb-3">{label}</p>
      <div className="flex gap-2">
        {labels.map((scaleLabel, index) => {
          const scaleValue = index + 1;
          const selected = Number(value) === scaleValue;
          return (
            <button
              key={scaleValue}
              type="button"
              title={scaleLabel}
              onClick={() => onAnswer(rowId, scaleValue)}
              className={`flex-1 py-2 rounded-md text-xs font-medium border transition-colors ${
                selected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-200 bg-white text-gray-600 hover:border-indigo-300'
              }`}
            >
              {scaleValue}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ section, answers, onAnswer }) => {
  if (section.matrix && section.rows) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{section.title}</h2>
        <p className="text-sm text-gray-500 mb-4">Rate each item, then continue.</p>
        <div>
          {section.rows.map((row) => (
            <ScaleRow
              key={row.id}
              rowId={row.id}
              label={row.label}
              scaleType={section.scaleType || 'confidence-1-5'}
              value={answers[row.id]}
              onAnswer={onAnswer}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!section.questions) return null;

  return (
    <div className="space-y-8">
      {section.questions.map((question) => {
        const value = answers[question.id];

        if (question.type === 'scale-1-5') {
          return (
            <div key={question.id}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.prompt}</h2>
              <ScaleRow rowId={question.id} label="" scaleType="confidence-1-5" value={value} onAnswer={onAnswer} />
            </div>
          );
        }

        if (question.type === 'multi-select') {
          const selected = Array.isArray(value) ? (value as string[]) : [];
          return (
            <div key={question.id}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.prompt}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {question.options?.map((opt) => {
                  const isSelected = selected.includes(opt.value);
                  return (
                    <OptionButton
                      key={opt.value}
                      selected={isSelected}
                      label={opt.label}
                      onClick={() => {
                        const next = isSelected ? selected.filter((v) => v !== opt.value) : [...selected, opt.value];
                        onAnswer(question.id, next);
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        }

        return (
          <div key={question.id}>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{question.prompt}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {question.options?.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={value === opt.value}
                  label={opt.label}
                  onClick={() => onAnswer(question.id, opt.value)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionRenderer;
