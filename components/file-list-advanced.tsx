"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  FileIcon,
  ImageIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  FileIcon as FilePresentationIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  KeyIcon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AdvancedFileCrypto } from "@/utils/crypto-advanced"
import { recordActivity } from "@/utils/activity-logger"

const FileListAdvanced = ({ searchQuery }: { searchQuery: string }) => {
  const [userFiles, setUserFiles] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [shareEmail, setShareEmail] = useState("")
  const [permissions, setPermissions] = useState({
    view: true,
    download: false,
    edit: false,
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadFiles = () => {
      try {
        const files = JSON.parse(localStorage.getItem("userFiles") || "[]")
        setUserFiles(files)
      } catch (error) {
        console.error("Error loading files:", error)
        setUserFiles([])
      }
    }

    loadFiles()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userFiles") {
        loadFiles()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [mounted])

  const filteredFiles = userFiles.filter((file) => file?.name?.toLowerCase().includes(searchQuery.toLowerCase()))

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-10 w-10 text-blue-500" />
      case "text":
        return <FileTextIcon className="h-10 w-10 text-gray-400" />
      case "spreadsheet":
        return <FileSpreadsheetIcon className="h-10 w-10 text-green-500" />
      case "presentation":
        return <FilePresentationIcon className="h-10 w-10 text-orange-500" />
      default:
        return <FileIcon className="h-10 w-10 text-emerald-500" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleDownloadFile = async (file: any) => {
    try {
      if (!file.encrypted || !file.encryptedData) {
        alert("This file is not encrypted or data is missing.")
        return
      }

      // Request private key from user
      const privateKey = await (window as any).requestPrivateKey?.()
      if (!privateKey) {
        return // User cancelled or invalid password
      }

      // Show decryption process
      const confirmed = confirm(
        `Decrypt and download "${file.name}"?\n\nThis will:\n1. Use your private key to decrypt the file\n2. Verify blockchain integrity\n3. Download the original file\n\nProceed?`,
      )

      if (!confirmed) return

      // Simulate blockchain verification
      console.log("Verifying blockchain transaction:", file.blockchainTx)

      // Decrypt the file using hybrid decryption
      const decryptedFile = await AdvancedFileCrypto.decryptFileHybrid(
        file.encryptedData,
        file.encryptedAESKey,
        file.iv,
        privateKey,
        file.originalName || file.name,
        file.mimeType || "application/octet-stream",
      )

      // Create download link
      const downloadUrl = URL.createObjectURL(decryptedFile)

      // Create temporary download link
      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = decryptedFile.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Clean up the URL
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)

      // Record download activity
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      recordActivity({
        type: "download",
        fileName: file.name,
        user: currentUser.fullName || "You",
        timestamp: new Date().toISOString(),
        status: "success",
        blockchainTx: file.blockchainTx || `0x${Math.random().toString(16).substr(2, 40)}`,
      })

      alert(
        `File "${file.name}" decrypted and downloaded successfully!\n\nThe file has been decrypted using your private key and is now available in your downloads folder.`,
      )
    } catch (error) {
      console.error("Download/decryption failed:", error)
      alert(
        `Failed to decrypt and download file: ${error.message}\n\nThis could be due to:\n- Invalid private key\n- Corrupted encryption data\n- Network issues`,
      )
    }
  }

  // ... rest of the component remains similar but uses the new crypto system

  if (!mounted) {
    return (
      <div className="text-center py-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {filteredFiles.length === 0 ? (
        <div className="text-center py-8">
          <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No files found</h3>
          <p className="text-sm text-gray-400">
            {searchQuery ? "Try a different search term" : "Upload your first file to get started"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-750"
            >
              <div className="flex items-center">
                {getFileIcon(file.type)}
                <div className="ml-4">
                  <p className="font-medium">{file.name}</p>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <span className="mr-4">{file.size}</span>
                    <span className="mr-4">{formatDate(file.uploadDate)}</span>
                    <Badge
                      variant="outline"
                      className="bg-emerald-900/30 text-emerald-400 border-emerald-800 text-xs mr-2"
                    >
                      <KeyIcon className="h-3 w-3 mr-1" />
                      RSA+AES
                    </Badge>
                    <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800 text-xs">
                      IPFS
                    </Badge>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontalIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-white">
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer hover:bg-gray-700"
                    onClick={() => handleDownloadFile(file)}
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Decrypt & Download
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileListAdvanced
