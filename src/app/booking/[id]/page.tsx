'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useServiceProviders } from "@/contexts/ServiceProviderContext"
import { useBooking } from "@/hooks/useBooking"
import { BookingData } from "@/types/appointment"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ServiceProvider {
  id: number;
  name: string;
  category: string;
  description: string;
  rating: number;
  hourlyRate: number;
  availability: string[];
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getServiceProviderById, isLoading: providerLoading } = useServiceProviders()
  const { createBooking, isLoading: bookingLoading, error } = useBooking()
  
  const [provider, setProvider] = useState<ServiceProvider | null>(null)
  const [date, setDate] = useState<string>("")
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [instructions, setInstructions] = useState<string>("")
  
  // Get available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  })
  
  // Available time slots
  const availableTimeSlots = [
    { value: "09:00", label: "9:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "11:00", label: "11:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "13:00", label: "1:00 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "15:00", label: "3:00 PM" },
    { value: "16:00", label: "4:00 PM" },
    { value: "17:00", label: "5:00 PM" }
  ]
  
  // Duration options
  const durationOptions = [
    { value: "1", label: "1 hour" },
    { value: "2", label: "2 hours" },
    { value: "3", label: "3 hours" },
    { value: "4", label: "4 hours" },
  ]

  useEffect(() => {
    // Fetch provider details
    if (!params.id) return;

    try {
      const providerId = parseInt(params.id)
      if (isNaN(providerId)) {
        console.error("Invalid provider ID:", params.id);
        return;
      }
      
      const providerData = getServiceProviderById(providerId)
      
      if (providerData) {
        setProvider(providerData)
      } else {
        console.error("Provider not found for ID:", providerId);
      }
    } catch (error) {
      console.error("Error fetching provider:", error);
    }
  }, [params.id, getServiceProviderById])
  
  // Calculate end time based on start time and duration
  const calculateEndTime = (startTime: string, duration: string) => {
    if (!startTime) return
    
    const [hours, minutes] = startTime.split(":").map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0)
    date.setTime(date.getTime() + parseInt(duration) * 60 * 60 * 1000)
    
    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  // Handle duration change
  const handleDurationChange = (duration: string) => {
    if (startTime) {
      const calculatedEndTime = calculateEndTime(startTime, duration)
      if (calculatedEndTime) {
        setEndTime(calculatedEndTime)
      }
    }
  }
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!provider || !date || !startTime || !endTime || !address) {
      return
    }
    
    // Prepare booking data
    const bookingData: BookingData = {
      providerId: provider.id,
      serviceId: provider.id, // For demo purposes, using provider ID as service ID
      date,
      startTime: `${date}T${startTime}:00`,
      endTime: `${date}T${endTime}:00`,
      location: address,
      accessInstructions: "",
      specialInstructions: instructions
    }
    
    // Create booking
    const result = await createBooking(bookingData)
    
    if (result) {
      // Redirect to appointments page
      router.push('/appointments')
    }
  }

  if (providerLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/booking">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Service Provider Not Found</h1>
        </div>
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            The requested service provider could not be found. Please try another provider.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/booking">Browse Service Providers</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/booking">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Book an Appointment</h1>
          <p className="text-muted-foreground">Fill in the details to schedule your service</p>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date selection */}
                <div className="space-y-2">
                  <Label htmlFor="date">Select Date</Label>
                  <Select value={date} onValueChange={setDate} required>
                    <SelectTrigger id="date">
                      <SelectValue placeholder="Select a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date) => (
                        <SelectItem key={date.value} value={date.value}>
                          {date.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Time selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Select 
                      value={startTime} 
                      onValueChange={(value) => {
                        setStartTime(value)
                        // Reset end time when start time changes
                        setEndTime("")
                      }}
                      required
                    >
                      <SelectTrigger id="start-time">
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTimeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select 
                      value={endTime ? "" : "1"} 
                      onValueChange={handleDurationChange}
                      disabled={!startTime}
                      required
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {durationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="address">Your Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      placeholder="Enter your full address"
                      className="pl-10"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {/* Special instructions */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Any special instructions or requests for the service provider..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows={4}
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={bookingLoading || !date || !startTime || !address}
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-b-0 border-r-0 rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>Confirm Booking</>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        {/* Service provider details */}
        <div>
          <Card>
            <div className="relative h-48 bg-gray-200 flex items-center justify-center">
              {provider.category}
              <Badge className="absolute top-2 right-2">{provider.category}</Badge>
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{provider.name}</h3>
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1">{provider.rating}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4">{provider.description}</p>
              
              {/* Pricing */}
              <div className="border-t pt-4 mb-4">
                <h4 className="font-medium mb-2">Pricing</h4>
                <div className="flex justify-between items-center">
                  <span>Hourly rate</span>
                  <span className="font-bold">R{provider.hourlyRate}</span>
                </div>
              </div>
              
              {/* Availability */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Available Days</h4>
                <div className="flex flex-wrap gap-2">
                  {provider.availability.map((day: string) => (
                    <Badge key={day} variant="secondary">{day}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <p>You&apos;ll only be charged after the service is completed</p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}