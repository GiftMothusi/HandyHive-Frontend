import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await login(body);
    
    // The token is already set in an HTTP-only cookie by the login function
    return NextResponse.json({ 
      user: data.user,
      message: 'Logged in successfully' 
    });
  } catch (error) {
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Login failed',
      },
      { status: 400 }
    );
  }
}