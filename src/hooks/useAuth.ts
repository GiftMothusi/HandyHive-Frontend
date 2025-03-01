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
            await api.post('/auth/register', data);
            router.push('/login?registered=true');
        } catch (err) {
            console.error('Registration error:', err);
            setError(err as AuthError);
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
            
            // Set the Authorization header for future requests
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Set the user in state
            setUser(response.data.user);
            
            // Also store token as a cookie for middlewares
            document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
            
            // Redirect to dashboard
            router.push('/dashboard');
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
            delete api.defaults.headers.common['Authorization'];
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            setUser(null);
            router.push('/login');
        } catch (err) {
            setError(err as AuthError);
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
        register,
        login,
        logout,
        forgotPassword,
        resetPassword,
        resendVerification,
    };
}