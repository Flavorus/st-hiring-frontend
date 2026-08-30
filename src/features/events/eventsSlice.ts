import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getEvents } from '../../api/eventsApi';
import type { EventsState } from './types';

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      return await getEvents();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load events';
      return rejectWithValue(message);
    }
  },
);

const initialState: EventsState = {
  data: [],
  loading: false,
  error: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default eventsSlice.reducer;
