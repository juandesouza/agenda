import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import calendarReducer from './slices/calendarSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calendar: calendarReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['calendar/setEvents', 'calendar/addEvent', 'calendar/updateEvent'],
        ignoredPaths: ['calendar.events', 'calendar.activeEvent'],
      },
    }),
});
