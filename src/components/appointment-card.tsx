
'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { Appointment } from '@/types/appointment';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger
} from './ui/dropdown-menu';
import { 
  getStatusColors, 
  getStatusDisplayName, 
  canCancelAppointment, 
  canRescheduleAppointment,
  canLeaveReview,
  canBookAgain
} from '@/lib/appointment-utils';
import { useAppointments } from '@/contexts/AppointmentContext';

interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails?: () => void;
  showFooterActions?: boolean;
}

export function AppointmentCard({ 
  appointment, 
  onViewDetails,
  showFooterActions = true
}: AppointmentCardProps) {
  const router = useRouter();
  const { cancelAppointment } = useAppointments();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [showCancelConfirm, setShowCancelConfirm] = React.useState<boolean>(false);

  const statusColors = getStatusColors(appointment.status);
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      router.push(`/appointments/${appointment.id}`);
    }
  };

  const handleCancelAppointment = async () => {
    try {
      setIsLoading(true);
      await cancelAppointment(appointment.id);
      setShowCancelConfirm(false);
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReschedule = () => {
    router.push(`/appointments/${appointment.id}/reschedule`);
  };

  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/4 h-32 md:h-auto relative">
          {/* Placeholder image for now */}
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            {appointment.serviceCategory}
          </div>
        </div>
        <CardContent className="flex-1 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{appointment.serviceName}</h3>
                <Badge className={`${statusColors.bg} ${statusColors.text}`}>
                  {getStatusDisplayName(appointment.status)}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {appointment.serviceCategory} • {appointment.providerName}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {appointment.date}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {appointment.time}
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-2">
              <div className="text-right">
                <p className="font-bold text-lg">
                  R{appointment.price.finalAmount}
                </p>
                <p className="text-xs text-muted-foreground">
                  {appointment.duration || 'Duration not available'}
                </p>
              </div>

              {/* Menu for actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleViewDetails}>
                    View Details
                  </DropdownMenuItem>
                  {canRescheduleAppointment(appointment) && (
                    <DropdownMenuItem onClick={handleReschedule}>
                      Reschedule
                    </DropdownMenuItem>
                  )}
                  {canCancelAppointment(appointment) && (
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => setShowCancelConfirm(true)}
                    >
                      Cancel
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </div>
      
      {showFooterActions && (
        <CardFooter className="bg-muted/50 px-6 py-3 flex justify-end gap-2">
          {!showCancelConfirm ? (
            <>
              <Button variant="ghost" onClick={handleViewDetails}>
                View Details
              </Button>
              
              {/* Show different action buttons based on status */}
              {canLeaveReview(appointment) && (
                <Button asChild>
                  <Link href={`/review/${appointment.id}`}>Leave a Review</Link>
                </Button>
              )}
              
              {canBookAgain(appointment) && (
                <Button variant="outline" asChild>
                  <Link href={`/booking/${appointment.serviceId}`}>Book Again</Link>
                </Button>
              )}
              
              {canCancelAppointment(appointment) && (
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => setShowCancelConfirm(true)}
                >
                  Cancel
                </Button>
              )}
            </>
          ) : (
            <>
              <p className="flex-1 text-sm text-red-600">
                Are you sure you want to cancel this appointment?
              </p>
              <Button 
                variant="outline" 
                onClick={() => setShowCancelConfirm(false)}
                disabled={isLoading}
              >
                No, Keep
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleCancelAppointment}
                disabled={isLoading}
              >
                {isLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </Button>
            </>
          )}
        </CardFooter>
      )}
    </Card>
  );
}