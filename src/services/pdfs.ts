import { api } from './api';

export interface PdfCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  sort_order?: number;
}

export interface PdfListItem {
  id: string;
  title: string;
  description: string;
  category_id: string | null;
  file_size: number;
  download_count: number;
  view_count: number;
  access_level: 'free' | 'premium' | 'restricted';
  is_free?: boolean;
  price?: number;
  currency?: string;
  discount_percentage?: number;
  subscription_required?: boolean;
  preview_pages?: number;
  tags: string[] | null;
  is_featured: boolean;
  created_at: string;
}

export interface PdfDetail extends PdfListItem {
  updated_at: string;
}

export interface PdfSecureContent {
  id: string;
  title: string;
  content: string;
  pages: number;
}

export interface PdfAccessInfo {
  hasAccess: boolean;
  accessType: string;
  canPurchase: boolean;
  showEnrollButton: boolean;
  pdf?: PdfListItem;
  category?: PdfCategory;
  subscription?: unknown;
}

export interface GetPdfsParams {
  category_id?: string;
  search?: string;
  access_level?: 'free' | 'premium' | 'restricted';
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const pdfsService = {
  getPdfs: async (params?: GetPdfsParams): Promise<PdfListItem[]> => {
    const response = await api.get('/pdfs', { params: { ...params, limit: 100 } });
    return response.data.data;
  },

  getCategories: async (): Promise<PdfCategory[]> => {
    const response = await api.get('/pdfs/categories');
    return response.data.data;
  },

  getPdfById: async (id: string): Promise<PdfDetail> => {
    const response = await api.get(`/pdfs/${id}`);
    return response.data.data;
  },

  getSecureContent: async (id: string): Promise<PdfSecureContent> => {
    const response = await api.get(`/pdfs/${id}/secure`);
    return response.data.data;
  },

  checkAccess: async (id: string): Promise<PdfAccessInfo> => {
    const response = await api.get(`/subscription-access/pdf/${id}`);
    return response.data.data;
  },
};
