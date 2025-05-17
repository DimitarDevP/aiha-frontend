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

const mockCards: Card[] = [
  {
    id: '1',
    title: 'Weather Alert',
    summary: 'Severe thunderstorm warning in your area',
    details: 'A severe thunderstorm is expected to hit your area within the next hour. Expect heavy rain, strong winds up to 60 mph, and possible hail.',
    recommendations: [
      'Stay indoors and away from windows',
      'Avoid using electrical appliances',
      'Have a flashlight and batteries ready',
      'Monitor local weather updates'
    ],
    color: 'red',
    icon: '⚠️'
  },
  {
    id: '2',
    title: 'Health Advisory',
    summary: 'Flu season is approaching',
    details: 'Local health authorities report an early start to flu season with higher than usual cases reported. Vulnerable populations are at increased risk.',
    recommendations: [
      'Get your flu vaccination',
      'Wash hands frequently',
      'Avoid close contact with sick individuals',
      'Stay home if you feel unwell'
    ],
    color: 'blue',
    icon: '💉'
  },
  {
    id: '3',
    title: 'Community Event',
    summary: 'Neighborhood clean-up day this weekend',
    details: 'Annual community clean-up event scheduled for Saturday from 9am to 1pm. Volunteers will meet at the community center.',
    recommendations: [
      'Bring gloves and reusable water bottles',
      'Wear comfortable clothing and closed-toe shoes',
      'Register in advance if possible',
      'Spread the word to neighbors'
    ],
    color: 'green',
    icon: '♻️'
  },
  {
    id: '4',
    title: 'Road Closure',
    summary: 'Main Street will be closed for construction',
    details: 'From Monday to Friday next week, Main Street between 5th and 8th avenues will be closed for sewer line replacement. Detours will be in place.',
    recommendations: [
      'Plan alternative routes',
      'Allow extra travel time',
      'Consider public transportation',
      'Check city website for updates'
    ],
    color: 'yellow',
    icon: '🚧'
  },
  {
    id: '5',
    title: 'Public Safety Notice',
    summary: 'Recent increase in package thefts',
    details: 'There has been a recent spike in package thefts from porches in the area. Police are investigating but recommend extra precautions.',
    recommendations: [
      'Require signatures for deliveries',
      'Use package lockers if available',
      'Install security cameras',
      'Coordinate with neighbors to watch for deliveries'
    ],
    color: 'purple',
    icon: '📦'
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