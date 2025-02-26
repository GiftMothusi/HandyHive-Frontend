"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  CreditCard,
  Edit,
  Home,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Save,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react"
import { api } from "@/lib/axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

// Types
interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  bio: string
  avatar: string
  memberSince: string
  paymentMethods: PaymentMethod[]
  notifications: NotificationSettings
}

interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  lastFour?: string
  expiryDate?: string
  isDefault: boolean
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
}

// Mock user data
const mockUserProfile: UserProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Apt 4B, New York, NY 10001",
  bio: "I'm a busy professional looking for reliable home services. I appreciate punctuality and quality work.",
  avatar: "/placeholder.svg?height=200&width=200",
  memberSince: "January 2023",
  paymentMethods: [
    {
      id: "pm_1",
      type: "card",
      lastFour: "4242",
      expiryDate: "04/25",
      isDefault: true,
    },
    {
      id: "pm_2",
      type: "paypal",
      isDefault: false,
    },
  ],
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
}

export default function ProfilePage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(mockUserProfile)
  const [saveLoading, setSaveLoading] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, you'd fetch the user profile from your API
        // const response = await api.get("/user/profile");
        // setUserProfile(response.data);

        // Using mock data for demo
        setUserProfile(mockUserProfile)
        setFormData(mockUserProfile)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch user profile:", error)
        setError("Failed to load profile data. Please try again.")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    // Close the user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const menu = document.getElementById("userMenu")
      const avatar = document.getElementById("avatarButton")
      if (menu && !menu.contains(event.target as Node) && !avatar?.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      // Try the API logout first
      try {
        await api.post("/auth/logout")
      } catch (apiError) {
        console.warn("API logout failed, continuing with local logout:", apiError)
      }

      // Even if API fails, clear local auth state
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"

      // Redirect to login page
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      setError("Logout failed. Please try again.")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (type: keyof NotificationSettings, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: checked,
      },
    }))
  }

  const handleSaveProfile = async () => {
    setSaveLoading(true)

    try {
      // In a real app, you'd send the updated profile to your API
      // await api.put("/user/profile", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setUserProfile(formData)
      setEditMode(false)

      // Show success message
    } catch (error) {
      console.error("Failed to update profile:", error)
      setError("Failed to update profile. Please try again.")
    } finally {
      setSaveLoading(false)
    }
  }

  const handleSetDefaultPayment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    }))
  }

  const handleRemovePaymentMethod = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((method) => method.id !== id),
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{userProfile.name}</p>
                  <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/appointments">
                  <Calendar className="mr-2 h-4 w-4" />
                  Appointments
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start bg-accent" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </nav>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">HandyHive</h1>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointments
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
            </Button>

            {/* User dropdown menu */}
            <div className="relative">
              <button
                id="avatarButton"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center focus:outline-none"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div id="userMenu" className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{userProfile.name}</p>
                    <p className="text-xs text-gray-500">{userProfile.email}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 bg-gray-100">
                    Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <p className="text-muted-foreground">View and manage your personal information</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                      <AvatarFallback className="text-2xl">{userProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute bottom-0 right-0 rounded-full bg-background h-8 w-8"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change profile picture</span>
                      </Button>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{userProfile.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{userProfile.email}</p>
                  <Badge variant="outline" className="mb-4">
                    Member since {userProfile.memberSince}
                  </Badge>

                  {!editMode ? (
                    <Button onClick={() => setEditMode(true)} className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditMode(false)
                          setFormData(userProfile)
                        }}
                        className="flex-1"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} className="flex-1" disabled={saveLoading}>
                        {saveLoading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Content */}
          <div className="md:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={editMode ? formData.name : userProfile.name}
                          onChange={handleInputChange}
                          className="pl-10"
                          readOnly={!editMode}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={editMode ? formData.email : userProfile.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          readOnly={!editMode}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          value={editMode ? formData.phone : userProfile.phone}
                          onChange={handleInputChange}
                          className="pl-10"
                          readOnly={!editMode}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          name="address"
                          value={editMode ? formData.address : userProfile.address}
                          onChange={handleInputChange}
                          className="pl-10"
                          readOnly={!editMode}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={editMode ? formData.bio : userProfile.bio}
                        onChange={handleInputChange}
                        className="min-h-[100px]"
                        readOnly={!editMode}
                        placeholder="Tell us a bit about yourself..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Payment Methods Tab */}
              <TabsContent value="payment">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {formData.paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {method.type === "card" ? (
                            <CreditCard className="h-8 w-8 text-primary" />
                          ) : (
                            <div className="h-8 w-8 flex items-center justify-center bg-blue-100 rounded-md text-blue-600">
                              <svg
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                              </svg>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {method.type === "card" ? `•••• •••• •••• ${method.lastFour}` : "PayPal"}
                            </p>
                            {method.type === "card" && (
                              <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {method.isDefault ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Default
                            </Badge>
                          ) : (
                            editMode && (
                              <Button variant="ghost" size="sm" onClick={() => handleSetDefaultPayment(method.id)}>
                                Set as default
                              </Button>
                            )
                          )}
                          {editMode && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemovePaymentMethod(method.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {editMode && (
                      <Button variant="outline" className="w-full">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive booking confirmations and reminders via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={editMode ? formData.notifications.email : userProfile.notifications.email}
                        onCheckedChange={editMode ? (checked) => handleNotificationChange("email", checked) : undefined}
                        disabled={!editMode}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive real-time updates on your mobile device</p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={editMode ? formData.notifications.push : userProfile.notifications.push}
                        onCheckedChange={editMode ? (checked) => handleNotificationChange("push", checked) : undefined}
                        disabled={!editMode}
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive text messages for important updates</p>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={editMode ? formData.notifications.sms : userProfile.notifications.sms}
                        onCheckedChange={editMode ? (checked) => handleNotificationChange("sms", checked) : undefined}
                        disabled={!editMode}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Security Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Password</p>
                      <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/change-password">
                      Change Password
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

