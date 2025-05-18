import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { RootState } from "../../store";
import { apiConfig } from "../../constants";
import { Card } from "./beAwareSlice";

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

// European cities with coordinates for air quality alerts
const EUROPEAN_LOCATIONS = [
  { lat: 42.0006, lng: 21.4095, city: 'Centar, Skopje' },
  { lat: 42.0026, lng: 21.4362, city: 'Aerodrom, Skopje' },
  { lat: 42.0056, lng: 21.3958, city: 'Karpoš, Skopje' },
  { lat: 41.9981, lng: 21.4254, city: 'Debar Maalo, Skopje' },
  { lat: 42.0167, lng: 21.4089, city: 'Čair, Skopje' },
  { lat: 42.0090, lng: 21.4600, city: 'Novo Lisiche, Skopje' },
  { lat: 42.0131, lng: 21.3921, city: 'Zdanec, Skopje' },
  { lat: 41.9861, lng: 21.4243, city: 'Kisela Voda, Skopje' },
  { lat: 42.0188, lng: 21.3764, city: 'Gjorche Petrov, Skopje' },
  { lat: 41.9980, lng: 21.3855, city: 'Vodno, Skopje' },
  { lat: 42.0211, lng: 21.4294, city: 'Butel, Skopje' },
  { lat: 42.0001, lng: 21.4433, city: 'Novo Maalo, Skopje' },
  { lat: 42.0017, lng: 21.4121, city: 'Partizanska, Skopje' },
  { lat: 41.9993, lng: 21.4170, city: 'Mavrovka, Skopje' },
  { lat: 42.0030, lng: 21.4470, city: 'Lisiche, Skopje' }
];


// Get a random European location with fixed intensity for heatmap
const getRandomEuropeanLocation = () => {
  const randomIndex = Math.floor(Math.random() * EUROPEAN_LOCATIONS.length);
  const location = EUROPEAN_LOCATIONS[randomIndex];
  return {
    lat: location.lat,
    lng: location.lng,
    city: location.city,
    intensity: 0.6 // Fixed intensity as requested
  };
};

// Set alert color based on alert level
const getAlertColor = (alertLevel: string): Card['color'] => {
  switch (alertLevel?.toLowerCase()) {
    case 'high':
      return 'red';
    case 'medium':
      return 'yellow';
    case 'low':
      return 'blue';
    default:
      return 'default';
  }
};

// Get an appropriate icon based on alert type
const getAlertIcon = (alertType: string): string => {
  if (!alertType) return '⚠️';
  
  const type = alertType.toLowerCase();
  if (type.includes('carbon monoxide') || type.includes('co')) return '💨';
  if (type.includes('air quality')) return '🌬️';
  if (type.includes('pollution')) return '🏭';
  if (type.includes('warning')) return '⚠️';
  if (type.includes('unavailable')) return '❓';
  
  return '📊';
};

// Transform air quality alert data into card format
const transformAlertToCard = (alert: any): Card => {
  try {
    // Handle both string and object formats of ai_response
    const aiResponse = typeof alert.ai_response === 'string'
      ? JSON.parse(alert.ai_response)
      : alert.ai_response;

    // Get a random location if none is specified in the alert
    const randomLocation = getRandomEuropeanLocation();
    
    // Extract location from the alert or use random
    const location = {
      lat: aiResponse.location?.lat || randomLocation.lat,
      lng: aiResponse.location?.lng || randomLocation.lng,
      intensity: 0.6, // Fixed intensity for consistency
      city: aiResponse.location || randomLocation.city
    };

    // Extract CO data if available
    let details = aiResponse.details || '';
    if (aiResponse.details?.CO) {
      details = `Carbon Monoxide (CO): ${aiResponse.details.CO}`;
    }

    // Determine title based on available data
    const title = aiResponse.type || 'Air Quality Alert';
    
    // Create a summary from short_description or generate one
    const summary = aiResponse.short_description || 
                   `${aiResponse.alert_level || 'Unknown'} level alert for ${location.city}`;

    // Get appropriate color based on alert_level
    const color = getAlertColor(aiResponse.alert_level);
    
    // Get appropriate icon
    const icon = getAlertIcon(aiResponse.type);

    return {
      id: alert.id.toString(),
      title,
      summary,
      details,
      recommendations: Array.isArray(aiResponse.recommendations) 
        ? aiResponse.recommendations 
        : ['Monitor local air quality updates'],
      color,
      icon,
      location,
      date: alert.datetime || new Date().toISOString()
    };
  } catch (e) {
    console.error('Error parsing ai_response:', e);
    const randomLocation = getRandomEuropeanLocation();
    
    // Fallback to default values if parsing fails
    return {
      id: alert.id.toString(),
      title: 'Air Quality Alert',
      summary: `Alert data for ${randomLocation.city}`,
      details: 'Air quality data could not be processed correctly.',
      recommendations: ['Check local air quality reports for accurate information'],
      color: 'default',
      icon: '⚠️',
      location: {
        lat: randomLocation.lat,
        lng: randomLocation.lng,
        intensity: 0.6
      },
      date: alert.datetime || new Date().toISOString()
    };
  }
};

// Create a new alert
export const createCard = createAsyncThunk(
  "card/create",
  async (cardData: Omit<Card, "id">, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.userAuth.access_token;

      if (!token || token.split(".").length !== 3) {
        return rejectWithValue("Invalid or missing access token.");
      }

      const location = cardData.location || getRandomEuropeanLocation();

      const aiResponse = {
        title: cardData.title,
        type: cardData.title,
        short_description: cardData.summary,
        details: cardData.details,
        recommendations: cardData.recommendations,
        alert_level: cardData.color === 'red' ? 'high' : 
                     cardData.color === 'yellow' ? 'medium' : 'low',
        icon: cardData.icon,
      };

      const response = await apiClient.post("/awareness/crud", {
        ai_response: JSON.stringify(aiResponse)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return transformAlertToCard(response.data);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch all alerts
export const fetchCards = createAsyncThunk(
  "card/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.userAuth.access_token;

      if (!token || token.split(".").length !== 3) {
        return rejectWithValue("Invalid or missing access token.");
      }

      const response = await apiClient.get("/awareness/crud", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Transform each alert in the response to a card
      return response.data.awareness.map(transformAlertToCard);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Fetch an alert by ID
export const fetchCardById = createAsyncThunk(
  "card/fetchById",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.userAuth.access_token;

      if (!token || token.split(".").length !== 3) {
        return rejectWithValue("Invalid or missing access token.");
      }

      const response = await apiClient.get(`/awareness/crud/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return transformAlertToCard(response.data);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Update an alert
export const updateCard = createAsyncThunk(
  "card/update",
  async (
    { id, cardData }: { id: string; cardData: Partial<Card> },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const token = state.userAuth.access_token;

      if (!token || token.split(".").length !== 3) {
        return rejectWithValue("Invalid or missing access token.");
      }

      const location = cardData.location || getRandomEuropeanLocation();

      const aiResponse = {
        title: cardData.title,
        type: cardData.title,
        short_description: cardData.summary,
        details: cardData.details,
        recommendations: cardData.recommendations,
        alert_level: cardData.color === 'red' ? 'high' : 
                    cardData.color === 'yellow' ? 'medium' : 'low',
        icon: cardData.icon,
      };

      const response = await apiClient.put(`/awareness/crud/${id}`, {
        ai_response: JSON.stringify(aiResponse)
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return transformAlertToCard(response.data);
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Delete an alert
export const deleteCard = createAsyncThunk(
  "card/delete",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.userAuth.access_token;

      if (!token || token.split(".").length !== 3) {
        return rejectWithValue("Invalid or missing access token.");
      }

      await apiClient.delete(`/awareness/crud/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);