import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventsSlice';
import settingsReducer from './settingsSlice';

export const store = configureStore({
  reducer: {
    events: eventsReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;