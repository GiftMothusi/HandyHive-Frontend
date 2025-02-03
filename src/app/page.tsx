// src/app/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default async function Home() {
  // Get the token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token');

  // Add a small delay to prevent flash of loading state
  await new Promise(resolve => setTimeout(resolve, 100));

  // If user is authenticated, redirect to dashboard
  if (token) {
    redirect('/dashboard');
  }

  // If user is not authenticated, redirect to login
  redirect('/login');

  // This will show briefly while the redirect happens
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-lg text-gray-700">Loading...</span>
      </div>
    </div>
  );
}