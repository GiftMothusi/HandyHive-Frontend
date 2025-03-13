// src/hooks/useBooking.ts
import { useState, useCallback } from 'react';
import { api } from '@/lib/axios';
import { BookingData, Appointment } from '@/types/appointment';
import { useAppointments } from '@/contexts/AppointmentContext';

interface UseBookingReturn {
  isLoading: boolean;
  error: string | null;
  success: boolean;
  createBooking: (bookingData: BookingData) => Promise<Appointment | null>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  rescheduleBooking: (bookingId: string, bookingData: Partial<BookingData>) => Promise<boolean>;
}

/**
 * Custom hook for booking management actions
 */
export function useBooking(): UseBookingReturn {
  const { refreshAppointments } = useAppointments();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  /**
   * Create a new booking
   */
  const createBooking = useCallback(async (bookingData: BookingData): Promise<Appointment | null> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const response = await api.post<{ data: Appointment }>('/bookings', bookingData);
      setSuccess(true);
      
      await refreshAppointments();
      
      return response.data.data;
    } catch (err: Error | unknown) {
      console.error('Failed to create booking:', err);
      setError(err instanceof Error ? err.message : 'Failed to create booking. Please try again.');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [refreshAppointments]);

  /**
   * Cancel an existing booking
   */
  const cancelBooking = useCallback(async (bookingId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await api.post(`/bookings/${bookingId}/cancel`);
      setSuccess(true);
      
      // Refresh the appointments list
      await refreshAppointments();
      
      return true;
    } catch (err: Error | unknown) {
      console.error(`Failed to cancel booking ${bookingId}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to cancel booking. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshAppointments]);

  /**
   * Reschedule an existing booking
   */
  const rescheduleBooking = useCallback(async (bookingId: string, bookingData: Partial<BookingData>): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await api.patch(`/bookings/${bookingId}`, bookingData);
      setSuccess(true);
      
      // Refresh the appointments list
      await refreshAppointments();
      
      return true;
    } catch (err: Error | unknown) {
      console.error(`Failed to reschedule booking ${bookingId}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to reschedule booking. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [refreshAppointments]);

  return {
    isLoading,
    error,
    success,
    createBooking,
    cancelBooking,
    rescheduleBooking
  };
}