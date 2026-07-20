import React, { useEffect, useState } from 'react';
import { TrophyIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '../../store';
import { rankingsService } from '../../services/rankings';
import type { LeaderboardEntry } from '../../services/rankings';
import toast from 'react-hot-toast';

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const RankingsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await rankingsService.getGlobalLeaderboard(50);
        setEntries(data);
      } catch (error) {
        console.error('Failed to load rankings:', error);
        toast.error('Failed to load rankings');
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
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Rankings</h1>
        <p className="text-gray-600">Top performers across all tests</p>
      </div>

      {entries.length === 0 ? (
        <div className="card p-12 text-center">
          <TrophyIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No rankings yet</h3>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="divide-y divide-gray-100">
            {entries.map((entry) => {
              const isMe = user && entry.name === user.username;
              return (
                <div
                  key={`${entry.userId}-${entry.rank}`}
                  className={`flex items-center justify-between px-5 py-3 ${isMe ? 'bg-primary-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 text-center font-semibold text-gray-700">
                      {MEDAL[entry.rank] || entry.rank}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-sm font-semibold text-primary-700">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {entry.name} {isMe && <span className="text-primary-600">(You)</span>}
                      </p>
                      <p className="text-xs text-gray-500">{entry.testsCompleted} tests completed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{entry.totalScore} pts</p>
                    {entry.percentage != null && <p className="text-xs text-gray-500">{entry.percentage}%</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RankingsPage;
