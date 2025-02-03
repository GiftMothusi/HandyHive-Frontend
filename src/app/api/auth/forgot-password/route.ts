import { NextResponse } from 'next/server';
import { forgotPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    await forgotPassword(email);
    
    return NextResponse.json({ 
      message: 'Password reset instructions sent' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Failed to process request',
      },
      { status: 400 }
    );
  }
}