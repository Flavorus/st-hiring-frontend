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
  date: string;
  location: string;
  description: string;
  availableTickets: Ticket[];
  createdAt: string;
  updatedAt: string;
}
