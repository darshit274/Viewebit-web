import { createSlice } from '@reduxjs/toolkit';
import { AUTH_CONFIG } from '../../config/constants';

interface User {
  uuid: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  phoneNumber?: string;
  role?: 'student' | 'admin' | 'super_admin';
  avatarUrl?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Helper function to load auth data from sessionStorage
const loadAuthFromStorage = (): Partial<AuthState> => {
  try {
    const token = sessionStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
    const userStr = sessionStorage.getItem(AUTH_CONFIG.USER_KEY);
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth from storage:', error);
    // Clear corrupted data
    sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    sessionStorage.removeItem(AUTH_CONFIG.USER_KEY);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    ...loadAuthFromStorage(),
  },
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      state.error = null;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Login success
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      
      // Persist to sessionStorage
      sessionStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token);
      sessionStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));
    },
    
    // Update user data
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        
        // Update in sessionStorage
        sessionStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(state.user));
      }
    },
    
    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      
      // Clear from sessionStorage
      sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      sessionStorage.removeItem(AUTH_CONFIG.USER_KEY);
    },
    
    // Restore session from storage (called on app init)
    restoreSession: (state) => {
      const authData = loadAuthFromStorage();
      
      if (authData.token && authData.user) {
        state.user = authData.user;
        state.token = authData.token;
        state.isAuthenticated = authData.isAuthenticated || false;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  loginSuccess,
  updateUser,
  logout,
  restoreSession,
} = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;