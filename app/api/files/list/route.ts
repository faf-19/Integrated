import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/auth"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's files
    const files = await sql`
      SELECT 
        id,
        name,
        original_name,
        mime_type,
        file_size,
        ipfs_hash,
        blockchain_tx,
        description,
        created_at,
        updated_at
      FROM files 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      files: files.map((file) => ({
        id: file.id,
        name: file.name,
        originalName: file.original_name,
        mimeType: file.mime_type,
        size: `${(file.file_size / 1024 / 1024).toFixed(2)} MB`,
        ipfsHash: file.ipfs_hash,
        blockchainTx: file.blockchain_tx,
        description: file.description,
        uploadDate: file.created_at,
        updatedAt: file.updated_at,
      })),
    })
  } catch (error) {
    console.error("File list error:", error)
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
  }
}
