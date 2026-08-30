import { apiClient } from './client';
import type { Event } from '../types/api';

export const getEvents = (): Promise<Event[]> => apiClient.get<Event[]>('/events');
