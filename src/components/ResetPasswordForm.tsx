import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ResetPasswordFormData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    token: searchParams.get('token') || '',
    email: searchParams.get('email') || '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.password_confirmation) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.token,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Password reset failed');
        return;
      }

      // Redirect to login with success message
      router.push('/login?reset=success');
    } catch (error) {
      console.error('Reset password error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-gray-600">
          Enter your new password
        </p>
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
            required
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
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
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </button>
      </form>

      <div className="text-center text-sm">
        <Link href="/login" className="text-blue-600 hover:underline">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}