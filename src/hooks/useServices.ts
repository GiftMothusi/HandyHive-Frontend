// src/hooks/useServices.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';


interface UseServicesReturn {
  services: Service[];
  isLoading: boolean;
  error: string | null;
  fetchServices: (category?: string) => Promise<void>;
  getServiceById: (id: number) => Service | undefined;
}

interface Service {
  id: number;
  category: string;
  base_rate: number;
  description: string;
  requirements: {
    experience: string;
    equipment: string[];
    certification: string[];
  };
  availability: Record<string, boolean>;
  duration: {
    minimum: number;
    maximum: number;
  };
  status: string;
}

/**
 * Custom hook for handling services data
 */
export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch services from the API
   */
  const fetchServices = useCallback(async (category?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = category ? { category } : {};
      const response = await api.get('/api/services', { params });
      setServices(response.data.data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setError('Failed to load services. Please try again.');
      
      // Return mock data for now until backend is ready
      setServices(getMockServices());
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get a service by its ID
   */
  const getServiceById = useCallback((id: number): Service | undefined => {
    return services.find(service => service.id === id);
  }, [services]);

  // Fetch services on mount
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  /**
   * Generate mock services data for development
   */
  const getMockServices = (): Service[] => {
    return [
      {
        id: 1,
        category: 'Domestic Worker',
        base_rate: 25.00,
        description: 'Professional cleaning services for homes and apartments.',
        requirements: {
          experience: '1+ years of experience',
          equipment: ['cleaning supplies', 'vacuum cleaner'],
          certification: []
        },
        availability: {
          weekdays: true,
          weekends: true,
          holidays: false
        },
        duration: {
          minimum: 2,
          maximum: 8
        },
        status: 'active'
      },
      {
        id: 2,
        category: 'Gardener',
        base_rate: 30.00,
        description: 'Professional gardening services for homes and businesses.',
        requirements: {
          experience: '1+ years of experience',
          equipment: ['gardening tools', 'lawn mower'],
          certification: []
        },
        availability: {
          weekdays: true,
          weekends: true,
          holidays: false
        },
        duration: {
          minimum: 2,
          maximum: 8
        },
        status: 'active'
      },
      {
        id: 3,
        category: 'Chef',
        base_rate: 45.00,
        description: 'Professional cooking services for special events and meal preparation.',
        requirements: {
          experience: '2+ years of experience',
          equipment: ['cooking utensils'],
          certification: ['food safety']
        },
        availability: {
          weekdays: true,
          weekends: true,
          holidays: true
        },
        duration: {
          minimum: 3,
          maximum: 8
        },
        status: 'active'
      },
      {
        id: 4,
        category: 'Tutor',
        base_rate: 35.00,
        description: 'Professional tutoring services for students of all ages.',
        requirements: {
          experience: '1+ years of experience',
          equipment: ['teaching materials'],
          certification: ['teaching qualification']
        },
        availability: {
          weekdays: true,
          weekends: true,
          holidays: false
        },
        duration: {
          minimum: 1,
          maximum: 4
        },
        status: 'active'
      },
      {
        id: 5,
        category: 'Handyman',
        base_rate: 40.00,
        description: 'Professional handyman services for home repairs and maintenance.',
        requirements: {
          experience: '2+ years of experience',
          equipment: ['tools'],
          certification: []
        },
        availability: {
          weekdays: true,
          weekends: true,
          holidays: false
        },
        duration: {
          minimum: 1,
          maximum: 8
        },
        status: 'active'
      }
    ];
  };

  return {
    services,
    isLoading,
    error,
    fetchServices,
    getServiceById
  };
}