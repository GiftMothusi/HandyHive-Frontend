// src/app/appointments/page.tsx
'use client'

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Calendar,
  Home,
  LogOut,
  Menu,
  Search,
  User,
  Clock,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentCard } from "@/components/appointment-card";
import { AppointmentEmptyState } from "@/components/appointment-empty-state";
import { useAppointments } from "@/contexts/AppointmentContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Appointment } from "@/types/appointment";

export default function AppointmentsPage() {
  const router = useRouter();
  const { 
    upcomingAppointments,
    pastAppointments,
    isLoading,
    error,
    cancelAppointment
  } = useAppointments();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

  // Filter appointments based on search query
  const filteredUpcomingAppointments = upcomingAppointments.filter((appointment) => {
    const searchString = `${appointment.serviceName} ${appointment.serviceCategory} ${appointment.providerName}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  const filteredPastAppointments = pastAppointments.filter((appointment) => {
    const searchString = `${appointment.serviceName} ${appointment.serviceCategory} ${appointment.providerName}`.toLowerCase();
    return searchString.includes(searchQuery.toLowerCase());
  });

  const handleLogout = async () => {
    try {
      // Clear token cookie
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      // Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleCancelAppointment = async () => {
    if (selectedAppointment) {
      try {
        await cancelAppointment(selectedAppointment.id);
        setCancelDialogOpen(false);
        setSelectedAppointment(null);
      } catch (error) {
        console.error("Error cancelling appointment:", error);
      }
    }
  };

  const handleRescheduleAppointment = () => {
    // In a real app, this would navigate to a reschedule page or update the appointment
    setRescheduleDialogOpen(false);
    // For demo purposes, we'll just close the dialog
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">User</p>
                  <p className="text-sm text-muted-foreground">user@example.com</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start bg-accent" asChild>
                <Link href="/appointments">
                  <Calendar className="mr-2 h-4 w-4" />
                  Appointments
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
            </nav>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <Sheet open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <SheetContent className="sm:max-w-md overflow-auto">
            <div className="space-y-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200 flex items-center justify-center">
                {selectedAppointment.serviceCategory}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => setSelectedAppointment(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h2 className="text-xl font-bold">{selectedAppointment.serviceName}</h2>
                <p className="text-muted-foreground">{selectedAppointment.serviceCategory}</p>
              </div>

              {/* Appointment details */}
              <div className="space-y-3 bg-muted p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Service Provider</p>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.providerName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">R{selectedAppointment.price.finalAmount}</p>
                  </div>
                </div>
                {selectedAppointment.notes && (
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons based on status */}
              {selectedAppointment.status === "confirmed" && (
                <div className="space-y-3 pt-2">
                  <Button variant="outline" className="w-full" onClick={() => setRescheduleDialogOpen(true)}>
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel Appointment
                  </Button>
                </div>
              )}

              {selectedAppointment.status === "completed" && (
                <div className="space-y-3 pt-2">
                  <Button className="w-full" asChild>
                    <Link href={`/review/${selectedAppointment.id}`}>
                      Leave a Review
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/booking/${selectedAppointment.serviceId}`}>
                      Book Again
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      )}

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

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">HandyHive</h1>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="bg-accent" asChild>
              <Link href="/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">My Appointments</h2>
          <p className="text-muted-foreground">View and manage your scheduled services</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center my-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Appointments Tabs */}
        {!isLoading && !error && (
          <Tabs defaultValue="upcoming" className="space-y-6">
            <TabsList>
              <TabsTrigger value="upcoming" className="relative">
                Upcoming
                {filteredUpcomingAppointments.length > 0 && (
                  <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                    {filteredUpcomingAppointments.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {filteredUpcomingAppointments.length > 0 ? (
                <div className="grid gap-4">
                  {filteredUpcomingAppointments.map((appointment) => (
                    <AppointmentCard 
                      key={appointment.id}
                      appointment={appointment}
                      onViewDetails={() => setSelectedAppointment(appointment)}
                    />
                  ))}
                </div>
              ) : (
                <AppointmentEmptyState type="upcoming" />
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {filteredPastAppointments.length > 0 ? (
                <div className="grid gap-4">
                  {filteredPastAppointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      onViewDetails={() => setSelectedAppointment(appointment)}
                    />
                  ))}
                </div>
              ) : (
                <AppointmentEmptyState type="past" />
              )}
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
}