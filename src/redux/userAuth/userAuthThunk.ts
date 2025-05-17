import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../store";
import { apiConfig, getApiUrl } from "../../constants";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  date_of_birth?: string;
  height?: number;
  weight?: number;
  illnesses?: string;
  allergies?: string;
  addictions?: string;
  family_history?: string;
  location_lat: number;
  location_lng: number;
  [key: string]: any;
}

interface UpdateUserData {
  date_of_birth?: string;
  height?: number | null;
  weight?: number | null;
  illnesses?: string;
  allergies?: string;
  addictions?: string;
  family_history?: string;
  location_lat?: number;
  location_lng?: number;
  [key: string]: any;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    isVerified: boolean;
    date_of_birth?: string;
    height?: number;
    weight?: number;
    illnesses?: string;
    allergies?: string;
    addictions?: string;
    family_history?: string;
    location_lat?: number;
    location_lng?: number;
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
      const formData = new FormData();
      formData.append("email", credentials.email);
      formData.append("password", credentials.password);

      const response = await apiClient.post<AuthResponse>("/users/auth/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Explicitly set as form-data
        },
      });
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
      const formData = new FormData();

      // Append required fields
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      formData.append("location_lat", String(userData.location_lat));
      formData.append("location_lng", String(userData.location_lng));

      // Append optional fields if they exist
      if (userData.date_of_birth) formData.append("date_of_birth", userData.date_of_birth);
      if (userData.height) formData.append("height", String(userData.height));
      if (userData.weight) formData.append("weight", String(userData.weight));
      if (userData.illnesses) formData.append("illnesses", userData.illnesses);
      if (userData.allergies) formData.append("allergies", userData.allergies);
      if (userData.addictions) formData.append("addictions", userData.addictions);
      if (userData.family_history) formData.append("family_history", userData.family_history);

      const response = await apiClient.post<{ message: string }>("/users/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateUserData = createAsyncThunk(
  "userAuth/updateUserProfile",
  async (updatedData: UpdateUserData, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.userAuth.access_token;
      const userId = state.userAuth.user.id;

      if (!userId) {
        throw new Error("User ID is missing");
      }

      const formData = new FormData();

      // Add required ID field
      formData.append("id", userId);

      // Add the other updatable fields
      Object.entries(updatedData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const response = await apiClient.put<{ user: any }>(
        "/users/crud", // This matches your crud route
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.user;
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