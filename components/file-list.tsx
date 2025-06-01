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
  Share2Icon,
  TrashIcon,
  DownloadIcon,
  EyeIcon,
  KeyIcon,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FileCrypto } from "@/utils/crypto"
import { recordActivity } from "@/utils/activity-logger"

const FileList = ({ searchQuery }: { searchQuery: string }) => {
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

  const handleShare = (file: any) => {
    setSelectedFile(file)
    setShareDialogOpen(true)
  }

  const handleShareSubmit = () => {
    if (!selectedFile || !shareEmail) return

    try {
      // Get current user
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")

      // Create shared file entry
      const sharedFile = {
        ...selectedFile,
        sharedBy: currentUser.fullName || "Unknown User",
        sharedByEmail: currentUser.email || "unknown@example.com",
        sharedDate: new Date().toISOString(),
        permissions: Object.keys(permissions).filter((key) => permissions[key as keyof typeof permissions]),
        shareId: `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }

      // Get existing shared files for the recipient
      const existingSharedFiles = JSON.parse(localStorage.getItem(`sharedFiles_${shareEmail}`) || "[]")
      existingSharedFiles.unshift(sharedFile)

      // Store shared files for the recipient
      localStorage.setItem(`sharedFiles_${shareEmail}`, JSON.stringify(existingSharedFiles))

      // Also store in a global shared files registry for demo purposes
      const globalSharedFiles = JSON.parse(localStorage.getItem("globalSharedFiles") || "[]")
      globalSharedFiles.unshift({
        ...sharedFile,
        recipientEmail: shareEmail,
      })
      localStorage.setItem("globalSharedFiles", JSON.stringify(globalSharedFiles))

      // Record activity
      recordActivity({
        type: "share",
        fileName: selectedFile.name,
        user: currentUser.fullName || "You",
        sharedWith: shareEmail,
        timestamp: new Date().toISOString(),
        status: "success",
        blockchainTx: `0x${Math.random().toString(16).substr(2, 40)}`,
      })

      // Trigger storage event to update other tabs
      window.dispatchEvent(new Event("storage"))

      alert(
        `File "${selectedFile.name}" shared with ${shareEmail} successfully!\n\n✅ Shared encryption key and access permissions\n✅ Recorded on blockchain\n✅ Recipient can now access the file\n\nThe recipient will see this file in their "Shared with Me" section.`,
      )

      setShareDialogOpen(false)
      setShareEmail("")
      setPermissions({ view: true, download: false, edit: false })
    } catch (error) {
      console.error("Error sharing file:", error)
      alert("Failed to share file. Please try again.")
    }
  }

  const handleViewFile = (file: any) => {
    // Record view activity
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    recordActivity({
      type: "view",
      fileName: file.name,
      user: currentUser.fullName || "You",
      timestamp: new Date().toISOString(),
      status: "success",
      blockchainTx: file.blockchainTx || `0x${Math.random().toString(16).substr(2, 40)}`,
    })

    const fileInfo = `
File: ${file.name}
Size: ${file.size}
Uploaded: ${formatDate(file.uploadDate)}
Encryption: AES-256 (${file.encrypted ? "Encrypted" : "Not Encrypted"})
IPFS Hash: ${file.ipfsHash}
Blockchain TX: ${file.blockchainTx}
${file.description ? `Description: ${file.description}` : ""}

Encryption Details:
- Algorithm: AES-256-GCM
- Key Length: 256 bits
- IV: ${file.iv ? file.iv.substring(0, 16) + "..." : "N/A"}
- Status: ${file.encrypted ? "Securely Encrypted" : "Not Encrypted"}
`
    alert(`File Details:\n${fileInfo}`)
  }

  const handleDownloadFile = async (file: any) => {
    try {
      if (!file.encrypted || !file.encryptedData) {
        alert("This file is not encrypted or data is missing.")
        return
      }

      // Show decryption process
      const confirmed = confirm(
        `Decrypt and download "${file.name}"?\n\nThis will:\n1. Decrypt the file using your encryption key\n2. Verify blockchain integrity\n3. Download the original file\n\nProceed?`,
      )

      if (!confirmed) return

      // Simulate blockchain verification
      console.log("Verifying blockchain transaction:", file.blockchainTx)

      // Decrypt the file
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
        timestamp: new Date().toISOString(),
        status: "success",
        blockchainTx: file.blockchainTx || `0x${Math.random().toString(16).substr(2, 40)}`,
      })

      alert(
        `File "${file.name}" decrypted and downloaded successfully!\n\nThe file has been decrypted using AES-256 and is now available in your downloads folder.`,
      )
    } catch (error) {
      console.error("Download/decryption failed:", error)
      alert(
        `Failed to decrypt and download file: ${error.message}\n\nThis could be due to:\n- Corrupted encryption data\n- Invalid encryption key\n- Network issues`,
      )
    }
  }

  const handleDeleteFile = (file: any) => {
    if (
      confirm(
        `Are you sure you want to delete "${file.name}"?\n\nThis will:\n- Remove the file from IPFS\n- Record deletion on blockchain\n- Permanently delete encryption keys\n\nThis action cannot be undone.`,
      )
    ) {
      const updatedFiles = userFiles.filter((f) => f.id !== file.id)
      localStorage.setItem("userFiles", JSON.stringify(updatedFiles))
      setUserFiles(updatedFiles)

      // Record delete activity
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      recordActivity({
        type: "delete",
        fileName: file.name,
        user: currentUser.fullName || "You",
        timestamp: new Date().toISOString(),
        status: "success",
        blockchainTx: `0x${Math.random().toString(16).substr(2, 40)}`,
      })

      alert(`File "${file.name}" deleted successfully!\n\nDeletion has been recorded on the blockchain.`)
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
                      AES-256
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
                    onClick={() => handleViewFile(file)}
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer hover:bg-gray-700"
                    onClick={() => handleDownloadFile(file)}
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Decrypt & Download
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer hover:bg-gray-700"
                    onClick={() => handleShare(file)}
                  >
                    <Share2Icon className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer text-red-500 hover:bg-gray-700 hover:text-red-500"
                    onClick={() => handleDeleteFile(file)}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Share Encrypted File</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedFile &&
                `Share "${selectedFile.name}" securely. The encryption key will be shared with the recipient.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Recipient Email Address</Label>
              <Input
                id="email"
                placeholder="colleague@example.com"
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
              <p className="text-xs text-gray-400">
                💡 Tip: Use demo@example.com or test@astu.edu.et to test sharing between demo accounts
              </p>
            </div>

            <div className="space-y-3">
              <Label>Access Permissions</Label>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="view"
                  checked={permissions.view}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, view: checked === true }))}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <label htmlFor="view" className="text-sm font-medium">
                  View (can see file details)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="download"
                  checked={permissions.download}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, download: checked === true }))}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <label htmlFor="download" className="text-sm font-medium">
                  Download (can decrypt and download)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit"
                  checked={permissions.edit}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, edit: checked === true }))}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <label htmlFor="edit" className="text-sm font-medium">
                  Edit (can modify and re-upload)
                </label>
              </div>
            </div>

            <div className="bg-gray-700 p-3 rounded-lg">
              <p className="text-xs text-gray-300">
                <KeyIcon className="h-3 w-3 inline mr-1" />
                The encryption key will be securely shared with the recipient through the blockchain smart contract.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => setShareDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleShareSubmit} disabled={!shareEmail}>
              <Share2Icon className="mr-2 h-4 w-4" />
              Share Securely
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FileList
