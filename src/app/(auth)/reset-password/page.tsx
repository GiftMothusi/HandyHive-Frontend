'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    token: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  useEffect(() => {
    // Get token and email from URL parameters
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      setError('Invalid reset link');
      return;
    }

    setFormData(prev => ({
      ...prev,
      token,
      email: decodeURIComponent(email),
    }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      // Redirect to login page with success message
      router.push('/login?reset=success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  // If there's no token or email in the URL, show an error state
  if (!formData.token || !formData.email) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Invalid or expired reset link. Please request a new one.</AlertDescription>
        </Alert>
        <div className="text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-500">
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-gray-500">Enter your new password</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-50"
            value={formData.email}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            minLength={8}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password_confirmation" className="text-sm font-medium">
            Confirm New Password
          </label>
          <input
            id="password_confirmation"
            type="password"
            required
            className="w-full px-3 py-2 border rounded-md"
            value={formData.password_confirmation}
            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
            minLength={8}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent 
            rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 
            hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link href="/login" className="text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </div>
  );
}