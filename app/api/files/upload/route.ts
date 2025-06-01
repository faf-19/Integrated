import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyToken } from "@/lib/auth"
import { uploadToIPFS } from "@/lib/ipfs"
import { recordOnBlockchain } from "@/lib/blockchain"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const encryptedData = formData.get("encryptedData") as string
    const encryptionKey = formData.get("encryptionKey") as string
    const iv = formData.get("iv") as string
    const description = formData.get("description") as string

    if (!file || !encryptedData || !encryptionKey || !iv) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload encrypted file to IPFS
    const ipfsHash = await uploadToIPFS(encryptedData)

    // Record transaction on blockchain
    const blockchainTx = await recordOnBlockchain({
      userId: user.id,
      fileName: file.name,
      ipfsHash,
      fileSize: file.size,
      encryptionHash: encryptionKey.substring(0, 32), // Store hash, not actual key
    })

    // Store file metadata in database
    const result = await sql`
      INSERT INTO files (
        user_id, 
        name, 
        original_name,
        mime_type,
        file_size,
        encryption_key,
        iv,
        ipfs_hash,
        blockchain_tx,
        description,
        created_at
      ) VALUES (
        ${user.id},
        ${file.name},
        ${file.name},
        ${file.type},
        ${file.size},
        ${encryptionKey}, -- In production, this would be encrypted
        ${iv},
        ${ipfsHash},
        ${blockchainTx},
        ${description || null},
        NOW()
      )
      RETURNING id, name, file_size, ipfs_hash, blockchain_tx, created_at
    `

    const uploadedFile = result[0]

    return NextResponse.json({
      message: "File uploaded successfully",
      file: {
        id: uploadedFile.id,
        name: uploadedFile.name,
        size: uploadedFile.file_size,
        ipfsHash: uploadedFile.ipfs_hash,
        blockchainTx: uploadedFile.blockchain_tx,
        uploadDate: uploadedFile.created_at,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
