export type TripType = 'ONE_WAY' | 'ROUND_TRIP' | 'MULTI_CITY';

export interface MultiCityLeg {
  id: string;
  origin: string;
  destination: string;
  date: string;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  roles: string[];
}

export interface Airport {
  id: number;
  iataCode: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  id: number;
  iataCode: string;
  name: string;
  logoUrl: string;
}

export interface FlightResponseDto {
  id: number;
  scheduleId: number;
  flightNumber: string;
  airlineName: string;
  airlineCode: string;
  airlineLogo: string;
  originIata: string;
  originCity: string;
  originAirportName: string;
  destinationIata: string;
  destinationCity: string;
  destinationAirportName: string;
  departureTime: string;
  arrivalTime: string;
  travelDate: string;
  durationMinutes: number;
  stops: number;
  baseFare: number;
  taxAmount: number;
  totalPrice: number;
  isRefundable: boolean;
  cabinBaggageKg: number;
  checkinBaggageKg: number;
  availableSeats: number;
  aircraftModel: string;
  cabinClass: string;
}

export interface SeatDto {
  id: number;
  seatNumber: string;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  seatType: 'WINDOW' | 'AISLE' | 'MIDDLE' | 'EXTRA_LEGROOM' | 'EMERGENCY_EXIT';
  priceSurcharge: number;
  isBooked: boolean;
  isBlocked: boolean;
}

export interface PassengerDto {
  id?: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  passengerType: string;
  passportNumber?: string;
  nationality?: string;
  seatNumber?: string;
  mealPreference?: string;
  extraBaggageKg?: number;
  insuranceOpted?: boolean;
}

export interface BookingResponseDto {
  id: number;
  pnr: string;
  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REFUND_PENDING' | 'REFUNDED';
  cabinClass: string;
  passengerCount: number;
  baseAmount: number;
  seatCharges: number;
  addonCharges: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  createdAt: string;
  flight: FlightResponseDto;
  returnFlight?: FlightResponseDto;
  multiCityFlights?: FlightResponseDto[];
  tripType?: TripType;
  returnSeats?: string[];
  multiCitySeats?: { [legIndex: number]: string[] };
  passengers: PassengerDto[];
  paymentStatus?: string;
  isCancellable?: boolean;
  eligibleRefundAmount?: number;
}

export interface CancellationSummaryDto {
  bookingId: number;
  pnr: string;
  ticketAmount: number;
  cancellationFee: number;
  refundAmount: number;
  isEligible: boolean;
  policyMessage: string;
}

export interface RefundDto {
  id: number;
  bookingId: number;
  pnr: string;
  userEmail: string;
  userName: string;
  refundAmount: number;
  refundReference: string;
  refundStatus: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  cancellationReason: string;
  requestDate: string;
  processedAt?: string;
  adminNotes?: string;
}

export interface NotificationDto {
  id: number;
  title: string;
  message: string;
  notificationType: 'BOOKING' | 'FLIGHT_UPDATE' | 'GATE_CHANGE' | 'CHECKIN' | 'PAYMENT' | 'REFUND' | 'OFFER' | 'WELCOME' | string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  pnr?: string;
  flightNumber?: string;
  priority?: 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'alert';
  timestamp: number;
  pnr?: string;
  actionLabel?: string;
  actionRoute?: string;
}

export interface ChatMessageDto {
  sender: 'user' | 'assistant';
  content: string;
  time: string;
  toolCalls?: string[];
  suggestedFlights?: Array<{
    flightNumber: string;
    airline: string;
    route: string;
    price: string;
    time: string;
    duration: string;
  }>;
  quickReplies?: string[];
}

export interface AdminDashboardDto {
  totalUsers: number;
  totalFlights: number;
  totalBookings: number;
  todayBookings: number;
  totalRevenue: number;
  cancelledBookings: number;
  pendingRefunds: number;
  activeFlights: number;
  revenueTrends: Array<{ date: string; revenue: number; bookings: number }>;
  popularRoutes: Array<{ route: string; bookings: number; revenue: string }>;
  airlineDistribution: Array<{ airline: string; share: number }>;
  cancellationRate: number;
}
