import type { NextRequest } from "next/server"
import jwt from "jsonwebtoken"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function verifyToken(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    // Get user from database
    const users = await sql`
      SELECT id, full_name, email 
      FROM users 
      WHERE id = ${decoded.userId}
    `

    if (users.length === 0) {
      return null
    }

    return {
      id: users[0].id,
      fullName: users[0].full_name,
      email: users[0].email,
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}
