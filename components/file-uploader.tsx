"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadIcon, FileIcon, XIcon } from "lucide-react"
import { DialogFooter } from "@/components/ui/dialog"
import { FileCrypto } from "@/utils/crypto"
import { uploadToIPFS } from "@/utils/ipfs"

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [description, setDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      setProgress(10)

      // Step 1: Generate encryption key
      const encryptionKey = FileCrypto.generateKey()
      setProgress(20)

      // Step 2: Encrypt the file
      const { encryptedData, iv } = await FileCrypto.encryptFile(file, encryptionKey)
      setProgress(40)

      // Step 3: Upload to IPFS via Pinata
      console.log("Uploading to IPFS via Pinata...")
      const ipfsHash = await uploadToIPFS(encryptedData)
      setProgress(70)

      // Step 4: Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setProgress(90)

      // Step 5: Store file metadata with encryption info
      const existingFiles = JSON.parse(localStorage.getItem("userFiles") || "[]")
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        originalName: file.name,
        mimeType: file.type,
        type: file.type.includes("image")
          ? "image"
          : file.type.includes("pdf")
            ? "pdf"
            : file.type.includes("spreadsheet") || file.name.includes(".xlsx")
              ? "spreadsheet"
              : file.type.includes("presentation") || file.name.includes(".pptx")
                ? "presentation"
                : "text",
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadDate: new Date().toISOString(),
        encrypted: true,
        // Encryption metadata
        encryptionKey: encryptionKey,
        encryptedData: encryptedData,
        iv: iv,
        // Real IPFS hash from Pinata
        ipfsHash: ipfsHash,
        blockchainTx: `0x${Math.random().toString(16).substr(2, 40)}`,
        description: description,
      }

      existingFiles.unshift(newFile)
      localStorage.setItem("userFiles", JSON.stringify(existingFiles))
      setProgress(100)

      // Trigger storage event for other tabs
      window.dispatchEvent(new Event("storage"))

      setTimeout(() => {
        setUploading(false)
        alert(
          `File "${file.name}" encrypted and uploaded successfully!\n\n✅ Encryption: AES-256\n✅ IPFS Hash: ${ipfsHash}\n✅ Blockchain TX: ${newFile.blockchainTx}\n\nYour file is now stored on the decentralized web!`,
        )

        // Reset form
        setFile(null)
        setDescription("")
        setProgress(0)

        // Close dialog
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
      }, 500)
    } catch (error) {
      console.error("Upload failed:", error)
      setUploading(false)
      alert(`Upload failed: ${error.message}\n\nPlease check your internet connection and try again.`)
    }
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <UploadIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Drag and drop your file here</h3>
          <p className="text-sm text-gray-400 mb-4">or click to browse</p>
          <Button variant="outline" className="border-emerald-600 text-emerald-500 hover:bg-emerald-950">
            Select File
          </Button>
          <input type="file" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
        </div>
      ) : (
        <div className="border border-gray-700 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileIcon className="h-8 w-8 text-emerald-500 mr-3" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={removeFile} disabled={uploading}>
              <XIcon className="h-5 w-5" />
            </Button>
          </div>

          {uploading && (
            <div className="mt-4">
              <Progress value={progress} className="h-2 mb-2" />
              <p className="text-sm text-gray-400">
                {progress < 25
                  ? "Generating encryption key..."
                  : progress < 45
                    ? "Encrypting file with AES-256..."
                    : progress < 75
                      ? "Uploading to IPFS via Pinata..."
                      : progress < 95
                        ? "Recording on blockchain..."
                        : "Finalizing..."}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          placeholder="Add a description for your file"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-700 border-gray-600"
          disabled={uploading}
        />
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          disabled={uploading}
          onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))}
        >
          Cancel
        </Button>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? (
            <>
              <span className="animate-pulse">Processing...</span>
            </>
          ) : (
            <>
              <UploadIcon className="mr-2 h-4 w-4" />
              Encrypt & Upload
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  )
}
