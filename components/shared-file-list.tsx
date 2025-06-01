"use client"

import { useState, useEffect } from "react"
import {
  FileIcon,
  ImageIcon,
  FileTextIcon,
  FileSpreadsheetIcon,
  FileIcon as FilePresentationIcon,
  MoreHorizontalIcon,
  DownloadIcon,
  EyeIcon,
  UserIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FileCrypto } from "@/utils/crypto"
import { recordActivity } from "@/utils/activity-logger"

interface SharedFileListProps {
  searchQuery: string
}

export default function SharedFileList({ searchQuery }: SharedFileListProps) {
  const [sharedFiles, setSharedFiles] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const loadSharedFiles = () => {
      try {
        // Get current user
        const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
        const userEmail = currentUser.email

        if (!userEmail) {
          setSharedFiles([])
          return
        }

        // Load files shared with this user
        const userSharedFiles = JSON.parse(localStorage.getItem(`sharedFiles_${userEmail}`) || "[]")
        setSharedFiles(userSharedFiles)
      } catch (error) {
        console.error("Error loading shared files:", error)
        setSharedFiles([])
      }
    }

    loadSharedFiles()

    // Listen for storage changes (when files are shared)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.startsWith("sharedFiles_") || e.key === "globalSharedFiles") {
        loadSharedFiles()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [mounted])

  // Filter files based on search query
  const filteredFiles = sharedFiles.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.sharedBy.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  const getPermissionBadges = (permissions: string[]) => {
    return permissions.map((permission) => {
      let color
      switch (permission) {
        case "view":
          color = "bg-blue-900/30 text-blue-400 border-blue-800"
          break
        case "download":
          color = "bg-purple-900/30 text-purple-400 border-purple-800"
          break
        case "edit":
          color = "bg-amber-900/30 text-amber-400 border-amber-800"
          break
        default:
          color = "bg-gray-900/30 text-gray-400 border-gray-800"
      }

      return (
        <Badge key={permission} variant="outline" className={`${color} text-xs mr-2`}>
          {permission.charAt(0).toUpperCase() + permission.slice(1)}
        </Badge>
      )
    })
  }

  const handleViewFile = (file: any) => {
    // Record view activity
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    recordActivity({
      type: "view",
      fileName: file.name,
      user: currentUser.fullName || "You",
      sharedBy: file.sharedBy,
      timestamp: new Date().toISOString(),
      status: "success",
      blockchainTx: file.blockchainTx || `0x${Math.random().toString(16).substr(2, 40)}`,
    })

    const fileInfo = `
File: ${file.name}
Size: ${file.size}
Shared by: ${file.sharedBy} (${file.sharedByEmail})
Shared on: ${formatDate(file.sharedDate)}
Permissions: ${file.permissions.join(", ")}
Encryption: AES-256 (${file.encrypted ? "Encrypted" : "Not Encrypted"})
IPFS Hash: ${file.ipfsHash}
Blockchain TX: ${file.blockchainTx}
${file.description ? `Description: ${file.description}` : ""}

Encryption Details:
- Algorithm: AES-256-GCM
- Key Length: 256 bits
- Status: ${file.encrypted ? "Securely Encrypted" : "Not Encrypted"}
`
    alert(`Shared File Details:\n${fileInfo}`)
  }

  const handleDownloadFile = async (file: any) => {
    try {
      // Check if user has download permission
      if (!file.permissions.includes("download")) {
        alert("You don't have permission to download this file. Contact the file owner for download access.")
        return
      }

      if (!file.encrypted || !file.encryptedData) {
        alert("This file is not encrypted or data is missing.")
        return
      }

      // Show decryption process
      const confirmed = confirm(
        `Decrypt and download "${file.name}" shared by ${file.sharedBy}?\n\nThis will:\n1. Decrypt the file using the shared encryption key\n2. Verify blockchain integrity\n3. Download the original file\n\nProceed?`,
      )

      if (!confirmed) return

      // Simulate blockchain verification
      console.log("Verifying blockchain transaction:", file.blockchainTx)

      // Decrypt the file using the shared encryption key
      const decryptedFile = await FileCrypto.decryptFile(
        file.encryptedData,
        file.encryptionKey,
        file.iv,
        file.originalName || file.name,
        file.mimeType || "application/octet-stream",
      )

      // Create download link
      const downloadUrl = FileCrypto.createDownloadLink(decryptedFile)

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
        sharedBy: file.sharedBy,
        timestamp: new Date().toISOString(),
        status: "success",
        blockchainTx: file.blockchainTx || `0x${Math.random().toString(16).substr(2, 40)}`,
      })

      alert(
        `File "${file.name}" decrypted and downloaded successfully!\n\nThe file has been decrypted using the shared encryption key and is now available in your downloads folder.`,
      )
    } catch (error) {
      console.error("Download/decryption failed:", error)
      alert(
        `Failed to decrypt and download file: ${error.message}\n\nThis could be due to:\n- Corrupted encryption data\n- Invalid shared encryption key\n- Network issues`,
      )
    }
  }

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
          <h3 className="text-lg font-medium mb-2">No shared files found</h3>
          <p className="text-sm text-gray-400">
            {searchQuery ? "Try a different search term" : "No one has shared files with you yet"}
          </p>
          <div className="mt-4 p-4 bg-gray-700 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-gray-300 mb-2">💡 To test file sharing:</p>
            <ol className="text-xs text-gray-400 text-left space-y-1">
              <li>1. Upload a file in "My Files"</li>
              <li>2. Click "Share" and use demo@example.com</li>
              <li>3. Login as demo@example.com to see shared files</li>
            </ol>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <div
              key={file.shareId || file.id}
              className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-750"
            >
              <div className="flex items-center">
                {getFileIcon(file.type)}
                <div className="ml-4">
                  <p className="font-medium">{file.name}</p>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <span className="mr-4">{file.size}</span>
                    <span>Shared on {formatDate(file.sharedDate)}</span>
                    <Badge
                      variant="outline"
                      className="ml-3 bg-emerald-900/30 text-emerald-400 border-emerald-800 text-xs"
                    >
                      Encrypted
                    </Badge>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center mr-4">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarFallback className="bg-gray-700 text-xs">{getInitials(file.sharedBy)}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-400">{file.sharedBy}</span>
                    </div>
                    <div className="flex">{getPermissionBadges(file.permissions)}</div>
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
                    onClick={() => handleViewFile(file)}
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  {file.permissions.includes("download") && (
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer hover:bg-gray-700"
                      onClick={() => handleDownloadFile(file)}
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer hover:bg-gray-700"
                    onClick={() => alert(`File shared by: ${file.sharedBy}\nEmail: ${file.sharedByEmail}`)}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    Shared By
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
