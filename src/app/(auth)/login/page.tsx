"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, CheckCircle2, Loader2, Mail, Lock, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/axios"
import type { LoginCredentials } from "@/types/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<{ message: string } | null>(null)

  const [formData, setFormData] = useState<LoginCredentials>({
    email: "",
    password: "",
  })

  // Check status messages from URL
  const justRegistered = searchParams.get("registered") === "true"
  const resetSuccess = searchParams.get("reset") === "success"
  const redirectPath = searchParams.get("from") || "/dashboard"

  useEffect(() => {
    // Check if already authenticated
    const token = document.cookie.split("; ").find((row) => row.startsWith("token="))
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await api.post("/auth/login", formData)

      // Set the token as an HTTP-only cookie
      document.cookie = `token=${response.data.token}; path=/; max-age=86400; SameSite=Lax`
      
      // Set userType cookie for middleware
      if (response.data.user?.userType) {
        document.cookie = `userType=${response.data.user.userType}; path=/; max-age=86400; SameSite=Lax`
      }

      // Debug logging
      console.log('Login response:', response.data)
      console.log('User type:', response.data.user?.userType)
      console.log('Cookies after login:', document.cookie)
      
      // Redirect based on user type using window.location for a full page reload
      if (response.data.user?.userType === 'admin') {
        console.log('Redirecting to admin dashboard')
        window.location.href = '/admin'
      } else if (response.data.user?.userType === 'provider') {
        console.log('Redirecting to provider dashboard')
        window.location.href = '/provider'
      } else {
        console.log('Redirecting to client dashboard')
        // Default to dashboard for clients or the original requested page
        window.location.href = redirectPath
      }
    } catch (err: Error | unknown) {
      console.error("Login error:", err)
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please check your credentials."
      setError({
        message: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {justRegistered && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registration successful! Please sign in with your new account.
              </AlertDescription>
            </Alert>
          )}

          {resetSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Password reset successful! Please sign in with your new password.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t pt-4">
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

