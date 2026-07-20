import { api } from './api';

export interface Certificate {
  uuid: string;
  certificate_number: string;
  verification_code: string;
  pdf_url?: string | null;
  issued_at: string;
  course: { id: number; uuid: string; title: string; thumbnail_url?: string | null };
}

export const certificatesService = {
  getMyCertificates: async (): Promise<Certificate[]> => {
    const response = await api.get('/certificates');
    return response.data.data;
  },
};
