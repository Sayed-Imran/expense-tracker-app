import api from '../utils/api';
import { Expense, ExpenseCreate } from '../types';

export const expenseService = {
    async createExpense(expense: ExpenseCreate): Promise<{ message: string; id: string }> {
        const response = await api.post('/expenses/', expense);
        return response.data;
    },

    async getExpenses(params?: {
        category?: string;
        sub_category?: string;
        start_date?: string;
        end_date?: string;
        skip?: number;
        limit?: number;
    }): Promise<Expense[]> {
        const response = await api.get<Expense[]>('/expenses/', { params });
        return response.data;
    },

    async getExpense(id: string): Promise<Expense> {
        const response = await api.get<Expense>(`/expenses/${id}`);
        return response.data;
    },

    async updateExpense(id: string, expense: Partial<ExpenseCreate>): Promise<{ message: string }> {
        const response = await api.put(`/expenses/${id}`, expense);
        return response.data;
    },

    async deleteExpense(id: string): Promise<{ message: string }> {
        const response = await api.delete(`/expenses/${id}`);
        return response.data;
    },
};
