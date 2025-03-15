// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import type {
    User,
    AuthError,
    LoginCredentials,
    RegisterData,
    ResetPasswordData,
    ForgotPasswordData,
    UseAuthReturn,
} from '@/types/auth';

export function useAuth(): UseAuthReturn {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Set the Authorization header for future requests
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    // Fetch the user profile
                    const response = await api.get('/user');
                    setUser(response.data);
                    
                    // Store username and email in localStorage for easier access
                    if (response.data.name) {
                        localStorage.setItem('username', response.data.name);
                    }
                    if (response.data.email) {
                        localStorage.setItem('email', response.data.email);
                    }
                } catch (err) {
                    // If the token is invalid, clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('email');
                    delete api.defaults.headers.common['Authorization'];
                    throw err;
                }
            }
        };
        
        checkAuth();
    }, []);

    const register = async (data: RegisterData): Promise<void> => {
        setLoading(true);
        setError(null);
        
        try {
            // Add detailed logging for debugging
            console.log('Sending registration data to API:', {
                ...data,
                password: '[REDACTED]',
                password_confirmation: '[REDACTED]'
            });
            
            const response = await api.post('/auth/register', data);
            console.log('Registration API response:', response.data);
            
            // If we get here, registration was successful
            // Redirect to login page with success message
            router.push('/login?registered=true');
        } catch (err: unknown) {
            console.error('Registration error:', err);
            
            // Enhanced error handling
            const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
            if (error.response && error.response.data) {
                // Use the error format from the backend
                setError({
                    message: error.response.data.message || 'Registration failed. Please try again.',
                    errors: error.response.data.errors || {}
                });
            } else if (error && typeof error === 'object' && 'message' in error) {
                // Handle network errors
                setError({
                    message: `Connection error: ${(error as { message: string }).message}`,
                    errors: {}
                });
            } else {
                // Fallback for unexpected error formats
                setError({
                    message: 'Unable to create account. Please try again later.',
                    errors: {}
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.post('/auth/login', credentials);
            
            // Store the token in localStorage
            const token = response.data.token;
            localStorage.setItem('token', token);
            
            // Store user data for easier access
            if (response.data.user?.name) {
                localStorage.setItem('username', response.data.user.name);
            }
            if (response.data.user?.email) {
                localStorage.setItem('email', response.data.user.email);
            }
            if (response.data.user?.userType) {
                localStorage.setItem('userType', response.data.user.userType);
                // Set userType cookie for middleware
                document.cookie = `userType=${response.data.user.userType}; path=/; max-age=86400; SameSite=Lax`;
            }
            
            // Set the Authorization header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Set the user in state
            setUser(response.data.user);
            
            // Also store token as a cookie for middlewares
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
            
            // Add debug logging
            console.log('Login successful, user type:', response.data.user?.userType);
            
            // Redirect based on user type using window.location for a full page reload
            if (response.data.user?.userType === 'admin') {
                console.log('Redirecting to admin dashboard');
                window.location.href = '/admin';
            } else if (response.data.user?.userType === 'provider') {
                console.log('Redirecting to provider dashboard');
                window.location.href = '/provider';
            } else {
                console.log('Redirecting to client dashboard');
                // Default to dashboard for clients or unknown types
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError(err as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
            // Clear all auth-related data
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('userType');
            delete api.defaults.headers.common['Authorization'];
            
            // Clear all auth cookies
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "userType=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            
            setUser(null);
            router.push('/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Still clear cookies and local storage even if the API call fails
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('userType');
            delete api.defaults.headers.common['Authorization'];
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = "userType=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            setUser(null);
            router.push('/login');
        }
    };

    const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await api.post('/auth/forgot-password', data);
        } catch (err) {
            setError(err as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (data: ResetPasswordData): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await api.post('/auth/reset-password', data);
            router.push('/login?reset=success');
        } catch (err) {
            setError(err as AuthError);
        } finally {
            setLoading(false);
        }
    };

    const resendVerification = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            await api.post('/auth/resend-verification');
        } catch (err) {
            setError(err as AuthError);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        error,
        setError,
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        resendVerification,
    };
}