import api from '../utils/api';
import { ExpenseSummary, CategoryAnalytics, SubCategoryAnalytics, DateAnalytics } from '../types';

export const analyticsService = {
    async getSummary(params?: {
        category?: string;
        sub_category?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<ExpenseSummary> {
        const response = await api.get<ExpenseSummary>('/analytics/summary', { params });
        return response.data;
    },

    async getByCategory(params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<CategoryAnalytics[]> {
        const response = await api.get<CategoryAnalytics[]>('/analytics/by-category', { params });
        return response.data;
    },

    async getBySubCategory(params?: {
        category?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<SubCategoryAnalytics[]> {
        const response = await api.get<SubCategoryAnalytics[]>('/analytics/by-subcategory', { params });
        return response.data;
    },

    async getByDate(params?: {
        grouping?: 'day' | 'week' | 'month' | 'year';
        category?: string;
        sub_category?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<DateAnalytics[]> {
        const response = await api.get<DateAnalytics[]>('/analytics/by-date', { params });
        return response.data;
    },
};
