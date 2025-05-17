// beAwareSlice.ts
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

// beAwareSlice.ts
// beAwareSlice.ts
const mockCards: Card[] = [
  {
    id: '1',
    title: 'Severe Storm Warning',
    summary: 'Heavy thunderstorms expected across Western Europe',
    details: 'A severe thunderstorm system is moving across Western Europe, bringing heavy rain, strong winds up to 80 km/h, and possible hail. The worst affected areas will be northern France and Benelux countries.',
    recommendations: [
      'Avoid unnecessary travel',
      'Secure outdoor objects',
      'Stay away from windows during storms',
      'Monitor local weather alerts'
    ],
    color: 'red',
    icon: '⚠️',
    location: { lat: 48.8566, lng: 2.3522, intensity: 0.9 } // Paris, France
  },
  {
    id: '2',
    title: 'Heatwave Advisory',
    summary: 'Extreme temperatures in Southern Europe',
    details: 'A prolonged heatwave is affecting Southern Europe with temperatures expected to reach 40°C in some areas. The heatwave will particularly impact Spain, Italy, and Greece.',
    recommendations: [
      'Stay hydrated',
      'Avoid outdoor activities during peak hours',
      'Check on vulnerable neighbors',
      'Use sun protection'
    ],
    color: 'yellow',
    icon: '🌡️',
    location: { lat: 41.9028, lng: 12.4964, intensity: 0.7 } // Rome, Italy
  },
  {
    id: '3',
    title: 'Flood Warning',
    summary: 'River flooding expected in Central Europe',
    details: 'Heavy rainfall has caused rivers to rise to dangerous levels in Germany, Austria, and Switzerland. Flooding is expected in low-lying areas along major river systems.',
    recommendations: [
      'Avoid flood-prone areas',
      'Prepare sandbags if in risk zone',
      'Have emergency supplies ready',
      'Follow evacuation orders if issued'
    ],
    color: 'blue',
    icon: '🌊',
    location: { lat: 52.5200, lng: 13.4050, intensity: 0.8 } // Berlin, Germany
  },
  {
    id: '4',
    title: 'Forest Fire Alert',
    summary: 'High risk of wildfires in Mediterranean region',
    details: 'Dry conditions and high temperatures have created extreme fire risk in Portugal, Spain, and southern France. Several fires are already burning out of control.',
    recommendations: [
      'Avoid outdoor burning',
      'Report any signs of fire immediately',
      'Prepare evacuation plans',
      'Follow local authority instructions'
    ],
    color: 'red',
    icon: '🔥',
    location: { lat: 38.7223, lng: -9.1393, intensity: 0.95 } // Lisbon, Portugal
  },
  {
    id: '5',
    title: 'Air Quality Warning',
    summary: 'Dangerous pollution levels in major cities',
    details: 'Industrial emissions and weather conditions have combined to create hazardous air quality in several European capitals. Sensitive groups should take precautions.',
    recommendations: [
      'Limit outdoor activities',
      'Use air purifiers if available',
      'Wear masks when outside',
      'Keep windows closed'
    ],
    color: 'purple',
    icon: '🏭',
    location: { lat: 50.0755, lng: 14.4378, intensity: 0.6 } // Prague, Czech Republic
  },
  {
    id: '6',
    title: 'Transport Disruptions',
    summary: 'Major strikes affecting public transport',
    details: 'Nationwide transport strikes are causing severe disruptions to rail and air travel across France and neighboring countries. Expect cancellations and delays.',
    recommendations: [
      'Check travel status before departing',
      'Allow extra time for journeys',
      'Consider alternative transport',
      'Monitor strike updates'
    ],
    color: 'yellow',
    icon: '🚆',
    location: { lat: 45.7640, lng: 4.8357, intensity: 0.5 } // Lyon, France
  },
  {
    id: '7',
    title: 'Winter Storm Alert',
    summary: 'Heavy snowfall expected in Scandinavia',
    details: 'A major winter storm will bring heavy snow and strong winds to Norway, Sweden, and Finland. Travel will be extremely difficult in affected areas.',
    recommendations: [
      'Stock up on supplies',
      'Avoid unnecessary travel',
      'Prepare for possible power outages',
      'Dress in warm layers'
    ],
    color: 'blue',
    icon: '❄️',
    location: { lat: 59.3293, lng: 18.0686, intensity: 0.7 } // Stockholm, Sweden
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
  };
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
      .addCase(fetchCards.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.warnings = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
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