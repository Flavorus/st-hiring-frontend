import { PaginatedResponse, Event, Settings } from '../types';

const API_BASE = '';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP error ${response.status}`);
  }

  return response.json();
}

export const eventsApi = {
  getEvents: (page: number = 1, pageSize: number = 20): Promise<PaginatedResponse<Event>> =>
    fetchJson<PaginatedResponse<Event>>(`/events?page=${page}&pageSize=${pageSize}`),
};

export const settingsApi = {
  getSettings: (): Promise<Settings> =>
    fetchJson<Settings>('/settings'),

  updateSettings: (settings: Partial<Settings>): Promise<Settings> =>
    fetchJson<Settings>('/settings', {
      method: 'POST',
      body: JSON.stringify(settings),
    }),
};