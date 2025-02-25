export interface AuthError {
    message: string;
    errors?: Record<string, string[]>;
}

export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    phone: string;
    userType: 'client' | 'provider';
    password: string;
    password_confirmation: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface ResetPasswordData {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    userType: string;
    status: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export interface UseAuthReturn {
    user: User | null;
    loading: boolean;
    error: AuthError | null;
    register: (data: RegisterData) => Promise<void>;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (data: ForgotPasswordData) => Promise<void>;
    resetPassword: (data: ResetPasswordData) => Promise<void>;
    resendVerification: () => Promise<void>;
}
