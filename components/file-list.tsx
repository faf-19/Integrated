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

// Load files from localStorage
const FileList = ({ searchQuery }: { searchQuery: string }) => {
  const [userFiles, setUserFiles] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

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

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userFiles") {
        loadFiles()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [mounted])

  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [shareEmail, setShareEmail] = useState("")
  const [permissions, setPermissions] = useState({
    view: true,
    download: false,
    edit: false,
  })

  // Filter files based on search query
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
    // In a real implementation, this would call an API to share the file
    alert(`File "${selectedFile.name}" shared with ${shareEmail} successfully!`)

    // Close dialog
    setShareDialogOpen(false)
    setShareEmail("")
    setPermissions({
      view: true,
      download: false,
      edit: false,
    })
  }

  const handleViewFile = (file: any) => {
    // Create a simple file viewer modal or new window
    const fileInfo = `
    File: ${file.name}
    Size: ${file.size}
    Uploaded: ${formatDate(file.uploadDate)}
    IPFS Hash: ${file.ipfsHash}
    Blockchain TX: ${file.blockchainTx}
    ${file.description ? `Description: ${file.description}` : ""}
  `
    alert(`File Details:\n\n${fileInfo}`)
  }

  const handleDownloadFile = (file: any) => {
    // In a real implementation, this would decrypt and download from IPFS
    alert(
      `Downloading ${file.name}...\n\nIn a real implementation, this would:\n1. Decrypt the file\n2. Download from IPFS\n3. Verify blockchain integrity`,
    )
  }

  const handleDeleteFile = (file: any) => {
    if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
      const updatedFiles = userFiles.filter((f) => f.id !== file.id)
      localStorage.setItem("userFiles", JSON.stringify(updatedFiles))
      setUserFiles(updatedFiles)
      alert(`File "${file.name}" deleted successfully!`)
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
                    <span>{formatDate(file.uploadDate)}</span>
                    <Badge
                      variant="outline"
                      className="ml-3 bg-emerald-900/30 text-emerald-400 border-emerald-800 text-xs"
                    >
                      Encrypted
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
                    View
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer hover:bg-gray-700"
                    onClick={() => handleDownloadFile(file)}
                  >
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Download
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
            <DialogTitle>Share File</DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedFile && `Share "${selectedFile.name}" with others securely.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="colleague@example.com"
                type="email"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div className="space-y-3">
              <Label>Permissions</Label>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="view"
                  checked={permissions.view}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, view: checked === true }))}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <label
                  htmlFor="view"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  View
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="download"
                  checked={permissions.download}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, download: checked === true }))}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <label
                  htmlFor="download"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Download
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit"
                  checked={permissions.edit}
                  onCheckedChange={(checked) => setPermissions((prev) => ({ ...prev, edit: checked === true }))}
                  className="data-[state=checked]:bg-emerald-600"
                />
                <label
                  htmlFor="edit"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Edit
                </label>
              </div>
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
              Share
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FileList
