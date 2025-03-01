'use client'

import { PropsWithChildren } from 'react'
import { AppointmentProvider } from '@/contexts/AppointmentContext'
import { ServiceProviderProvider } from '@/contexts/ServiceProviderContext'

export function Providers({ children }: PropsWithChildren) {
  return (
    <AppointmentProvider>
       <ServiceProviderProvider>
        {children}
      </ServiceProviderProvider>
    </AppointmentProvider>
  )
}