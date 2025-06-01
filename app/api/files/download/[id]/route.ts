import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/auth"
import { downloadFromIPFS } from "@/lib/ipfs"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify authentication
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const fileId = params.id

    // Get file metadata
    const files = await sql`
      SELECT 
        id,
        name,
        mime_type,
        encryption_key,
        iv,
        ipfs_hash,
        user_id
      FROM files 
      WHERE id = ${fileId}
    `

    if (files.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const file = files[0]

    // Check if user owns the file or has permission
    const hasPermission = await checkFilePermission(user.id, fileId)
    if (!hasPermission && file.user_id !== user.id) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    // Download encrypted data from IPFS
    const encryptedData = await downloadFromIPFS(file.ipfs_hash)

    return NextResponse.json({
      file: {
        id: file.id,
        name: file.name,
        mimeType: file.mime_type,
        encryptedData,
        encryptionKey: file.encryption_key,
        iv: file.iv,
      },
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json({ error: "Download failed" }, { status: 500 })
  }
}

async function checkFilePermission(userId: string, fileId: string): Promise<boolean> {
  const sql = neon(process.env.DATABASE_URL!)

  const permissions = await sql`
    SELECT id FROM file_permissions 
    WHERE user_id = ${userId} 
    AND file_id = ${fileId} 
    AND can_download = true
  `

  return permissions.length > 0
}
