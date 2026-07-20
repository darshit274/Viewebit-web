import { api } from './api';

export interface LiveSession {
  uuid: string;
  title: string;
  description?: string;
  scheduled_start: string;
  scheduled_end?: string | null;
  meeting_provider: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  course?: { id: number; uuid: string; title: string } | null;
  educator: { id: string; name: string; avatar?: string | null };
}

export const liveSessionsService = {
  getUpcoming: async (): Promise<LiveSession[]> => {
    const response = await api.get('/live-sessions');
    return response.data.data;
  },

  join: async (uuid: string): Promise<{ meeting_url: string; is_embeddable: boolean }> => {
    const response = await api.post(`/live-sessions/${uuid}/join`);
    return response.data.data;
  },

  leave: async (uuid: string) => {
    const response = await api.post(`/live-sessions/${uuid}/leave`);
    return response.data;
  },
};
