// src/app/booking/page.tsx
'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Search, 
  Star, 
  Clock, 
  Calendar,
  AlertCircle,
  Loader2,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useServiceProviders } from "@/contexts/ServiceProviderContext"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BookingPage() {
  const router = useRouter()
  const { serviceProviders, isLoading, error, refreshServiceProviders } = useServiceProviders()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  // Get unique categories from service providers
  const categories = ["all", ...Array.from(
    new Set(serviceProviders
      .filter(provider => provider && provider.category)
      .map(provider => provider.category.toLowerCase()))
  )]
  
  // Filter service providers
  const filteredProviders = serviceProviders.filter((provider) => {
    // Skip invalid providers
    if (!provider || !provider.name || !provider.category) return false
    
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (provider.description ? 
        provider.description.toLowerCase().includes(searchQuery.toLowerCase()) : 
        false)
      
    const matchesCategory = 
      selectedCategory === "all" || 
      provider.category.toLowerCase() === selectedCategory.toLowerCase()
      
    return matchesSearch && matchesCategory
  })

  // Handle provider selection
  const handleSelectProvider = (providerId: number) => {
    router.push(`/booking/${providerId}`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/appointments">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Book a Service</h1>
          <p className="text-muted-foreground">Select a service provider to continue</p>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for service providers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="w-full justify-start overflow-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category === "all" ? "All Categories" : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      {/* Error state */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshServiceProviders}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      
      {/* Service providers grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.length > 0 ? (
            filteredProviders.map((provider) => (
              <Card key={provider.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                  {provider.category}
                  <Badge className="absolute top-2 right-2">{provider.category}</Badge>
                </div>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{provider.name || 'No Name'}</h3>
                    <div className="flex items-center text-amber-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1">{provider.rating || '0.0'}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {provider.description || 'No description available'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-green-600">
                      <span className="font-bold">R{provider.hourlyRate || '0'}</span>
                      <span className="text-xs text-muted-foreground ml-1">/hour</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{provider.availability?.length || 0} days available</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full" onClick={() => handleSelectProvider(provider.id)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No service providers found matching your criteria.</p>
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
      )}
    </div>
  )
}