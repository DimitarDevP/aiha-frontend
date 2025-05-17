import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../store";
import { apiConfig } from "../../constants";
import { Card } from "./beAwareSlice";

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

// Create a new card
export const createCard = createAsyncThunk(
  "card/create",
  async (cardData: Omit<Card, "id">, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await apiClient.post<Card>("/cards", cardData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch all cards
export const fetchCards = createAsyncThunk(
  "card/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await apiClient.get<Card[]>("/cards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch a card by ID
export const fetchCardById = createAsyncThunk(
  "card/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await apiClient.get<Card>(`/cards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Update a card
export const updateCard = createAsyncThunk(
  "card/update",
  async (
    { id, cardData }: { id: string; cardData: Partial<Card> },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await apiClient.put<Card>(`/cards/${id}`, cardData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete a card
export const deleteCard = createAsyncThunk(
  "card/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("access_token");
      await apiClient.delete(`/cards/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; // Return the ID for the reducer to filter it out
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);