import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';

const initialState = {
  events: [],
  activeEvent: null,
  loading: false,
  error: null,
};

const toISOString = (value) => {
  if (!value) return new Date().toISOString();
  if (value instanceof Date) return value.toISOString();
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

// Async thunks
export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events');
      return response.data.events.map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        notes: event.notes || '',
        color: event.color,
        resource: event.resource || {},
      }));
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return [];
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch events'
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, { rejectWithValue }) => {
    try {
      const startISO = toISOString(eventData.start);
      const endISO = toISOString(eventData.end);

      const response = await api.post('/events', {
        ...eventData,
        start: startISO,
        end: endISO,
      });
      return {
        id: response.data.event.id,
        title: response.data.event.title,
        start: new Date(response.data.event.start),
        end: new Date(response.data.event.end),
        notes: response.data.event.notes || '',
        color: response.data.event.color,
        resource: {},
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to create event'
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ id, eventData }, { rejectWithValue }) => {
    try {
      const payload = {};
      if (eventData.title) payload.title = eventData.title;
      if (eventData.start) payload.start = toISOString(eventData.start);
      if (eventData.end) payload.end = toISOString(eventData.end);
      if (eventData.notes !== undefined) payload.notes = eventData.notes;

      const response = await api.put(`/events/${id}`, payload);
      return {
        id: response.data.event.id,
        title: response.data.event.title,
        start: new Date(response.data.event.start),
        end: new Date(response.data.event.end),
        notes: response.data.event.notes || '',
        color: response.data.event.color,
        resource: {},
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.response?.data?.errors || 'Failed to update event'
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete event'
      );
    }
  }
);

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setActiveEvent: (state, action) => {
      state.activeEvent = action.payload;
    },
    clearActiveEvent: (state) => {
      state.activeEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearEvents: (state) => {
      state.events = [];
      state.activeEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update event
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.events.findIndex((e) => e.id === action.payload.id);
        if (index !== -1) {
          state.events[index] = action.payload;
        }
        if (state.activeEvent?.id === action.payload.id) {
          state.activeEvent = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
        if (state.activeEvent?.id === action.payload) {
          state.activeEvent = null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveEvent, clearActiveEvent, clearError, clearEvents } = calendarSlice.actions;
export default calendarSlice.reducer;
