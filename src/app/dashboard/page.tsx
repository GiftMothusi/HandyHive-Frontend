"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bell, Calendar, Home, LogOut, Menu, Search, Settings, User, X, Star, Clock } from "lucide-react"
import { api } from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

// Types
interface User {
  name: string
  email: string
}

interface Service {
  id: number
  name: string
  category: string
  description: string
  price: number
  rating: number
  image: string
  availability: string[]
}

// Mock data for services
const SERVICES: Service[] = [
  {
    id: 1,
    name: "Maria Johnson",
    category: "Domestic Worker",
    description: "Experienced housekeeper with 5+ years of experience in cleaning, laundry, and organizing.",
    price: 25,
    rating: 4.8,
    image: "/placeholder.svg?height=400&width=400",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: 2,
    name: "John Smith",
    category: "Gardener",
    description: "Professional gardener specializing in landscape design, plant care, and garden maintenance.",
    price: 30,
    rating: 4.7,
    image: "/placeholder.svg?height=400&width=400",
    availability: ["Mon", "Wed", "Fri", "Sat"],
  },
  {
    id: 3,
    name: "Chef Antonio",
    category: "Chef",
    description: "Culinary expert with experience in various cuisines. Available for meal prep and special events.",
    price: 45,
    rating: 4.9,
    image: "/placeholder.svg?height=400&width=400",
    availability: ["Tue", "Thu", "Sat", "Sun"],
  },
  {
    id: 4,
    name: "Sarah Williams",
    category: "Tutor",
    description: "Certified teacher offering tutoring in mathematics, science, and English for all grade levels.",
    price: 35,
    rating: 4.6,
    image: "/placeholder.svg?height=400&width=400",
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: 5,
    name: "David Chen",
    category: "Domestic Worker",
    description: "Reliable house cleaner with attention to detail and excellent references.",
    price: 28,
    rating: 4.5,
    image: "/placeholder.svg?height=400&width=400",
    availability: ["Wed", "Thu", "Fri", "Sat"],
  },
  {
    id: 6,
    name: "Michael Brown",
    category: "Gardener",
    description: "Experienced gardener specializing in organic gardening and sustainable practices.",
    price: 32,
    rating: 4.7,
    image: "/placeholder.svg?height=400&width=400",
    availability: ["Mon", "Tue", "Sat", "Sun"],
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/user")
        setUser(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        router.push("/login")
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = async () => {
    try {
      // Try the API logout first
      try {
        await api.post("/auth/logout")
      } catch (apiError) {
        console.warn("API logout failed, continuing with local logout:", apiError)
      }

      // Even if API fails, clear local auth state
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      setError("Logout failed. Please try again.")
    }
  }

  // Filter services based on search query and category
  const filteredServices = SERVICES.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === "all" || service.category.toLowerCase() === selectedCategory.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Categories for filtering
  const categories = ["all", ...Array.from(new Set(SERVICES.map((service) => service.category.toLowerCase())))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt={user?.name || "User"} />
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
              <Button variant="ghost" className="w-full justify-start" asChild>
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
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
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

      {/* Service Detail Modal */}
      {selectedService && (
        <Sheet open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
          <SheetContent className="sm:max-w-md overflow-auto">
            <div className="space-y-4">
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <img
                  src={selectedService.image || "/placeholder.svg"}
                  alt={selectedService.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                  onClick={() => setSelectedService(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div>
                <h2 className="text-2xl font-bold">{selectedService.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline">{selectedService.category}</Badge>
                  <div className="flex items-center text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1 text-sm">{selectedService.rating}</span>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">{selectedService.description}</p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Price</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">R{selectedService.price}</span>
                  <span className="text-muted-foreground">per hour</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">Availability</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedService.availability.map((day) => (
                    <Badge key={day} variant="secondary">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <h3 className="font-medium">Select Date & Time</h3>
                <div className="grid grid-cols-3 gap-2">
                  {["Today", "Tomorrow", "Wed, 26 Feb"].map((date) => (
                    <Button key={date} variant="outline" className="h-auto py-2">
                      {date}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"].map((time) => (
                    <Button key={time} variant="outline" className="h-auto py-2">
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <Button className="w-full mt-6" size="lg" asChild>
                <Link href={`/booking/${selectedService.id}/payment`}>Book Appointment</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}

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
            <Button variant="ghost" size="sm" asChild>
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
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
          <p className="text-muted-foreground">Find and book services for your home</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for services..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full justify-start overflow-auto">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category === "all" ? "All Services" : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 right-2">{service.category}</Badge>
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{service.name}</h3>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1">{service.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600">
                      <span className="font-bold">R{service.price}</span>
                      <span className="text-xs text-muted-foreground ml-1">/hour</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{service.availability.length} days available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" onClick={() => setSelectedService(service)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No services found matching your criteria.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

