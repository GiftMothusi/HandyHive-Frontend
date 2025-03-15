'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Bell, Home, LogOut, Menu, Shield, 
  CheckCircle, Package, Users, Eye,
  AlertCircle, Check, X, AlertTriangle
} from "lucide-react";
import { api } from "@/lib/axios";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

// Types
interface ProviderService {
  id: number;
  provider_id: number;
  title: string;
  description: string;
  price: number;
  availability: string[];
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  provider: {
    user: {
      name: string;
      email: string;
    }
  };
}

interface StaffProfile {
  id: number;
  provider_id: number;
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
  provider: {
    user: {
      name: string;
      email: string;
    }
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const [pendingServices, setPendingServices] = useState<ProviderService[]>([]);
  const [pendingStaffProfiles, setPendingStaffProfiles] = useState<StaffProfile[]>([]);
  const [selectedService, setSelectedService] = useState<ProviderService | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingApproval, setProcessingApproval] = useState(false);
  const [itemType, setItemType] = useState<'service' | 'staff'>('service');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch pending services
        const servicesResponse = await api.get('/admin/pending-services');
        setPendingServices(servicesResponse.data.data);
        
        // Fetch pending staff profiles
        const staffResponse = await api.get('/admin/pending-staff');
        setPendingStaffProfiles(staffResponse.data.data);
        
        setError(null);
      } catch (err: unknown) {
        console.error('Failed to fetch pending items:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      router.push('/login');
    } catch (error: unknown) {
      console.error('Logout error:', error);
    }
  };
  
  const handleOpenApprovalDialog = (type: 'service' | 'staff', item: ProviderService | StaffProfile) => {
    setItemType(type);
    if (type === 'service') {
      setSelectedService(item as ProviderService);
      setSelectedProfile(null);
    } else {
      setSelectedProfile(item as StaffProfile);
      setSelectedService(null);
    }
    setApprovalDialogOpen(true);
  };
  
  const handleOpenRejectionDialog = (type: 'service' | 'staff', item: ProviderService | StaffProfile) => {
    setItemType(type);
    if (type === 'service') {
      setSelectedService(item as ProviderService);
      setSelectedProfile(null);
    } else {
      setSelectedProfile(item as StaffProfile);
      setSelectedService(null);
    }
    setRejectionReason("");
    setRejectionDialogOpen(true);
  };
  
  const handleApproval = async () => {
    setProcessingApproval(true);
    
    try {
      if (itemType === 'service' && selectedService) {
        await api.post(`/admin/approve-service/${selectedService.id}`, {
          status: 'approved'
        });
        
        // Update local state
        setPendingServices(prev => prev.filter(s => s.id !== selectedService.id));
      } else if (itemType === 'staff' && selectedProfile) {
        await api.post(`/admin/approve-staff/${selectedProfile.id}`, {
          status: 'approved'
        });
        
        // Update local state
        setPendingStaffProfiles(prev => prev.filter(p => p.id !== selectedProfile.id));
      }
      
      setApprovalDialogOpen(false);
    } catch (err: unknown) {
      console.error('Failed to approve item:', err);
      setError('Failed to approve item. Please try again.');
    } finally {
      setProcessingApproval(false);
    }
  };
  
  const handleRejection = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }
    
    setProcessingApproval(true);
    
    try {
      if (itemType === 'service' && selectedService) {
        await api.post(`/admin/approve-service/${selectedService.id}`, {
          status: 'rejected',
          rejection_reason: rejectionReason
        });
        
        // Update local state
        setPendingServices(prev => prev.filter(s => s.id !== selectedService.id));
      } else if (itemType === 'staff' && selectedProfile) {
        await api.post(`/admin/approve-staff/${selectedProfile.id}`, {
          status: 'rejected',
          rejection_reason: rejectionReason
        });
        
        // Update local state
        setPendingStaffProfiles(prev => prev.filter(p => p.id !== selectedProfile.id));
      }
      
      setRejectionDialogOpen(false);
    } catch (err: unknown) {
      console.error('Failed to reject item:', err);
      setError('Failed to reject item. Please try again.');
    } finally {
      setProcessingApproval(false);
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
          <div className="grid grid-cols-1 gap-6">
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
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Admin</p>
                  <p className="text-sm text-muted-foreground">admin@example.com</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start bg-accent" asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin Dashboard
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

      {/* Approval Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve {itemType === 'service' ? 'Service' : 'Staff Profile'}</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this {itemType === 'service' ? 'service' : 'staff profile'}?
              Once approved, it will be visible to clients.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {itemType === 'service' && selectedService && (
              <div className="space-y-2">
                <p><strong>Service:</strong> {selectedService.title}</p>
                <p><strong>Provider:</strong> {selectedService.provider.user.name}</p>
                <p><strong>Price:</strong> R{selectedService.price}</p>
              </div>
            )}
            
            {itemType === 'staff' && selectedProfile && (
              <div className="space-y-2">
                <p><strong>Name:</strong> {selectedProfile.name}</p>
                <p><strong>Position:</strong> {selectedProfile.position}</p>
                <p><strong>Provider:</strong> {selectedProfile.provider.user.name}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApprovalDialogOpen(false)} disabled={processingApproval}>
              Cancel
            </Button>
            <Button onClick={handleApproval} disabled={processingApproval} className="bg-green-600 hover:bg-green-700">
              {processingApproval ? "Processing..." : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {itemType === 'service' ? 'Service' : 'Staff Profile'}</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this {itemType === 'service' ? 'service' : 'staff profile'}.
              This reason will be shown to the service provider.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectionDialogOpen(false)} disabled={processingApproval}>
              Cancel
            </Button>
            <Button 
              onClick={handleRejection} 
              disabled={processingApproval || !rejectionReason.trim()} 
              variant="destructive"
            >
              {processingApproval ? "Processing..." : "Reject"}
            </Button>
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
              <Link href="/admin">
                <Shield className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <p className="text-muted-foreground">Manage service and staff approval requests</p>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingServices.length}</div>
              <p className="text-xs text-muted-foreground">
                Services awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending Staff Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingStaffProfiles.length}</div>
              <p className="text-xs text-muted-foreground">
                Staff profiles awaiting approval
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Pending Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingServices.length + pendingStaffProfiles.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Items requiring action
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Services
              {pendingServices.length > 0 && (
                <Badge variant="secondary">{pendingServices.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Staff Profiles
              {pendingStaffProfiles.length > 0 && (
                <Badge variant="secondary">{pendingStaffProfiles.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* Services Tab */}
          <TabsContent value="services">
            <Card>
              <CardHeader>
                <CardTitle>Pending Services</CardTitle>
                <CardDescription>
                  Review and approve service listings submitted by providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingServices.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingServices.map((service) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.title}</TableCell>
                          <TableCell>{service.provider.user.name}</TableCell>
                          <TableCell>R{service.price}</TableCell>
                          <TableCell>
                            {new Date(service.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenApprovalDialog('service', service)}
                                title="Approve"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenRejectionDialog('service', service)}
                                title="Reject"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No pending services</h3>
                    <p className="text-muted-foreground text-sm text-center">
                      All service submissions have been reviewed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Staff Profiles Tab */}
          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Pending Staff Profiles</CardTitle>
                <CardDescription>
                  Review and approve staff profiles submitted by providers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pendingStaffProfiles.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingStaffProfiles.map((profile) => (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.name}</TableCell>
                          <TableCell>{profile.position}</TableCell>
                          <TableCell>{profile.provider.user.name}</TableCell>
                          <TableCell>
                            {new Date(profile.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenApprovalDialog('staff', profile)}
                                title="Approve"
                              >
                                <Check className="h-4 w-4 text-green-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleOpenRejectionDialog('staff', profile)}
                                title="Reject"
                              >
                                <X className="h-4 w-4 text-red-600" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No pending staff profiles</h3>
                    <p className="text-muted-foreground text-sm text-center">
                      All staff profile submissions have been reviewed
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {(pendingServices.length > 0 || pendingStaffProfiles.length > 0) && (
          <Alert className="mt-6 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              There are {pendingServices.length + pendingStaffProfiles.length} items awaiting your approval. 
              Please review them to ensure they meet platform guidelines.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}