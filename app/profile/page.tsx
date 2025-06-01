"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export default function Profile() {
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    bio: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated")
    const storedUserData = localStorage.getItem("currentUser")

    if (authStatus !== "true" || !storedUserData) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUserData)
      setUserData(parsedUser)
      setFormData({
        fullName: parsedUser.fullName || "",
        email: parsedUser.email || "",
        bio: parsedUser.bio || "",
      })
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/login")
    }
  }, [mounted, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.fullName || !formData.email) {
      setError("Name and email are required")
      return
    }

    try {
      setLoading(true)

      // Update user data in localStorage
      const updatedUser = {
        ...userData,
        fullName: formData.fullName,
        email: formData.email,
        bio: formData.bio,
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      setUserData(updatedUser)

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError("Failed to update profile. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (fullName: string) => {
    if (!fullName) return "U"
    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!mounted || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarFallback className="bg-emerald-600 text-white text-2xl">
                      {getInitials(userData.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{userData.fullName}</h2>
                  <p className="text-gray-400">{userData.email}</p>
                  {userData.bio && <p className="text-sm text-center mt-2">{userData.bio}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and profile settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="bg-emerald-900 border-emerald-800 text-white">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>Profile updated successfully!</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      className="bg-gray-700 border-gray-600"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
