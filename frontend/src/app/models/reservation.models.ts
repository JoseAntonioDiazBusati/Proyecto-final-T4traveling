// ============================================
// RESERVATION MODELS
// ============================================

export interface Reservation {
  id: string;
  userId: string;
  destinationId: string;
  destinationName: string;
  transportType: string;
  passengers: number;
  departureDate: string;
  returnDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
}

export interface CreateReservationDto {
  destinationId: string;
  destinationName: string;
  transportType: string;
  passengers: number;
  departureDate: string;
  returnDate: string;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequests?: string;
}

