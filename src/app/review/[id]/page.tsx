'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Star, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppointments } from "@/contexts/AppointmentContext";
import { Appointment, ReviewData } from "@/types/appointment";

export default function ReviewPage({ params }: { params: { id: string } }) {
  const { getAppointmentById, submitReview } = useAppointments();
  
  const [appointment, setAppointment] = useState<Appointment | undefined>(undefined);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get appointment details
    const appointmentData = getAppointmentById(params.id);
    
    if (!appointmentData) {
      setError("Appointment not found");
      return;
    }

    setAppointment(appointmentData);
  }, [params.id, getAppointmentById]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appointment) return;
    if (rating === 0) return;
    
    setIsLoading(true);
    setError(null);

    const reviewData: ReviewData = {
      appointmentId: appointment.id,
      rating,
      review,
      categories: {
        punctuality: rating,
        quality: rating,
        communication: rating,
        professionalism: rating
      }
    };

    try {
      await submitReview(reviewData);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Failed to submit review:", err);
      setError("Failed to submit your review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
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
              <div className="text-center text-red-600">
                <p>{error}</p>
                <Button 
                  className="mt-4" 
                  variant="outline" 
                  asChild
                >
                  <Link href="/appointments">Return to Appointments</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Thank You!</CardTitle>
            <CardDescription>Your review has been submitted successfully</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              Your feedback helps others make informed decisions and helps service providers improve.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" asChild>
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/appointments">View My Appointments</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>Share your experience with {appointment.providerName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback>{appointment.providerName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{appointment.providerName}</h3>
                <p className="text-sm text-muted-foreground">{appointment.serviceCategory}</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.serviceName} • {appointment.date}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Rate your experience</h3>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="text-2xl focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {rating === 1 && "Poor - Not satisfied with the service"}
                {rating === 2 && "Fair - Below expectations"}
                {rating === 3 && "Good - Met expectations"}
                {rating === 4 && "Very Good - Above expectations"}
                {rating === 5 && "Excellent - Exceptional service"}
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Write your review</h3>
                <Textarea
                  placeholder="Share details of your experience with this service provider..."
                  className="min-h-32"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || rating === 0}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Review
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}