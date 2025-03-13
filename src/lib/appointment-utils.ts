// src/lib/appointment-utils.ts
import { Appointment, AppointmentStatus } from "@/types/appointment";

/**
 * Format a date string to a more readable format
 * @param dateString ISO date string
 * @returns Formatted date string (e.g., "February 26, 2025")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}

/**
 * Format a time string to a more readable format
 * @param timeString ISO time string
 * @returns Formatted time string (e.g., "9:00 AM")
 */
export function formatTime(timeString: string): string {
  try {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeString;
  }
}

/**
 * Format a time range from start and end times
 * @param startTime Start time ISO string
 * @param endTime End time ISO string
 * @returns Formatted time range (e.g., "9:00 AM - 11:00 AM")
 */
export function formatTimeRange(startTime: string, endTime: string): string {
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
}

/**
 * Calculate duration between two times
 * @param startTime Start time ISO string
 * @param endTime End time ISO string
 * @returns Duration string (e.g., "2 hours")
 */
export function calculateDuration(startTime: string, endTime: string): string {
  try {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "Duration not available";
  }
}

/**
 * Format a price number to a currency string
 * @param price Price number
 * @returns Formatted price string (e.g., "R50")
 */
export function formatPrice(price: number): string {
  return `R${price}`;
}

/**
 * Get a color for a status badge
 * @param status Appointment status
 * @returns Object with background and text color classes
 */
export function getStatusColors(status: AppointmentStatus): { bg: string; text: string } {
  switch (status) {
    case 'confirmed':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'pending':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'in_progress':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'completed':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'cancelled':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
}

/**
 * Get a status display name
 * @param status Appointment status
 * @returns Capitalized status name
 */
export function getStatusDisplayName(status: AppointmentStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

/**
 * Determine if an appointment can be cancelled
 * @param appointment Appointment object
 * @returns Boolean indicating if appointment can be cancelled
 */
export function canCancelAppointment(appointment: Appointment): boolean {
  return appointment.status === 'confirmed' || appointment.status === 'pending';
}

/**
 * Determine if an appointment can be rescheduled
 * @param appointment Appointment object
 * @returns Boolean indicating if appointment can be rescheduled
 */
export function canRescheduleAppointment(appointment: Appointment): boolean {
  return appointment.status === 'confirmed' || appointment.status === 'pending';
}

/**
 * Determine if a review can be left for an appointment
 * @param appointment Appointment object
 * @returns Boolean indicating if a review can be left
 */
export function canLeaveReview(appointment: Appointment): boolean {
    return appointment.status === 'completed';
  }
  
  /**
   * Determine if an appointment can be booked again
   * @param appointment Appointment object
   * @returns Boolean indicating if appointment can be booked again
   */
  export function canBookAgain(appointment: Appointment): boolean {
    return appointment.status === 'completed' || appointment.status === 'cancelled';
  }
  
  /**
   * Group appointments by date
   * @param appointments Array of appointments
   * @returns Record with dates as keys and appointment arrays as values
   */
  export function groupAppointmentsByDate(appointments: Appointment[]): Record<string, Appointment[]> {
    return appointments.reduce((groups, appointment) => {
      const date = appointment.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(appointment);
      return groups;
    }, {} as Record<string, Appointment[]>);
  }

