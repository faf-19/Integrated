import { type NextRequest, NextResponse } from "next/server"

// Mock user database for demo purposes
const MOCK_USERS = [
  {
    id: 1,
    email: "demo@example.com",
    password: "password123",
    fullName: "Demo User",
  },
  {
    id: 2,
    email: "test@astu.edu.et",
    password: "test123",
    fullName: "Test User",
  },
]

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { email, password } = body

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user in mock database
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password)

    // If user not found, return error
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Return success with user data (excluding password)
    const { password: _, ...userData } = user

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userData,
    })
  } catch (error) {
    console.error("Login error:", error)

    // Return a simple error response
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
