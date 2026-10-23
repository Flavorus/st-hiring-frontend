import { vi, describe, it, expect, beforeEach } from 'vitest';
import eventsReducer, { fetchEvents, clearEventsError } from './eventsSlice';
import { EventsState } from '../types';

describe('eventsSlice', () => {
  const initialState: EventsState = {
    events: [],
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchEvents', () => {
    it('should set loading to true when pending', () => {
      const action = { type: fetchEvents.pending.type, payload: undefined };
      const state = eventsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should set events and pagination when fulfilled', () => {
      const mockResponse = {
        data: [
          { id: 1, name: 'Event 1', description: 'Desc', date: '2024-01-01', location: 'Loc 1', availableTickets: [], createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        ],
        total: 50,
        page: 2,
        pageSize: 20,
        totalPages: 3,
      };
      const action = { type: fetchEvents.fulfilled.type, payload: mockResponse };
      const state = eventsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.events).toEqual(mockResponse.data);
      expect(state.pagination).toEqual({
        page: 2,
        pageSize: 20,
        total: 50,
        totalPages: 3,
      });
    });

    it('should set error when rejected', () => {
      const action = { type: fetchEvents.rejected.type, payload: 'Failed to fetch', error: { message: 'Failed to fetch' } };
      const state = eventsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch');
    });
  });

  describe('clearEventsError', () => {
    it('should clear error', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const action = clearEventsError();
      const state = eventsReducer(stateWithError, action);
      expect(state.error).toBeNull();
    });
  });
});