import React from 'react';
import { useParams } from 'react-router-dom';

const TestResultsPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Results</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Test ID: {id}</p>
        <p className="text-gray-500 mt-4">Results page is under development.</p>
      </div>
    </div>
  );
};

export default TestResultsPage;