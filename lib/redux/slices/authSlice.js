import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const register = createAsyncThunk(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', credentials);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Handle network errors (server not running, CORS, etc.)
      if (!error.response) {
        const networkError = error.code === 'ECONNREFUSED' || error.message === 'Network Error'
          ? 'Backend server is not running. Please start it with: npm run server:dev'
          : `Network error: ${error.message || 'Unable to connect to server'}`;
        console.error('Register request failed - Network Error:', networkError);
        return rejectWithValue(networkError);
      }

      const serverErrors = error.response?.data?.errors;
      const normalizedErrors = Array.isArray(serverErrors)
        ? serverErrors.map((err) => err.msg || err.message || JSON.stringify(err)).join('; ')
        : serverErrors;

      const message =
        error.response?.data?.message ||
        normalizedErrors ||
        error.message ||
        'Registration failed';

      console.error('Register request failed:', message, error.response?.data);
      return rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Handle network errors (server not running, CORS, etc.)
      if (!error.response) {
        const networkError = error.code === 'ECONNREFUSED' || error.message === 'Network Error'
          ? 'Backend server is not running. Please start it with: npm run server:dev'
          : `Network error: ${error.message || 'Unable to connect to server'}`;
        console.error('Login request failed - Network Error:', networkError);
        return rejectWithValue(networkError);
      }

      const serverErrors = error.response?.data?.errors;
      const normalizedErrors = Array.isArray(serverErrors)
        ? serverErrors.map((err) => err.msg || err.message || JSON.stringify(err)).join('; ')
        : serverErrors;

      const message =
        error.response?.data?.message ||
        normalizedErrors ||
        error.message ||
        'Login failed';

      console.error('Login request failed:', message, error.response?.data);
      return rejectWithValue(message);
    }
  }
);

export const renewToken = createAsyncThunk(
  'auth/renewToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/renew');
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue('Token renewal failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    hydrateAuth: (state, action) => {
      const { token, user } = action.payload || {};
      state.token = token || null;
      state.user = user || null;
      state.isAuthenticated = Boolean(token && user);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Renew token
      .addCase(renewToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(renewToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;
