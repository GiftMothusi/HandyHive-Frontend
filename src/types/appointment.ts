/**
 * Appointment status types
 */
export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Service provider categories
 */
export type ServiceCategory = 'Domestic Worker' | 'Gardener' | 'Chef' | 'Tutor' | 'Handyman';

/**
 * Service provider interface
 */
export interface ServiceProvider {
  id: number;
  name: string;
  category: ServiceCategory;
  description: string;
  rating: number;
  hourlyRate: number;
  availability: string[];
  image?: string;
}

export interface Service {
    id: number;
    name: string;
    description?: string;
}

/**
 * Location information for an appointment
 */
export interface AppointmentLocation {
  address: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  accessInstructions?: string;
}

/**
 * Price breakdown for an appointment
 */
export interface AppointmentPrice {
  baseAmount: number;
  premium?: number;
  discount?: number;
  finalAmount: number;
  commission?: number;
}

/**
 * Requirements for an appointment
 */
export interface AppointmentRequirements {
  specialInstructions?: string;
  equipmentNeeded?: string[];
  petsPresent?: boolean;
}

/**
 * Main appointment interface
 */
export interface Appointment {
  id: string;
  clientId: string;
  providerId: number;
  serviceId: number;
  serviceName: string;
  serviceCategory: ServiceCategory;
  providerName: string;
  status: AppointmentStatus;
  startTime: string;
  endTime: string;
  date: string;
  time: string;
  location: AppointmentLocation;
  requirements?: AppointmentRequirements;
  price: AppointmentPrice;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  updatedAt: string;
  duration?: string;
  notes?: string;
}

/**
 * API response for appointment listing
 */
export interface AppointmentsResponse {
  data: Appointment[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

/**
 * Form data for creating/updating appointments
 */
export interface AppointmentFormData {
  providerId: number;
  serviceId: number;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    address: string;
    accessInstructions?: string;
  };
  specialInstructions?: string;
  equipmentNeeded?: string[];
  petsPresent?: boolean;
}

/**
 * Booking data for creating a new appointment
 */
export interface BookingData {
  providerId: number;
  serviceId: number;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  accessInstructions?: string;
  specialInstructions?: string;
}

/**
 * Review data for an appointment
 */
export interface ReviewData {
  appointmentId: string;
  rating: number;
  review: string;
  categories?: {
    punctuality: number;
    quality: number;
    communication: number;
    professionalism: number;
  };
}