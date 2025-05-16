import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../store";
import { apiConfig, getApiUrl } from "../../constants";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  [key: string]: any;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isVerified: boolean;
  };
  access_token: string;
  refresh_token: string;
}

// Create axios instance with config
const apiClient = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: apiConfig.timeout,
  headers: apiConfig.headers
});

// Helper for error handling
const handleApiError = (error: unknown): string => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || 
         axiosError.message || 
         'An unexpected error occurred';
};

export const loginUser = createAsyncThunk(
  "userAuth/loginUser",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const registerUser = createAsyncThunk(
  "userAuth/registerUser",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<{ user: AuthResponse['user'] }>(
        "/auth/register", 
        userData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "userAuth/logoutUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.userAuth.access_token;
      
      await apiClient.post(
        "/auth/logout", 
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const refreshToken = createAsyncThunk(
  "userAuth/refreshToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const refreshToken = state.userAuth.refresh_token;
      
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await apiClient.post<{
        access_token: string;
        refresh_token: string;
      }>("/auth/refresh", {
        refresh_token: refreshToken
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
