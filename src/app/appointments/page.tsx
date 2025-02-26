"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  Calendar,
  Clock,
  Home,
  LogOut,
  MapPin,
  Menu,
  MoreHorizontal,
  Search,
  User,
  X,
  CheckCircle,
  AlertCircle,
  CalendarClock,
  ArrowRight,
  Star,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"


// Types
interface User {
  name: string
  email: string
}

interface Appointment {
  id: string
  serviceId: number
  serviceName: string
  serviceCategory: string
  serviceImage: string
  providerName: string
  date: string
  time: string
  duration: string
  location: string
  price: number
  status: "confirmed" | "completed" | "cancelled" | "pending"
  notes?: string
}

// Mock user data
const user: User = {
  name: "John Doe",
  email: "john.doe@example.com",
}

// Mock appointment data
const APPOINTMENTS: Appointment[] = [
  {
    id: "apt-001",
    serviceId: 1,
    serviceName: "House Cleaning",
    serviceCategory: "Domestic Worker",
    serviceImage: "",
    providerName: "Maria Johnson",
    date: "February 26, 2025",
    time: "9:00 AM - 11:00 AM",
    duration: "2 hours",
    location: "123 Main Street, Apt 4B",
    price: 50,
    status: "confirmed",
    notes: "Please focus on kitchen and bathrooms.",
  },
  {
    id: "apt-002",
    serviceId: 2,
    serviceName: "Garden Maintenance",
    serviceCategory: "Gardener",
    serviceImage: "",
    providerName: "John Smith",
    date: "March 3, 2025",
    time: "2:00 PM - 5:00 PM",
    duration: "3 hours",
    location: "123 Main Street, Apt 4B",
    price: 90,
    status: "confirmed",
  },
  {
    id: "apt-003",
    serviceId: 3,
    serviceName: "Dinner Preparation",
    serviceCategory: "Chef",
    serviceImage: "",
    providerName: "Chef Antonio",
    date: "March 10, 2025",
    time: "5:00 PM - 8:00 PM",
    duration: "3 hours",
    location: "123 Main Street, Apt 4B",
    price: 135,
    status: "pending",
  },
  {
    id: "apt-004",
    serviceId: 4,
    serviceName: "Math Tutoring",
    serviceCategory: "Tutor",
    serviceImage: "",
    providerName: "Sarah Williams",
    date: "January 15, 2025",
    time: "4:00 PM - 6:00 PM",
    duration: "2 hours",
    location: "123 Main Street, Apt 4B",
    price: 70,
    status: "completed",
  },
  {
    id: "apt-005",
    serviceId: 1,
    serviceName: "Deep Cleaning",
    serviceCategory: "Domestic Worker",
    serviceImage: "",
    providerName: "David Chen",
    date: "January 5, 2025",
    time: "10:00 AM - 2:00 PM",
    duration: "4 hours",
    location: "123 Main Street, Apt 4B",
    price: 112,
    status: "completed",
  },
  {
    id: "apt-006",
    serviceId: 2,
    serviceName: "Lawn Mowing",
    serviceCategory: "Gardener",
    serviceImage: "",
    providerName: "Michael Brown",
    date: "December 20, 2024",
    time: "11:00 AM - 1:00 PM",
    duration: "2 hours",
    location: "123 Main Street, Apt 4B",
    price: 64,
    status: "cancelled",
  },
]

export default function AppointmentsPage() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)

  // Filter appointments based on search query
  const filteredAppointments = APPOINTMENTS.filter((appointment) => {
    const searchString =
      `${appointment.serviceName} ${appointment.serviceCategory} ${appointment.providerName}`.toLowerCase()
    return searchString.includes(searchQuery.toLowerCase())
  })

  // Split appointments into upcoming and past
  const today = new Date()
  const upcomingAppointments = filteredAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate >= today && appointment.status !== "cancelled"
  })

  const pastAppointments = filteredAppointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate < today || appointment.status === "cancelled"
  })

  const handleLogout = async () => {
    try {
      // Try the API logout first
      try {
        await fetch("/api/auth/logout", { method: "POST" })
      } catch (apiError) {
        console.warn("API logout failed, continuing with local logout:", apiError)
      }

      // Even if API fails, clear local auth state
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleCancelAppointment = () => {
    // In a real app, this would call an API to cancel the appointment
    setCancelDialogOpen(false)
    // For demo purposes, we'll just close the dialog
    // You would typically update the appointment status here
  }

  const handleRescheduleAppointment = () => {
    // In a real app, this would navigate to a reschedule page or update the appointment
    setRescheduleDialogOpen(false)
    // For demo purposes, we'll just close the dialog
  }

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Confirmed</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Cancelled</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="" alt={user?.name || "User"}/>
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
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
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image
                    src={selectedAppointment.serviceImage}
                    alt={selectedAppointment.serviceName}
                    className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => setSelectedAppointment(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                  <h2 className="text-white font-bold">{selectedAppointment.serviceName}</h2>
                  <p className="text-white/80 text-sm">{selectedAppointment.serviceCategory}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="font-medium text-lg">Appointment Details</h3>
                {getStatusBadge(selectedAppointment.status)}
              </div>

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
                      {selectedAppointment.time} ({selectedAppointment.duration})
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedAppointment.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-medium">Price</p>
                    <p className="text-sm text-muted-foreground">R{selectedAppointment.price}</p>
                  </div>
                </div>
                {selectedAppointment.notes && (
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">{selectedAppointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {selectedAppointment.status === "confirmed" && (
                <div className="space-y-3 pt-2">
                  <Button variant="outline" className="w-full" onClick={() => setRescheduleDialogOpen(true)}>
                    <CalendarClock className="mr-2 h-4 w-4" />
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
                      <Star className="mr-2 h-4 w-4" />
                      Leave a Review
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/booking/${selectedAppointment.serviceId}`}>
                      <ArrowRight className="mr-2 h-4 w-4" />
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
            <h1 className="text-xl font-bold">HomeHelp</h1>
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
              <AvatarImage src="" alt={user?.name || "User"}  />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
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

        {/* Appointments Tabs */}
        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList>
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {upcomingAppointments.length > 0 && (
                <span className="ml-2 rounded-full bg-primary text-primary-foreground text-xs px-2 py-0.5">
                  {upcomingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            {upcomingAppointments.length > 0 ? (
              <div className="grid gap-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/4 h-32 md:h-auto">
                        <Image 
                            src={appointment.serviceImage || ""}
                            alt={appointment.serviceName}
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{appointment.serviceName}</h3>
                              {getStatusBadge(appointment.status)}
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
                              <p className="font-bold text-lg">R{appointment.price}</p>
                              <p className="text-xs text-muted-foreground">{appointment.duration}</p>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Actions</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedAppointment(appointment)}>
                                  View Details
                                </DropdownMenuItem>
                                {appointment.status === "confirmed" && (
                                  <>
                                    <DropdownMenuItem onClick={() => setRescheduleDialogOpen(true)}>
                                      Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-600"
                                      onClick={() => setCancelDialogOpen(true)}
                                    >
                                      Cancel
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                    <CardFooter className="bg-muted/50 px-6 py-3 flex justify-end">
                      <Button variant="ghost" onClick={() => setSelectedAppointment(appointment)}>
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
                <p className="text-muted-foreground mb-6">You don&apos;t have any upcoming appointments scheduled.</p>
                <Button asChild>
                  <Link href="/dashboard">Book a Service</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            {pastAppointments.length > 0 ? (
              <div className="grid gap-4">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/4 h-32 md:h-auto">
                        <Image
                            src={appointment.serviceImage || ""}
                            alt={appointment.serviceName}
                            className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">{appointment.serviceName}</h3>
                              {getStatusBadge(appointment.status)}
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
                              <p className="font-bold text-lg">R{appointment.price}</p>
                              <p className="text-xs text-muted-foreground">{appointment.duration}</p>
                            </div>

                            <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(appointment)}>
                              Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                    {appointment.status === "completed" && (
                      <CardFooter className="bg-muted/50 px-6 py-3 flex justify-end gap-2">
                        <Button variant="outline" asChild>
                          <Link href={`/booking/${appointment.serviceId}`}>Book Again</Link>
                        </Button>
                        <Button asChild>
                          <Link href={`/review/${appointment.id}`}>Leave a Review</Link>
                        </Button>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg">
                <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No past appointments</h3>
                <p className="text-muted-foreground mb-6">You don&apos;t have any past appointments to display.</p>
                <Button asChild>
                  <Link href="/dashboard">Book Your First Service</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

