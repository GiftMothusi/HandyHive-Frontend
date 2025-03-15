'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { 
  Bell, Calendar, Home, LogOut, Menu, 
  User, Package, Users, PlusCircle, AlertCircle,
  ChevronRight
} from "lucide-react";
import { api } from "@/lib/axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

// Types
interface ProviderService {
  id: number;
  title: string;
  description: string;
  price: number;
  availability: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

interface StaffProfile {
  id: number;
  name: string;
  position: string;
  bio: string;
  skills: string[];
  profile_image?: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

export default function ProviderDashboardPage() {
  const router = useRouter();
  
  const [services, setServices] = useState<ProviderService[]>([]);
  const [staffProfiles, setStaffProfiles] = useState<StaffProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First check if user is authenticated as a provider
        const userResponse = await api.get('/auth/user');
        
        if (!userResponse.data || userResponse.data.user_type !== 'provider') {
          console.error('User is not authenticated as a provider');
          setError('You must be logged in as a service provider to access this dashboard.');
          setLoading(false);
          return;
        }
        
        // Fetch services with simplified approach
        const servicesResponse = await api.get('/provider/services');
        
        if (servicesResponse.data && servicesResponse.data.data) {
          setServices(servicesResponse.data.data);
        } else {
          console.warn('Unexpected services response format:', servicesResponse.data);
          setServices([]);
        }
        
        // Fetch staff profiles with simplified approach
        const staffResponse = await api.get('/provider/staff');
        
        if (staffResponse.data && staffResponse.data.data) {
          setStaffProfiles(staffResponse.data.data);
        } else {
          console.warn('Unexpected staff response format:', staffResponse.data);
          setStaffProfiles([]);
        }
        
        setError(null);
      } catch (err: unknown) {
        console.error('Failed to fetch provider data:', err);
        
        // Improved error handling with detailed logging
        if (err && typeof err === 'object' && 'response' in err) {
          const errorResponse = err.response as {
            status?: number;
            statusText?: string;
            data?: unknown;
          };
          console.error('API Error details:', {
            status: errorResponse?.status,
            statusText: errorResponse?.statusText,
            data: errorResponse?.data
          });
        }
        
        setError('Failed to load provider data. Please ensure you are logged in as a provider.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Import useAuth hook for better logout handling
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      // Use the improved logout function from useAuth hook
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback logout if the hook fails
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "userType=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('userType');
      router.push('/login');
    }
  };
  
  const getStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
        </div>
      </div>
    );
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
                  <AvatarFallback>SP</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Service Provider</p>
                  <p className="text-sm text-muted-foreground">provider@example.com</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/provider">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start bg-accent" asChild>
                <Link href="/provider/dashboard">
                  <Package className="mr-2 h-4 w-4" />
                  Provider Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/provider/appointments">
                  <Calendar className="mr-2 h-4 w-4" />
                  Appointments
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/provider/profile">
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
              <Link href="/provider">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" className="bg-accent" asChild>
              <Link href="/provider/dashboard">
                <Package className="mr-2 h-4 w-4" />
                Provider Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/provider/appointments">
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
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Service Provider Dashboard</h2>
          <p className="text-muted-foreground">Manage your services and staff profiles</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="staff">Staff Profiles</TabsTrigger>
          </TabsList>
          
          {/* Services Tab */}
          <TabsContent value="services">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your Services</h3>
              <Button asChild>
                <Link href="/provider/services/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Service
                </Link>
              </Button>
            </div>
            
            {services.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                  <Card key={service.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        {getStatusBadge(service.status)}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">R{service.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Available days:</span>
                          <span className="font-medium">{service.availability.length}</span>
                        </div>
                        
                        {service.status === 'rejected' && service.rejection_reason && (
                          <div className="mt-2 text-red-600 text-xs">
                            <p className="font-medium">Rejection reason:</p>
                            <p>{service.rejection_reason}</p>
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2" 
                          asChild
                        >
                          <Link href={`/provider/services/${service.id}`}>
                            Manage Service
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No services yet</h3>
                  <p className="text-muted-foreground text-sm mb-4 text-center">
                    You haven&apos;t added any services yet. Add your first service to start receiving bookings.
                  </p>
                  <Button asChild>
                    <Link href="/provider/services/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Service
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Staff Profiles Tab */}
          <TabsContent value="staff">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your Staff Profiles</h3>
              <Button asChild>
                <Link href="/provider/staff/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Staff Profile
                </Link>
              </Button>
            </div>
            
            {staffProfiles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffProfiles.map((profile) => (
                  <Card key={profile.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-gray-200 flex items-center justify-center">
                      {profile.profile_image ? (
                        <Image 
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${profile.profile_image}`} 
                          alt={profile.name} 
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <User className="h-12 w-12 text-gray-400" />
                      )}
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{profile.name}</CardTitle>
                        {getStatusBadge(profile.status)}
                      </div>
                      <CardDescription>{profile.position}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p className="line-clamp-2">{profile.bio}</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary">{skill}</Badge>
                          ))}
                          {profile.skills.length > 3 && (
                            <Badge variant="outline">+{profile.skills.length - 3} more</Badge>
                          )}
                        </div>
                        
                        {profile.status === 'rejected' && profile.rejection_reason && (
                          <div className="mt-2 text-red-600 text-xs">
                            <p className="font-medium">Rejection reason:</p>
                            <p>{profile.rejection_reason}</p>
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-2" 
                          asChild
                        >
                          <Link href={`/provider/staff/${profile.id}`}>
                            Manage Profile
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No staff profiles yet</h3>
                  <p className="text-muted-foreground text-sm mb-4 text-center">
                    You haven&apos;t added any staff profiles yet. Add staff profiles to showcase your team.
                  </p>
                  <Button asChild>
                    <Link href="/provider/staff/new">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Your First Staff Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
              <p className="text-xs text-muted-foreground">
                {services.filter(s => s.status === 'approved').length} Approved
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Staff Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{staffProfiles.length}</div>
              <p className="text-xs text-muted-foreground">
                {staffProfiles.filter(p => p.status === 'approved').length} Approved
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {services.filter(s => s.status === 'pending').length + 
                 staffProfiles.filter(p => p.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting admin review
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}