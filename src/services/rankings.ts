import { api } from './api';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  totalScore: number;
  testsCompleted: number;
  percentage?: number;
  avatar?: string | null;
  testSeriesName?: string;
}

export const rankingsService = {
  // Reuses the existing global leaderboard endpoint (no test_series_id filter
  // = ranked across all tests) rather than a new dedicated route.
  getGlobalLeaderboard: async (limit = 50): Promise<LeaderboardEntry[]> => {
    const response = await api.get(`/leaderboard?limit=${limit}`);
    return response.data.data;
  },
};
