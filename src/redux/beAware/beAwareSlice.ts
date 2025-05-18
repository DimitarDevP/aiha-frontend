import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import {
  createCard,
  fetchCards,
  fetchCardById,
  updateCard,
  deleteCard,
} from "./beAwareThunk";

type CardStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

// Define initial mock cards for air quality alerts with proper European locations
const mockCards: Card[] = [
  {
    id: '1',
    title: 'Carbon Monoxide Alert',
    summary: 'High levels of carbon monoxide detected in central Paris',
    details: 'Carbon monoxide levels have reached dangerous levels in central Paris. Sensitive groups should take precautions.',
    recommendations: [
      'Stay indoors when possible',
      'Use air purifiers if available',
      'Limit outdoor exercise',
      'Seek medical attention if experiencing symptoms'
    ],
    color: 'red',
    icon: '💨',
    location: { lat: 48.8566, lng: 2.3522, intensity: 0.6 }, // Paris, France
    date: '2025-05-18T09:30:00Z'
  },
  {
    id: '2',
    title: 'Air Quality Warning',
    summary: 'Moderate air pollution levels in Rome',
    details: 'Air quality index shows moderate pollution levels across Rome. CO levels are elevated but below dangerous thresholds.',
    recommendations: [
      'Consider limiting prolonged outdoor exposure',
      'Keep windows closed during peak traffic hours',
      'Monitor symptoms if you have respiratory conditions',
      'Check air quality updates regularly'
    ],
    color: 'yellow',
    icon: '🌬️',
    location: { lat: 41.9028, lng: 12.4964, intensity: 0.6 }, // Rome, Italy
    date: '2025-05-17T14:15:00Z'
  },
  {
    id: '3',
    title: 'Low Air Pollution Day',
    summary: 'Good air quality reported across Berlin',
    details: 'Air quality measurements show low pollution levels in Berlin today. Carbon monoxide levels are well within safe limits.',
    recommendations: [
      'Enjoy outdoor activities as normal',
      'A good day for outdoor exercise',
      'No special precautions needed',
      'Perfect weather for ventilating indoor spaces'
    ],
    color: 'blue',
    icon: '✅',
    location: { lat: 52.5200, lng: 13.4050, intensity: 0.6 }, // Berlin, Germany
    date: '2025-05-18T08:45:00Z'
  },
  {
    id: '4',
    title: 'Carbon Monoxide Danger',
    summary: 'Elevated CO levels in industrial areas of Madrid',
    details: 'Monitoring stations have detected dangerous carbon monoxide concentrations near Madrid\'s industrial districts.',
    recommendations: [
      'Avoid industrial zones until levels decrease',
      'Keep children and elderly indoors',
      'Use air purifiers if available',
      'Report symptoms like headache, dizziness, or nausea immediately'
    ],
    color: 'red',
    icon: '⚠️',
    location: { lat: 40.4168, lng: -3.7038, intensity: 0.6 }, // Madrid, Spain
    date: '2025-05-18T07:20:00Z'
  },
  {
    id: '5',
    title: 'Air Quality Alert',
    summary: 'General air quality warning for Prague',
    details: 'Multiple pollutants including carbon monoxide have reached moderate levels in Prague due to temperature inversion.',
    recommendations: [
      'Sensitive groups should limit outdoor exposure',
      'Use air purifiers indoors',
      'Close windows during morning and evening hours',
      'Follow updates from local environmental agencies'
    ],
    color: 'yellow',
    icon: '🏭',
    location: { lat: 50.0755, lng: 14.4378, intensity: 0.6 }, // Prague, Czech Republic
    date: '2025-05-17T16:10:00Z'
  },
  {
    id: '6',
    title: 'Air Quality Advisory',
    summary: 'Slight pollution increase in Stockholm',
    details: 'Minor elevation in air pollutants including CO detected in Stockholm city center. Levels remain within safe limits.',
    recommendations: [
      'No special precautions needed for general population',
      'Individuals with severe respiratory conditions may wish to limit prolonged outdoor activity',
      'Regular monitoring recommended',
      'Check local air quality index before planning extensive outdoor events'
    ],
    color: 'blue',
    icon: '📊',
    location: { lat: 59.3293, lng: 18.0686, intensity: 0.6 }, // Stockholm, Sweden
    date: '2025-05-18T10:30:00Z'
  },
  {
    id: '7',
    title: 'Data Collection Issue',
    summary: 'CO monitoring systems offline in London',
    details: 'Carbon monoxide monitoring equipment is currently undergoing maintenance in Greater London. Data unavailable until systems are restored.',
    recommendations: [
      'Follow standard air quality precautions',
      'Report any unusual smells or symptoms',
      'Check alternative monitoring sources if concerned',
      'System expected to be back online by tomorrow'
    ],
    color: 'default',
    icon: '❓',
    location: { lat: 51.5074, lng: -0.1278, intensity: 0.6 }, // London, UK
    date: '2025-05-18T11:45:00Z'
  }
];

export interface Card {
  id: string;
  title: string;
  summary: string;
  details: string;
  recommendations: string[];
  color: 'yellow' | 'red' | 'blue' | 'green' | 'purple' | 'default';
  icon?: string;
  location?: {
    lat: number;
    lng: number;
    intensity?: number;
    city?: string;
  };
  date?: string; // ISO 8601 date string
}

interface CardState {
  warnings: Card[];
  currentCard: Card | null;
  status: CardStatus;
  error: string | null;
}

const initialState: CardState = {
  warnings: mockCards,
  currentCard: null,
  status: 'idle',
  error: null
};

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    clearCardError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
    resetCardStatus: (state) => {
      state.status = 'idle';
    },
    setCurrentCard: (state, action: PayloadAction<Card>) => {
      state.currentCard = action.payload;
    },
    clearCurrentCard: (state) => {
      state.currentCard = null;
    },
    updateCardColor: (state, action: PayloadAction<{ id: string; color: Card['color'] }>) => {
      const { id, color } = action.payload;
      const cardIndex = state.warnings.findIndex(card => card.id === id);
      if (cardIndex !== -1) {
        state.warnings[cardIndex].color = color;
      }
      if (state.currentCard?.id === id) {
        state.currentCard.color = color;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create card cases
      .addCase(createCard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.warnings.push(action.payload);
        state.currentCard = action.payload;
      })
      .addCase(createCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch all cards cases
      .addCase(fetchCards.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure we handle the structure of the new air quality data
        state.warnings = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch card by ID cases
      .addCase(fetchCardById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCardById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentCard = action.payload;
      })
      .addCase(fetchCardById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update card cases
      .addCase(updateCard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedCardIndex = state.warnings.findIndex(card => card.id === action.payload.id);
        if (updatedCardIndex !== -1) {
          state.warnings[updatedCardIndex] = action.payload;
        }
        if (state.currentCard?.id === action.payload.id) {
          state.currentCard = action.payload;
        }
      })
      .addCase(updateCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Delete card cases
      .addCase(deleteCard.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteCard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.warnings = state.warnings.filter(card => card.id !== action.payload);
        if (state.currentCard?.id === action.payload) {
          state.currentCard = null;
        }
      })
      .addCase(deleteCard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Configure Redux persistence
const persistConfig = {
  key: 'cards',
  storage,
  whitelist: ['warnings'],
  blacklist: ['status', 'error', 'currentCard'],
  version: 1,
};

export const persistedCardReducer = persistReducer(persistConfig, cardSlice.reducer);

export const {
  clearCardError,
  resetCardStatus,
  setCurrentCard,
  clearCurrentCard,
  updateCardColor
} = cardSlice.actions;

export type { CardState };

export default cardSlice.reducer;