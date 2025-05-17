import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/lib/storage";
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  refreshToken,
} from "./userAuthThunk";

type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface User {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  isVerified: boolean;
  date_of_birth?: string | null;
  height?: number | null;
  weight?: number | null;
  illnesses?: string | null;
  allergies?: string | null;
  addictions?: string | null;
  family_history?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;
}

interface UserState {
  user: User;
  access_token: string | null;
  refresh_token: string | null;
  status: AuthStatus;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: {
    id: null,
    email: null,
    name: null,
    role: null,
    isVerified: false,
    date_of_birth: null,
    height: null,
    weight: null,
    illnesses: null,
    allergies: null,
    addictions: null,
    family_history: null,
    location_lat: null,
    location_lng: null,
  },
  access_token: null,
  refresh_token: null,
  status: 'idle',
  error: null,
  isAuthenticated: false,
};

const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    manualLogout: (state) => {
    state.isAuthenticated = false;
    state.access_token = null;
    state.refresh_token = null;
    state.user = initialState.user;
    state.status = 'idle';
    state.error = null;
  },
    clearAuthError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
    resetAuthStatus: (state) => {
      state.status = 'idle';
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateUserLocation: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.user.location_lat = action.payload.lat;
      state.user.location_lng = action.payload.lng;
    }
  },
  // In your userAuthSlice.ts
extraReducers: (builder) => {
  builder
    // Login
    .addCase(loginUser.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.user = action.payload.user;
    })
    .addCase(loginUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
      state.isAuthenticated = false;
    })
    
    // Register
    .addCase(registerUser.pending, (state) => {
      state.status = 'loading';
      state.error = null;
    })
    .addCase(registerUser.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.isAuthenticated = true;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.user = action.payload.user;
    })
    .addCase(registerUser.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
      state.isAuthenticated = false;
    })
    
    // Logout
    .addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.access_token = null;
      state.refresh_token = null;
      state.user = initialState.user;
    })
    
    // Refresh token
    .addCase(refreshToken.fulfilled, (state, action) => {
      state.access_token = action.payload.access_token;
      state.isAuthenticated = true;
    })
    .addCase(refreshToken.rejected, (state) => {
      state.isAuthenticated = false;
      state.access_token = null;
      state.refresh_token = null;
    });
}
});

const persistConfig = {
  key: 'userAuth',
  storage,
  whitelist: ['user', 'access_token', 'refresh_token', 'isAuthenticated'],
  blacklist: ['status', 'error'],
  version: 1,
};

export const persistedUserAuthReducer = persistReducer(persistConfig, userAuthSlice.reducer);

export const { 
  clearAuthError, 
  resetAuthStatus,
  updateUserProfile,
  updateUserLocation,
  manualLogout
} = userAuthSlice.actions;

export type { UserState };

export default persistedUserAuthReducer;