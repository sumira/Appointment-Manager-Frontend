import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

interface User {
    id: number;
    name: string;
    email: string;
}

interface LoginResponse {
    message: string;
    token: string;
    user: User;
}

interface SignupResponse {
    token: string;
    id: number;
    name: string;
    email: string;
}

export interface Appointment {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface BookedSlot {
    date: string;
    startTime: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', { email, password });
    return response.data;
};

export const signup = async (name: string, email: string, password: string): Promise<SignupResponse> => {
    const response = await api.post<SignupResponse>('/api/auth/signup', { name, email, password });
    return response.data;
};

export const getAppointments = async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/api/appointments/user-appointments');
    return response.data;
};

export const createAppointment = async (data: { date: string; startTime: string; endTime: string }): Promise<Appointment> => {
    const response = await api.post('/api/appointments/create-appointment', data);
    return response.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
    await api.delete(`/api/appointments/delete-appointment/${id}`);
};

export const getBookedSlots = async (): Promise<BookedSlot[]> => {
    const response = await api.get<BookedSlot[]>('/api/appointments/booked-slots');
    return response.data;
};

export default api;