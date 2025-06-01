import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { fullName, email, password } = body

    // Basic validation
    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Create mock user (in a real app, this would be saved to a database)
    const newUser = {
      id: Date.now(),
      fullName,
      email,
      createdAt: new Date().toISOString(),
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: newUser,
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Return a simple error response
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
