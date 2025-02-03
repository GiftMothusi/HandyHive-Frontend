import { NextResponse } from 'next/server';
import { resetPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await resetPassword(body);
    
    return NextResponse.json({ 
      message: 'Password reset successful' 
    });
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Failed to reset password',
      },
      { status: 400 }
    );
  }
}