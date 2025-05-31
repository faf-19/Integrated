"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadIcon, FileIcon, XIcon } from "lucide-react"
import { DialogFooter } from "@/components/ui/dialog"

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

      // Simulate upload progress
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += 10
        setProgress(currentProgress)

        if (currentProgress >= 100) {
          clearInterval(interval)

          // Simulate encryption and blockchain processing
          setTimeout(() => {
            setUploading(false)
            // Here we would redirect or show success message
            window.location.reload() // For demo purposes
          }, 1500)
        }
      }, 500)

      // In a real implementation, we would:
      // 1. Encrypt the file client-side using AES-256
      // 2. Upload to IPFS
      // 3. Store the IPFS hash on the blockchain
      // 4. Update the database with file metadata
    } catch (error) {
      console.error("Upload failed:", error)
      setUploading(false)
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
                {progress < 100 ? "Encrypting and uploading..." : "Processing on blockchain..."}
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
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700" disabled={uploading}>
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
              Upload File
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  )
}
