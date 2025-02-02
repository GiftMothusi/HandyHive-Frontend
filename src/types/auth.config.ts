import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl))
            }
            return true
        }
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const { email, password } = credentials as {
                    email: string
                    password: string
                }

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: 'POST',
                        body: JSON.stringify({ email, password }),
                        headers: { 'Content-Type': 'application/json' }
                    })

                    if (!res.ok) {
                        return null
                    }

                    const user = await res.json()
                    return user
                } catch (error) {
                    console.error('Authentication error:', error)
                    return error
                }
            }
        })
    ]
} satisfies NextAuthConfig