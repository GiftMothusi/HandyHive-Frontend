"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Bell,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Download,
  Globe,
  HelpCircle,
  Home,
  Info,
  Languages,
  LifeBuoy,
  LogOut,
  Menu,
  Moon,
  Shield,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react"
import { api } from "@/lib/axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Settings } from "lucide-react"

// Types
interface UserSettings {
  theme: "light" | "dark" | "system"
  language: string
  timezone: string
  privacy: {
    profileVisibility: "public" | "private"
    showOnlineStatus: boolean
    shareBookingHistory: boolean
  }
  security: {
    twoFactorEnabled: boolean
    loginNotifications: boolean
  }
  accessibility: {
    reducedMotion: boolean
    highContrast: boolean
    largerText: boolean
  }
}

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "/placeholder.svg?height=200&width=200",
}

// Mock settings data
const mockSettings: UserSettings = {
  theme: "system",
  language: "en-US",
  timezone: "America/New_York",
  privacy: {
    profileVisibility: "public",
    showOnlineStatus: true,
    shareBookingHistory: false,
  },
  security: {
    twoFactorEnabled: false,
    loginNotifications: true,
  },
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    largerText: false,
  },
}

// Language options
const languages = [
  { value: "en-US", label: "English (US)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "zh", label: "中文" },
]

// Timezone options
const timezones = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
]

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings>(mockSettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // In a real app, you'd fetch the user settings from your API
        // const response = await api.get("/user/settings");
        // setSettings(response.data);

        // Using mock data for demo
        setSettings(mockSettings)
        setLoading(false)
      } catch (error) {
        console.error("Failed to fetch settings:", error)
        setError("Failed to load settings. Please try again.")
        setLoading(false)
      }
    }

    fetchSettings()
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

  const handleThemeChange = (value: "light" | "dark" | "system") => {
    setSettings((prev) => ({
      ...prev,
      theme: value,
    }))

    // In a real app, you'd save this to the server
    // api.put("/user/settings", { theme: value });

    showSuccessMessage("Theme preference updated")
  }

  const handleLanguageChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      language: value,
    }))

    showSuccessMessage("Language preference updated")
  }

  const handleTimezoneChange = (value: string) => {
    setSettings((prev) => ({
      ...prev,
      timezone: value,
    }))

    showSuccessMessage("Timezone updated")
  }

  const handlePrivacyChange = (key: keyof typeof settings.privacy, value: boolean | "public" | "private") => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }))

    showSuccessMessage("Privacy settings updated")
  }

  const handleSecurityChange = (key: keyof typeof settings.security, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [key]: value,
      },
    }))

    showSuccessMessage("Security settings updated")
  }

  const handleAccessibilityChange = (key: keyof typeof settings.accessibility, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      accessibility: {
        ...prev.accessibility,
        [key]: value,
      },
    }))

    showSuccessMessage("Accessibility settings updated")
  }

  const handleDeleteAccount = () => {
    // In a real app, you'd call an API to delete the account
    // api.delete("/user/account");

    setDeleteAccountDialogOpen(false)

    // Simulate account deletion
    setTimeout(() => {
      handleLogout()
    }, 1000)
  }

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)

    // Clear the message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
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

      {successMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <Check className="h-4 w-4 text-green-600" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{mockUser.name}</p>
                  <p className="text-sm text-muted-foreground">{mockUser.email}</p>
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
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start bg-accent" asChild>
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

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and all your data will be
              permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">This will:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
              <li>Delete your profile and personal information</li>
              <li>Cancel all your upcoming appointments</li>
              <li>Remove your payment methods</li>
              <li>Delete your booking history</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAccountDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </button>

              {/* Dropdown menu */}
              {userMenuOpen && (
                <div id="userMenu" className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium">{mockUser.name}</p>
                    <p className="text-xs text-gray-500">{mockUser.email}</p>
                  </div>
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 bg-gray-100"
                  >
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
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

        <div className="grid gap-6">
          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
              <TabsTrigger value="account" className="text-red-600">
                Account
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize how HandyHive looks for you</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <RadioGroup
                      value={settings.theme}
                      onValueChange={(value) => handleThemeChange(value as "light" | "dark" | "system")}
                      className="grid grid-cols-3 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="light" id="light" className="peer sr-only" />
                        <Label
                          htmlFor="light"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Sun className="mb-3 h-6 w-6" />
                          Light
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                        <Label
                          htmlFor="dark"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Moon className="mb-3 h-6 w-6" />
                          Dark
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="system" id="system" className="peer sr-only" />
                        <Label
                          htmlFor="system"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <div className="mb-3 h-6 w-6 flex items-center justify-center">
                            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                          </div>
                          System
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={handleLanguageChange}>
                      <SelectTrigger id="language" className="w-full md:w-[240px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language) => (
                          <SelectItem key={language.value} value={language.value}>
                            {language.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      This will change the language of the HandyHive interface
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={handleTimezoneChange}>
                      <SelectTrigger id="timezone" className="w-full md:w-[240px]">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((timezone) => (
                          <SelectItem key={timezone.value} value={timezone.value}>
                            {timezone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      All appointment times will be displayed in your local timezone
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy</CardTitle>
                  <CardDescription>Manage your privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <RadioGroup
                      value={settings.privacy.profileVisibility}
                      onValueChange={(value) => handlePrivacyChange("profileVisibility", value as "public" | "private")}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <RadioGroupItem value="public" id="public" className="peer sr-only" />
                        <Label
                          htmlFor="public"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Globe className="mb-3 h-6 w-6" />
                          Public
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            Your profile is visible to everyone
                          </p>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="private" id="private" className="peer sr-only" />
                        <Label
                          htmlFor="private"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <Shield className="mb-3 h-6 w-6" />
                          Private
                          <p className="text-xs text-muted-foreground mt-2 text-center">
                            Only service providers you book can see your profile
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="online-status">Show Online Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to see when you&apos;re active on HandyHive
                      </p>
                    </div>
                    <Switch
                      id="online-status"
                      checked={settings.privacy.showOnlineStatus}
                      onCheckedChange={(checked) => handlePrivacyChange("showOnlineStatus", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="booking-history">Share Booking History</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow service providers to see your previous bookings
                      </p>
                    </div>
                    <Switch
                      id="booking-history"
                      checked={settings.privacy.shareBookingHistory}
                      onCheckedChange={(checked) => handlePrivacyChange("shareBookingHistory", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage your account security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        id="two-factor"
                        checked={settings.security.twoFactorEnabled}
                        onCheckedChange={(checked) => handleSecurityChange("twoFactorEnabled", checked)}
                      />
                      {!settings.security.twoFactorEnabled && (
                        <Button variant="outline" size="sm">
                          Setup
                        </Button>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="login-notifications">Login Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email alerts when your account is accessed from a new device
                      </p>
                    </div>
                    <Switch
                      id="login-notifications"
                      checked={settings.security.loginNotifications}
                      onCheckedChange={(checked) => handleSecurityChange("loginNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label>Password</Label>
                      <p className="text-sm text-muted-foreground">Change your account password</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href="/change-password">
                        Change Password
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label>Recent Logins</Label>
                      <p className="text-sm text-muted-foreground">View your recent account activity</p>
                    </div>
                    <Button variant="outline">
                      View Activity
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accessibility Tab */}
            <TabsContent value="accessibility">
              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                  <CardDescription>Customize your experience to make HandyHive more accessible</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduced-motion">Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">Minimize animations throughout the interface</p>
                    </div>
                    <Switch
                      id="reduced-motion"
                      checked={settings.accessibility.reducedMotion}
                      onCheckedChange={(checked) => handleAccessibilityChange("reducedMotion", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast between elements for better visibility
                      </p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={settings.accessibility.highContrast}
                      onCheckedChange={(checked) => handleAccessibilityChange("highContrast", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label htmlFor="larger-text">Larger Text</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase the size of text throughout the application
                      </p>
                    </div>
                    <Switch
                      id="larger-text"
                      checked={settings.accessibility.largerText}
                      onCheckedChange={(checked) => handleAccessibilityChange("largerText", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Management</CardTitle>
                  <CardDescription>Manage your account data and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label>Data Export</Label>
                      <p className="text-sm text-muted-foreground">Download a copy of all your data from HandyHive</p>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export Data
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label>Account Status</Label>
                      <p className="text-sm text-muted-foreground">Your account is active and in good standing</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      <span className="text-sm font-medium text-green-600">Active</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label>Help & Support</Label>
                      <p className="text-sm text-muted-foreground">Get help with your account or service bookings</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" asChild>
                        <Link href="/help">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          Help Center
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/support">
                          <LifeBuoy className="mr-2 h-4 w-4" />
                          Contact Support
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between py-3">
                    <div className="space-y-0.5">
                      <Label className="text-red-600">Delete Account</Label>
                      <p className="text-sm text-muted-foreground">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={() => setDeleteAccountDialogOpen(true)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* About Section */}
          <Card>
            <CardHeader>
              <CardTitle>About HandyHive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Version</p>
                    <p className="text-sm text-muted-foreground">2.4.1</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Check for Updates
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">February 26, 2025</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Languages className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Languages</p>
                    <p className="text-sm text-muted-foreground">6 languages supported</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>© 2025 HandyHive. All rights reserved.</p>
                <div className="flex justify-center gap-4 mt-2">
                  <Link href="/terms" className="hover:underline">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

