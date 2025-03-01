// src/components/appointment-empty-state.tsx
import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AppointmentEmptyStateProps {
  type: 'upcoming' | 'past';
}

export function AppointmentEmptyState({ type }: AppointmentEmptyStateProps) {
  return (
    <div className="text-center py-12 bg-muted/30 rounded-lg">
      {type === 'upcoming' ? (
        <>
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No upcoming appointments</h3>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have any upcoming appointments scheduled.
          </p>
          <Button asChild>
            <Link href="/booking">Book a Service</Link>
          </Button>
        </>
      ) : (
        <>
          <CheckCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No past appointments</h3>
          <p className="text-muted-foreground mb-6">
            You don&apos;t have any past appointments to display.
          </p>
          <Button asChild>
            <Link href="/booking">Book Your First Service</Link>
          </Button>
        </>
      )}
    </div>
  );
}