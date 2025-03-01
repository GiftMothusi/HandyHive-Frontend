// src/contexts/ServiceProviderContext.tsx

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { ServiceProvider } from '@/types/appointment';
import { api } from '@/lib/axios';

interface ServiceProviderContextType {
  serviceProviders: ServiceProvider[];
  isLoading: boolean;
  error: string | null;
  refreshServiceProviders: () => Promise<void>;
  getServiceProviderById: (id: number) => ServiceProvider | undefined;
  filterProvidersByCategory: (category: string | null) => ServiceProvider[];
  filterProvidersBySearch: (query: string) => ServiceProvider[];
}

const ServiceProviderContext = createContext<ServiceProviderContextType>({
  serviceProviders: [],
  isLoading: true,
  error: null,
  refreshServiceProviders: async () => {},
  getServiceProviderById: () => undefined,
  filterProvidersByCategory: () => [],
  filterProvidersBySearch: () => []
});

export function ServiceProviderProvider({ children }: { children: ReactNode }) {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Refresh service providers function
  const refreshServiceProviders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fix: Use the correct API endpoint with the api instance
      const response = await api.get('/services/1/providers');
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        console.log("Service providers loaded:", response.data.data.length);
        setServiceProviders(response.data.data);
      } else {
        console.error("Invalid response format:", response.data);
        setError('Failed to load service providers. Invalid data format.');
        // Fall back to seeded data if API fails
        fetchSeedProviders();
      }
    } catch (err) {
      console.error('Failed to fetch service providers:', err);
      setError('Failed to load service providers. Please check your connection and try again.');
      // Fall back to seeded data if API fails
      fetchSeedProviders();
    } finally {
      setIsLoading(false);
    }
  };

  // A fallback function to load seed data if the API fails
  const fetchSeedProviders = () => {
    // Use the seeded providers from InitialDataSeeder
    const seedProviders: ServiceProvider[] = [
      {
        id: 1,
        name: "Maria Johnson",
        category: "Domestic Worker",
        description: "Experienced housekeeper with 5+ years of experience in cleaning, laundry, and organizing.",
        hourlyRate: 25.00,
        rating: 4.8,
        availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        image: "maria-johnson.jpg"
      },
      {
        id: 2,
        name: "John Smith",
        category: "Gardener",
        description: "Professional gardener specializing in landscape design, plant care, and garden maintenance.",
        hourlyRate: 30.00,
        rating: 4.7,
        availability: ["Mon", "Wed", "Fri", "Sat"],
        image: "john-smith.jpg"
      },
      {
        id: 3,
        name: "Chef Antonio",
        category: "Chef",
        description: "Culinary expert with experience in various cuisines. Available for meal prep and special events.",
        hourlyRate: 45.00,
        rating: 4.9,
        availability: ["Tue", "Thu", "Sat", "Sun"],
        image: "chef-antonio.jpg"
      },
      {
        id: 4,
        name: "Sarah Williams",
        category: "Tutor",
        description: "Certified teacher offering tutoring in mathematics, science, and English for all grade levels.",
        hourlyRate: 35.00,
        rating: 4.6,
        availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        image: "sarah-williams.jpg"
      },
      {
        id: 5,
        name: "David Chen",
        category: "Domestic Worker",
        description: "Reliable house cleaner with attention to detail and excellent references.",
        hourlyRate: 28.00,
        rating: 4.5,
        availability: ["Wed", "Thu", "Fri", "Sat"],
        image: "david-chen.jpg"
      },
      {
        id: 6,
        name: "Michael Brown",
        category: "Gardener",
        description: "Experienced gardener specializing in organic gardening and sustainable practices.",
        hourlyRate: 32.00,
        rating: 4.7,
        availability: ["Mon", "Tue", "Sat", "Sun"],
        image: "michael-brown.jpg"
      }
    ];
    
    setServiceProviders(seedProviders);
  };

  // Initialize on mount
  useEffect(() => {
    refreshServiceProviders();
  }, []);

  // Get a specific service provider by ID
  const getServiceProviderById = (id: number): ServiceProvider | undefined => {
    return serviceProviders.find(provider => provider.id === id);
  };

  // Filter providers by category
  const filterProvidersByCategory = (category: string | null): ServiceProvider[] => {
    if (!category || category === 'all') {
      return serviceProviders;
    }
    
    return serviceProviders.filter(provider => 
      provider.category && provider.category.toLowerCase() === category.toLowerCase()
    );
  };

  // Filter providers by search query
  const filterProvidersBySearch = (query: string): ServiceProvider[] => {
    if (!query) {
      return serviceProviders;
    }
    
    const lowerCaseQuery = query.toLowerCase();
    
    return serviceProviders.filter(provider => {
      if (!provider) return false;
      
      const nameMatch = provider.name ? 
        provider.name.toLowerCase().includes(lowerCaseQuery) : false;
        
      const categoryMatch = provider.category ? 
        provider.category.toLowerCase().includes(lowerCaseQuery) : false;
        
      const descriptionMatch = provider.description ? 
        provider.description.toLowerCase().includes(lowerCaseQuery) : false;
        
      return nameMatch || categoryMatch || descriptionMatch;
    });
  };

  return (
    <ServiceProviderContext.Provider
      value={{
        serviceProviders,
        isLoading,
        error,
        refreshServiceProviders,
        getServiceProviderById,
        filterProvidersByCategory,
        filterProvidersBySearch,
      }}
    >
      {children}
    </ServiceProviderContext.Provider>
  );
}

// Custom hook to use the service provider context
export function useServiceProviders() {
  const context = useContext(ServiceProviderContext);
  
  if (!context) {
    throw new Error('useServiceProviders must be used within a ServiceProviderProvider');
  }
  
  return context;
}