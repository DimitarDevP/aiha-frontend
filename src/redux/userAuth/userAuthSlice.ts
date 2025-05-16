import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  refreshToken,
} from "./userAuthThunk";

// Define more specific types
type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface User {
  id: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  isVerified: boolean;
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
    clearAuthError: (state) => {
      state.error = null;
      state.status = 'idle';
    },
    resetAuthStatus: (state) => {
      state.status = 'idle';
    },
    // Add a reducer to update user profile without full refresh
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      state.user = { ...state.user, ...action.payload };
    }
  },
  extraReducers: (builder) => {
    // Helper function for common pending state
    const handlePending = (state: UserState) => {
      state.status = 'loading';
      state.error = null;
    };

    // Helper function for common error state
    const handleRejected = (state: UserState, action: any) => {
      state.status = 'failed';
      state.error = action.payload as string || 'Operation failed';
    };

    // Login
    builder.addCase(loginUser.pending, handlePending);
    builder.addCase(loginUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.access_token = payload.access_token;
      state.refresh_token = payload.refresh_token;
      state.isAuthenticated = true;
      state.status = 'succeeded';
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      handleRejected(state, action);
      state.isAuthenticated = false;
    });

    // Register
    builder.addCase(registerUser.pending, handlePending);
    builder.addCase(registerUser.fulfilled, (state, { payload }) => {
      state.user = payload.user;
      state.status = 'succeeded';
    });
    builder.addCase(registerUser.rejected, handleRejected);

    // Logout
    builder.addCase(logoutUser.pending, handlePending);
    builder.addCase(logoutUser.fulfilled, () => initialState);
    builder.addCase(logoutUser.rejected, handleRejected);

    // Refresh Token
    builder.addCase(refreshToken.pending, handlePending);
    builder.addCase(refreshToken.fulfilled, (state, { payload }) => {
      state.access_token = payload.access_token;
      state.refresh_token = payload.refresh_token;
      state.isAuthenticated = true;
      state.status = 'succeeded';
    });
    builder.addCase(refreshToken.rejected, (state, action) => {
      handleRejected(state, action);
      state.isAuthenticated = false;
    });

  }
});

const persistConfig = {
  key: 'userAuth',
  storage,
  whitelist: ['user', 'access_token', 'refresh_token', 'isAuthenticated'],
  blacklist: ['status', 'error'],
  // Optional: Add version to handle future migrations
  version: 1,
};

export const persistedUserAuthReducer = persistReducer(persistConfig, userAuthSlice.reducer);

export const { 
  clearAuthError, 
  resetAuthStatus,
  updateUserProfile 
} = userAuthSlice.actions;

// Export the type for the root state
export type { UserState };

export default persistedUserAuthReducer;