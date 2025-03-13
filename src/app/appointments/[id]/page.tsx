'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppointments } from "@/contexts/AppointmentContext";
import { Appointment } from "@/types/appointment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  getStatusColors, 
  getStatusDisplayName, 
  canCancelAppointment, 
  canRescheduleAppointment,
  canLeaveReview,
  canBookAgain
} from "@/lib/appointment-utils";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  AlertCircle, 
  Star, 
  DollarSign, 
  ArrowRight, 
  CalendarClock, 
  X 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AppointmentDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { getAppointmentById, cancelAppointment, isLoading: contextLoading } = useAppointments();
  
  const [appointment, setAppointment] = useState<Appointment | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = getAppointmentById(params.id);
        
        if (!data) {
          setError("Appointment not found");
          return;
        }

        setAppointment(data);
      } catch (err) {
        console.error("Failed to fetch appointment:", err);
        setError("Failed to load appointment details");
      } finally {
        setIsLoading(false);
      }
    };

    if (!contextLoading) {
      fetchAppointment();
    }
  }, [params.id, getAppointmentById, contextLoading]);

  const handleCancelAppointment = async () => {
    if (!appointment) return;
    
    try {
      setIsLoading(true);
      await cancelAppointment(appointment.id);
      setCancelDialogOpen(false);
      
      // Refresh the appointment data
      const updatedAppointment = getAppointmentById(params.id);
      setAppointment(updatedAppointment);
    } catch (err) {
      console.error("Failed to cancel appointment:", err);
      setError("Failed to cancel appointment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescheduleAppointment = () => {
    setRescheduleDialogOpen(false);
    router.push(`/appointments/${params.id}/reschedule`);
  };

  if (isLoading || contextLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/appointments">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Appointments
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Error Loading Appointment</h2>
                <p className="text-muted-foreground mb-4">{error || "Appointment not found"}</p>
                <Button asChild>
                  <Link href="/appointments">Return to Appointments</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusColors = getStatusColors(appointment.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={handleCancelAppointment}>
              Yes, Cancel Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
            <DialogDescription>Choose a new date and time for your appointment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Select Date</h4>
              <div className="grid grid-cols-3 gap-2">
                {["Mar 5, 2025", "Mar 6, 2025", "Mar 7, 2025"].map((date) => (
                  <Button key={date} variant="outline" className="h-auto py-2">
                    {date}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Select Time</h4>
              <div className="grid grid-cols-3 gap-2">
                {["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"].map((time) => (
                  <Button key={time} variant="outline" className="h-auto py-2">
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleAppointment}>Confirm Reschedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/appointments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Appointments
            </Link>
          </Button>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">{appointment.serviceName}</CardTitle>
                <p className="text-muted-foreground">{appointment.serviceCategory}</p>
              </div>
              <Badge className={`${statusColors.bg} ${statusColors.text}`}>
                {getStatusDisplayName(appointment.status)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Provider Information */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{appointment.providerName}</h3>
                <p className="text-sm text-muted-foreground">{appointment.serviceCategory}</p>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Appointment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">Date</span>
                  </div>
                  <p className="font-medium">{appointment.date}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Time</span>
                  </div>
                  <p className="font-medium">{appointment.time}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Location</span>
                  </div>
                  <p className="font-medium">{appointment.location.address}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">Price</span>
                  </div>
                  <p className="font-medium">R{appointment.price.finalAmount}</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            {appointment.notes && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Special Instructions</h3>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">{appointment.notes}</p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-wrap gap-3 border-t p-6">
            {canCancelAppointment(appointment) && (
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => setCancelDialogOpen(true)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
            )}

            {canRescheduleAppointment(appointment) && (
              <Button
                variant="outline"
                onClick={() => setRescheduleDialogOpen(true)}
              >
                <CalendarClock className="mr-2 h-4 w-4" />
                Reschedule
              </Button>
            )}

            {canBookAgain(appointment) && (
              <Button variant="outline" asChild>
                <Link href={`/booking/${appointment.serviceId}`}>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Book Again
                </Link>
              </Button>
            )}

            {canLeaveReview(appointment) && (
              <Button asChild>
                <Link href={`/review/${appointment.id}`}>
                  <Star className="mr-2 h-4 w-4" />
                  Leave a Review
                </Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}