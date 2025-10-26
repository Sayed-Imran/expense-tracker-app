import api from '../utils/api';
import { Category, SubCategory } from '../types';

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        const response = await api.get<Category[]>('/categories/');
        return response.data;
    },

    async createCategory(name: string): Promise<{ message: string; id: string }> {
        const response = await api.post('/categories/', { name });
        return response.data;
    },

    async updateCategory(id: string, name: string): Promise<{ message: string }> {
        const response = await api.put(`/categories/${id}`, { name });
        return response.data;
    },

    async deleteCategory(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    async getSubCategories(): Promise<SubCategory[]> {
        const response = await api.get<SubCategory[]>('/categories/subcategories');
        return response.data;
    },

    async createSubCategory(name: string, category_id?: string): Promise<{ message: string; id: string }> {
        const response = await api.post('/categories/subcategories', { name, category_id });
        return response.data;
    },

    async updateSubCategory(id: string, name: string, category_id?: string): Promise<{ message: string }> {
        const response = await api.put(`/categories/subcategories/${id}`, { name, category_id });
        return response.data;
    },

    async deleteSubCategory(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/categories/subcategories/${id}`);
        return response.data;
    },
};
