import api from '../utils/api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const formData = new FormData();
        formData.append('username', credentials.username);
        formData.append('password', credentials.password);

        const response = await api.post<AuthResponse>('/auth/login', formData);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<{ message: string; username: string }> {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/auth/me');
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
    },
};
