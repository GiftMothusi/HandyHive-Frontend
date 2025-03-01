import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Appointment, BookingData, ReviewData } from '@/types/appointment';
import { appointmentService } from '@/services/appointmentService';
import { useRouter } from 'next/navigation';

interface AppointmentContextType {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  refreshAppointments: () => Promise<void>;
  getAppointmentById: (id: string) => Appointment | undefined;
  cancelAppointment: (id: string) => Promise<void>;
  completeAppointment: (id: string) => Promise<void>;
  bookAppointment: (bookingData: BookingData) => Promise<Appointment>;
  submitReview: (reviewData: ReviewData) => Promise<void>;
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch appointments on mount
  useEffect(() => {
    refreshAppointments();
  }, []);

  // Refresh appointments
  const refreshAppointments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await appointmentService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get a specific appointment by ID
  const getAppointmentById = (id: string): Appointment | undefined => {
    return appointments.find(appointment => appointment.id === id);
  };

  // Cancel an appointment
  const cancelAppointment = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await appointmentService.cancelAppointment(id);
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'cancelled' } 
            : appointment
        )
      );
    } catch (err) {
      console.error(`Failed to cancel appointment ${id}:`, err);
      setError('Failed to cancel appointment. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Complete an appointment
  const completeAppointment = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await appointmentService.completeAppointment(id);
      
      // Update local state
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id 
            ? { ...appointment, status: 'completed' } 
            : appointment
        )
      );
    } catch (err) {
      console.error(`Failed to complete appointment ${id}:`, err);
      setError('Failed to complete appointment. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Book a new appointment
  const bookAppointment = async (bookingData: BookingData): Promise<Appointment> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newAppointment = await appointmentService.createAppointment(bookingData);
      
      // Update local state
      setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
      
      return newAppointment;
    } catch (err) {
      console.error('Failed to book appointment:', err);
      setError('Failed to book appointment. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Submit a review for an appointment
  const submitReview = async (reviewData: ReviewData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await appointmentService.submitReview(reviewData);
      // Navigate to appointments page after successful review
      router.push('/appointments');
    } catch (err) {
      console.error('Failed to submit review:', err);
      setError('Failed to submit review. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Get upcoming appointments (confirmed or pending, with future dates)
  const upcomingAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    const today = new Date();
    return (
      (appointment.status === 'confirmed' || appointment.status === 'pending') && 
      appointmentDate >= today
    );
  }).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Get past appointments (completed, cancelled, or past dates)
  const pastAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    const today = new Date();
    return (
      appointment.status === 'completed' || 
      appointment.status === 'cancelled' || 
      (appointmentDate < today && appointment.status !== 'confirmed' && appointment.status !== 'pending')
    );
  }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()); // Most recent first

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        isLoading,
        error,
        refreshAppointments,
        getAppointmentById,
        cancelAppointment,
        completeAppointment,
        bookAppointment,
        submitReview,
        upcomingAppointments,
        pastAppointments,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
}

// Custom hook to use the appointment context
export function useAppointments() {
  const context = useContext(AppointmentContext);
  
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  
  return context;
}