"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showRegistrationSuccess, setShowRegistrationSuccess] = useState(false)

  useEffect(() => {
    // Check if user was redirected from registration
    if (searchParams.get("registered") === "true") {
      setShowRegistrationSuccess(true)
      // Hide the message after 5 seconds
      setTimeout(() => setShowRegistrationSuccess(false), 5000)
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return
    }

    try {
      setLoading(true)

      // For demo purposes, allow any login
      // Store authentication state with user info
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          email: formData.email,
          fullName: formData.email
            .split("@")[0]
            .replace(/[.]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          loginTime: new Date().toISOString(),
        }),
      )

      // Create some sample files for the user
      const sampleFiles = [
        {
          id: "1",
          name: "Project_Proposal.pdf",
          type: "pdf",
          size: "2.4 MB",
          uploadDate: new Date().toISOString(),
          encrypted: true,
          ipfsHash: "QmT7fQHXQj6j9mfLDaP1zLvgL1TBgZ4YEiHPt5GBszHKG1",
          blockchainTx: "0x3a8e7f9a2d5b4c6e8f1d2a3b4c5d6e7f8a9b0c1d",
        },
        {
          id: "2",
          name: "Financial_Report_Q2.xlsx",
          type: "spreadsheet",
          size: "1.8 MB",
          uploadDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          encrypted: true,
          ipfsHash: "QmX9fQHXQj6j9mfLDaP1zLvgL1TBgZ4YEiHPt5GBszHKG2",
          blockchainTx: "0x4b9f8e0a3c6d5b4a7c8e9d0f1a2b3c4d5e6f7a8b9",
        },
      ]
      localStorage.setItem("userFiles", JSON.stringify(sampleFiles))

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Force a reload to update the navbar state
      window.location.href = "/dashboard"
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showRegistrationSuccess && (
            <Alert className="bg-emerald-900 border-emerald-800 text-white mb-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>Registration successful! Please login with your credentials.</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-800 text-white">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-700 border-gray-600"
              />
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-emerald-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-emerald-500 hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
