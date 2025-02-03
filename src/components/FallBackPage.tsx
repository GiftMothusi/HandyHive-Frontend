// components/FallbackPage.tsx
import Link from 'next/link';

export default function FallbackPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Oops! Page not found.</h1>
      <p className="text-gray-600 mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="text-blue-500 hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
}