export interface Ticket {
  id: number;
  event_id: number;
  type: string;
  status: 'available' | 'sold' | 'reserved';
  price: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string | null;
  date: string;
  created_at: string;
  updated_at: string;
  availableTickets: Ticket[];
}
