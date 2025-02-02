export interface User {
    id: string;
    userType: 'client' | 'provider' | 'admin';
    email: string;
    phone: string;
    fullName: string;
    idNumber: string;
    dateOfBirth: string;
    address: {
        street: string;
        city: string;
        province: string;
        postalCode: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    verified: {
        email: boolean;
        phone: boolean;
        identity: boolean;
        address: boolean;
    };
    status: 'active' | 'suspended' | 'inactive';
    rating: number;
    completedJobs: number;
    created_at: string;
    updated_at: string;
    last_login: string;
}

export interface Service {
    id: string;
    category: 'cleaning' | 'gardening' | 'babysitting' | 'cooking' | 'handyman';
    baseRate: number;
    description: string;
    requirements: {
        experience: string;
        equipment: string[];
        certification: string[];
    };
    availability: {
        weekdays: boolean;
        weekends: boolean;
        holidays: boolean;
    };
    duration: {
        minimum: number;
        maximum: number;
    };
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface Booking {
    id: string;
    client_id: string;
    provider_id: string;
    service_id: string;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    start_time: string;
    end_time: string;
    location: {
        address: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
        access_instructions: string;
    };
    requirements: {
        special_instructions: string;
        equipment_needed: string[];
        pets_present: boolean;
    };
    price: {
        base_amount: number;
        premium: number;
        discount: number;
        final_amount: number;
        commission: number;
    };
    payment_status: 'pending' | 'paid' | 'refunded';
    created_at: string;
    updated_at: string;
}

export interface Rating {
    id: string;
    booking_id: string;
    rater_id: string;
    ratee_id: string;
    scores: {
        punctuality: number;
        quality: number;
        communication: number;
        professionalism: number;
    };
    average_score: number;
    comment: string;
    created_at: string;
}