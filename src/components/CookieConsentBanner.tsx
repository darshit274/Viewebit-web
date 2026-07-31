import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Any future analytics/tracking script must check
// window.localStorage.getItem('viewebit_cookie_consent') === 'accepted'
// before loading — this is the hook that makes that check possible.
const STORAGE_KEY = 'viewebit_cookie_consent';

const CookieConsentBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'rejected') => {
    window.localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] bg-gray-900 text-white px-4 py-4 sm:px-6 shadow-2xl">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-gray-200 flex-1">
          We use browser storage to keep you signed in and remember your preferences, and our payment provider sets cookies during checkout. See our{' '}
          <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link> for details.
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => handleChoice('rejected')}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-600 hover:bg-gray-800"
          >
            Reject
          </button>
          <button
            onClick={() => handleChoice('accepted')}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary-600 hover:bg-primary-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
