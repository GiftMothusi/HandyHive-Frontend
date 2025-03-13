// src/services/appointmentService.ts
import { api } from "@/lib/axios";
import { 
  Appointment, 
  AppointmentsResponse, 
  BookingData, 
  ReviewData, 
  Service,
  ServiceProvider 
} from "@/types/appointment";

/**
 * Service class for handling appointment-related API requests
 */
class AppointmentService {
  /**
   * Get all appointments for the current user
   * @returns Promise with appointments data
   */
  async getAppointments(): Promise<Appointment[]> {
    try {
      const response = await api.get<AppointmentsResponse>('/bookings');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      throw error;
    }
  }

  /**
   * Get a specific appointment by ID
   * @param id Appointment ID
   * @returns Promise with appointment data
   */
  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const response = await api.get<{ data: Appointment }>(`/bookings/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch appointment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new appointment
   * @param bookingData Booking data for the new appointment
   * @returns Promise with the created appointment
   */
  async createAppointment(bookingData: BookingData): Promise<Appointment> {
    try {
      const response = await api.post<{ data: Appointment }>('/bookings', bookingData);
      return response.data.data;
    } catch (error) {
      console.error('Failed to create appointment:', error);
      throw error;
    }
  }

  /**
   * Cancel an appointment
   * @param id Appointment ID to cancel
   * @returns Promise with the updated appointment
   */
  async cancelAppointment(id: string): Promise<Appointment> {
    try {
      const response = await api.post<{ data: Appointment }>(`/bookings/${id}/cancel`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to cancel appointment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Complete an appointment
   * @param id Appointment ID to mark as completed
   * @returns Promise with the updated appointment
   */
  async completeAppointment(id: string): Promise<Appointment> {
    try {
      const response = await api.post<{ data: Appointment }>(`/bookings/${id}/complete`);
      return response.data.data;
    } catch (error) {
      console.error(`Failed to complete appointment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Submit a review for an appointment
   * @param reviewData Review data
   * @returns Promise with the submitted review
   */
  async submitReview(reviewData: ReviewData): Promise<{ data: { success: boolean } }> {
    try {
      const response = await api.post<{ data: { success: boolean } }>(`/bookings/${reviewData.appointmentId}/rate`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Failed to submit review:', error);
      throw error;
    }
  }

  /**
   * Get all available services
   * @returns Promise with services data
   */
  async getServices(): Promise<Service[]> {
    try {
      const response = await api.get<{ data: Service[] }>('/services');
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw error;
    }
  }

  /**
   * Get service providers for a specific service category
   * @param serviceId Service ID to get providers for
   * @returns Promise with service providers data
   */
  async getServiceProviders(serviceId?: number): Promise<ServiceProvider[]> {
    try {
      // If a specific service ID is provided, get providers for that service
      if (serviceId) {
        const response = await api.get<{ data: ServiceProvider[] }>(`/services/${serviceId}/providers`);
        return response.data.data;
      } 
      
      // Otherwise, get all available services first
      const services = await this.getServices();
      
      // If no services available, return empty array
      if (!services || services.length === 0) {
        return [];
      }
      
      // Get providers for the first service
      const firstServiceId = services[0].id;
      const response = await api.get<{ data: ServiceProvider[] }>(`/services/${firstServiceId}/providers`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch service providers:', error);
      throw error;
    }
  }

  /**
   * Get a specific service provider by ID
   * @param id Service provider ID
   * @returns Promise with service provider data
   */
  async getServiceProviderById(id: number): Promise<ServiceProvider | null> {
    try {
      // First try to get all providers
      const providers = await this.getServiceProviders();
      
      // Find the provider with the matching ID
      const provider = providers.find(p => p.id === id);
      
      if (provider) {
        return provider;
      }
      
      // If provider not found in the list, try to fetch it directly
      // This would require a new API endpoint in your backend
      // const response = await api.get<{ data: ServiceProvider }>(`/service-providers/${id}`);
      // return response.data.data;
      
      return null;
    } catch (error) {
      console.error(`Failed to fetch service provider ${id}:`, error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();