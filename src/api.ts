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

interface Appointment {
    id: number;
    slot: string;
    userId: number;
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
    const response = await api.get<Appointment[]>('/user-appointments');
    return response.data;
};

export const createAppointment = async (slot: string): Promise<Appointment> => {
    const response = await api.post<Appointment>('/create-appointment', { slot });
    return response.data;
};

export const deleteAppointment = async (id: number): Promise<void> => {
    await api.delete(`/delete-appointment/${id}`);
};

export const getBookedSlots = async (): Promise<string[]> => {
    const response = await api.get<string[]>('/booked-slots');
    return response.data;
};

export default api;