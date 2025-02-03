import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    userType: 'client' | 'provider';
    email_verified: boolean;
  };
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  userType: 'client' | 'provider';
}

export class ServerCookies {
    static async set(token: string) {
      const cookieStore = await cookies();
      cookieStore.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
    }
    static async get() {
        const cookieStore = await cookies();
        return cookieStore.get('token')?.value;
    }
    
      static async delete() {
        const cookieStore = await cookies();
        cookieStore.delete('token');
    }
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  const authData = await response.json();
  
   // Store the token in an HTTP-only cookie
   await ServerCookies.set(authData.token);

  return authData;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  const authData = await response.json();
  
   // Store the token in an HTTP-only cookie
   await ServerCookies.set(authData.token);

  return authData;
}

export async function logout() {
    const token = await ServerCookies.get();
  
  if (token) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  await ServerCookies.delete();
  redirect('/login');
}

export async function forgotPassword(email: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send reset link');
  }

  return response.json();
}

export async function resetPassword(data: {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Password reset failed');
  }

  return response.json();
}

// Middleware helper to check authentication
export async function checkAuth() {
    const token = await ServerCookies.get();

  if (!token) {
    redirect('/login');
  }

  try {
    // Verify token expiration
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp && decoded.exp < currentTime) {
        await ServerCookies.delete();
      redirect('/login');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    await ServerCookies.delete();
    redirect('/login');
  }

  return token;
}