export interface Ticket {
  id: number;
  eventId: number;
  type: string;
  status: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  availableTickets: Ticket[];
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface Settings {
  _id?: string;
  siteName: string;
  maintenanceMode: boolean;
  maxTicketsPerOrder: number;
  supportEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventsState {
  events: Event[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

export interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
}