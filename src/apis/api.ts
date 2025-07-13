// src/api/api.ts

import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { BASE_URL } from './config';
import { AppVersion } from '../types';
// ---------------- TYPES ----------------

export interface Library {
  _id: string;
  name: string;
  code: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  address: string;
  profileImage: string;
  status: string;
  isPaymentRequired: boolean;
  billingAmount: number;
  lastPaidDate: string | null;
  nextDueDate: string;
  accessBlocked: boolean;
  paymentNotes: string;
  billingStartDate: string;
  createdAt: string;
  __v: number;
}

export interface LoginResponse {
  token: string;
  library: Library;
}

export interface CollectionSummary {
  cash: number;
  online: number;
  total: number;
}

export interface DashboardStats {
  totalStudents: number;
  currentMonthCollection: CollectionSummary;
  lastMonthCollection: CollectionSummary;
}

export interface Student {
  _id: string;
  name: string;
  rollNumber?: string;
  mobile: string;
  aadhar: string;
  email?: string;
  fatherName?: string;
  address?: string;
  homePhoneNumber?: string;
  shift: 'morning' | 'evening' | string;
  // libraryId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  dateOfBirth: string;
  gender: string; // <-- add this
  joiningDate?: string; // <-- add if relevant
  nextDueDate?: string; // <-- add if relevant
}

export type CreateStudentInput = Omit<
  Student,
  '_id' | '__v' | 'createdAt' | 'updatedAt' | 'rollNumber'
>;

// ---------------- AXIOS INSTANCE ----------------

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------- AUTH TOKEN HANDLER ----------------

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ---------------- AUTH & LIBRARY APIs ----------------

export const loginLibrary = async (
  adminEmail: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const response = await api.post('/api/libraries/login', {
      adminEmail,
      password,
    });

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Login failed');
    }

    return data.data as LoginResponse;
  } catch (error: any) {
    console.error('Login Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response = await api.post('/api/libraries/admin-dashboard');

    const data = response.data;

    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }

    return data.data as DashboardStats;
  } catch (error: any) {
    console.error('Dashboard Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch dashboard stats',
    );
  }
};

// ---------------- STUDENT APIs ----------------

export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await api.get('/api/student');

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch students');
    }

    return response.data.students;
  } catch (error: any) {
    console.error('Get Students Error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch students',
    );
  }
};

export const createStudent = async (
  studentData: CreateStudentInput,
): Promise<Student> => {
  try {
    const response = await api.post('/api/student', studentData);

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to create student');
    }

    return response.data.student;
  } catch (error: any) {
    console.error(
      'Create Student Error:',
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || 'Failed to create student',
    );
  }
};

// types/api.ts
export interface CreatePaymentPayload {
  libraryId: string;
  studentId: string;
  amount: number;
  discount?: number;
  paymentMethod?: 'cash' | 'online';
  fromMonth: string; // ISO date string (e.g., "2025-06-01")
  toMonth: string; // ISO date string
  nextDueDate: string; // ISO date string
  notes?: string;
}

export interface PaymentResponse {
  _id: string;
  libraryId: string;
  studentId: string;
  amount: number;
  discount: number;
  paymentMethod: 'cash' | 'online';
  fromMonth: string;
  toMonth: string;
  nextDueDate: string;
  paidDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export const createPayment = async (
  payload: CreatePaymentPayload,
): Promise<PaymentResponse> => {
  const response = await api.post<PaymentResponse>('/api/payments', payload);
  return response.data;
};

export interface DueStudent {
  name: string;
  rollNumber: string;
  mobile: string;
  shift: string;
  nextDueDate: string; // ISO string
}

export interface RecentPayment {
  name: string;
  rollNumber: string;
  paidDate: string;
  amount: number;
  paymentMethod: 'cash' | 'online';
}

export const getDueFees = async (): Promise<DueStudent[]> => {
  try {
    const response = await api.get('/api/student/due');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch due students');
    }
    return response.data.data as DueStudent[];
  } catch (error: any) {
    console.error('getDueFees error:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch due students',
    );
  }
};

// ---------------- GET RECENT PAYMENTS ----------------
export const getRecentPayments = async (): Promise<RecentPayment[]> => {
  try {
    const response = await api.get('/api/student/recentpaid');
    if (!response.data.success) {
      throw new Error(
        response.data.message || 'Failed to fetch recent payments',
      );
    }
    return response.data.data as RecentPayment[];
  } catch (error: any) {
    console.error(
      'getRecentPayments error:',
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || 'Failed to fetch recent payments',
    );
  }
};

export const getLatestAppVersion = async (): Promise<AppVersion> => {
  try {
    const response = await api.get('/api/version/latest');

    // Assuming the response is just the version object
    if (!response.data || !response.data.latestVersion) {
      throw new Error('Invalid response from version API');
    }

    return response.data as AppVersion;
  } catch (error: any) {
    console.error(
      'getLatestAppVersion error:',
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || 'Failed to fetch app version',
    );
  }
};

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export const changePassword = async (
  payload: ChangePasswordPayload,
): Promise<{ message: string }> => {
  try {
    const response = await api.post('/api/auth/library-password', payload);

    if (!response.data || !response.data.message) {
      throw new Error('Invalid response from change password API');
    }

    return response.data;
  } catch (error: any) {
    console.error(
      'changePassword error:',
      error.response?.data || error.message,
    );
    throw new Error(
      error.response?.data?.message || 'Failed to change password',
    );
  }
};

export const uploadProfileImage = async (
  image: {
    uri: string;
    name: string;
    type: string;
  },
  studentId?: string,
): Promise<{
  success: boolean;
  message: string;
  imageUrl: string;
  user: any;
}> => {
  try {
    const formData = new FormData();

    formData.append('image', {
      uri: image.uri,
      name: image.name,
      type: image.type,
    } as any);

    if (studentId) {
      formData.append('studentId', studentId);
    }

    const response: AxiosResponse = await api.post(
      '/api/upload/profile-image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error('❌ Upload error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Image upload failed');
  }
};
