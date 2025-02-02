
"use client"

import { usePathname } from 'next/navigation';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import ForgotPasswordForm from '@/components/ForgotPasswordForm';
import ResetPasswordForm from '@/components/ResetPasswordForm';
import FallbackPage from '@/components/FallBackPage';

export default function Page() {
  const pathname = usePathname();

  switch (pathname) {
    case '/login':
      return <LoginForm />;
    case '/register':
      return <RegisterForm />;
    case '/forgot-password':
      return <ForgotPasswordForm />;
    case '/reset-password':
      return <ResetPasswordForm />;
    default:
      return <FallbackPage />;
  }
}