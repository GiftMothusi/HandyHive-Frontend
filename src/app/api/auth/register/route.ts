import { NextResponse } from 'next/server';
import { register } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await register(body);
    
    return NextResponse.json({ 
      user: data.user,
      message: 'Registration successful' 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Registration failed',
      },
      { status: 400 }
    );
  }
}