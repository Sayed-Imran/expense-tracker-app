export interface User {
    username: string;
    email: string;
    created_at: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export interface Expense {
    _id: string;
    title: string;
    category: string;
    sub_category?: string;
    amount: number;
    date: string;
    comments?: string;
    created_at: string;
    updated_at: string;
}

export interface ExpenseCreate {
    title: string;
    category: string;
    sub_category?: string;
    amount: number;
    date?: string;
    comments?: string;
}

export interface Category {
    _id: string;
    name: string;
    created_at: string;
}

export interface SubCategory {
    _id: string;
    name: string;
    category_id?: string;
    created_at: string;
}

export interface ExpenseSummary {
    total_amount: number;
    count: number;
    avg_amount: number;
}

export interface CategoryAnalytics {
    category: string;
    total_amount: number;
    count: number;
    avg_amount: number;
}

export interface SubCategoryAnalytics {
    category: string;
    sub_category: string;
    total_amount: number;
    count: number;
    avg_amount: number;
}

export interface DateAnalytics {
    date: string;
    total_amount: number;
    count: number;
    avg_amount: number;
}
