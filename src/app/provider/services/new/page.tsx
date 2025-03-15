'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Package, Check } from "lucide-react";
import { api } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";

const DAYS_OF_WEEK = [
  { id: "mon", label: "Monday" },
  { id: "tue", label: "Tuesday" },
  { id: "wed", label: "Wednesday" },
  { id: "thu", label: "Thursday" },
  { id: "fri", label: "Friday" },
  { id: "sat", label: "Saturday" },
  { id: "sun", label: "Sunday" },
];

export default function AddServicePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    availability: [] as string[],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        availability: [...prev.availability, day]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        availability: prev.availability.filter(d => d !== day)
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.price || formData.availability.length === 0) {
      setError("Please fill in all required fields and select at least one day of availability.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Convert price to number
      const payload = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      await api.post('/provider/services', payload);
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        availability: [],
      });
      
      // Redirect after delay
      setTimeout(() => {
        router.push('/provider');
      }, 2000);
    } catch (err: unknown) {
      console.error('Failed to create service:', err);
      setError(
        err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data 
        ? String(err.response.data.message) 
        : "Failed to create service. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="container mx-auto max-w-md mt-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-green-100 rounded-full p-3">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold">Service Created!</h2>
                <p className="text-muted-foreground">
                  Your service has been created successfully and is now pending approval from administrators. You will be notified once it&apos;s approved.
                </p>
                <Button asChild className="mt-4">
                  <Link href="/provider">
                    Return to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/provider">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-2xl">Add New Service</CardTitle>
                <CardDescription>
                  Create a new service to offer to clients
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleTextChange}
                  placeholder="e.g., House Cleaning, Garden Maintenance"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleTextChange}
                  placeholder="Describe your service in detail, including what's included and any special features"
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price (R)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3">R</span>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleTextChange}
                    className="pl-8"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Enter the base price per hour for this service
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Available Days</Label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={day.id}
                        checked={formData.availability.includes(day.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(day.id, checked as boolean)}
                      />
                      <Label htmlFor={day.id} className="cursor-pointer">
                        {day.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 mb-6">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    Your service will be reviewed by administrators before it becomes available to clients.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-3 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push('/provider')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Service"}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}