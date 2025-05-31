"use client"

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

// Mock shared file data
const mockSharedFiles = [
  {
    id: "1",
    name: "Team_Budget_2025.xlsx",
    type: "spreadsheet",
    size: "1.2 MB",
    sharedBy: "Samuel Habtamu",
    sharedByEmail: "samuel.h@example.com",
    sharedDate: "2025-05-29T10:15:00",
    permissions: ["view", "download"],
    encrypted: true,
  },
  {
    id: "2",
    name: "Project_Timeline.pdf",
    type: "pdf",
    size: "3.5 MB",
    sharedBy: "Bisrat Abraham",
    sharedByEmail: "bisrat.a@example.com",
    sharedDate: "2025-05-27T14:30:00",
    permissions: ["view"],
    encrypted: true,
  },
  {
    id: "3",
    name: "System_Architecture.jpg",
    type: "image",
    size: "2.8 MB",
    sharedBy: "Fasika Zergaw",
    sharedByEmail: "fasika.z@example.com",
    sharedDate: "2025-05-25T09:45:00",
    permissions: ["view", "download", "edit"],
    encrypted: true,
  },
]

interface SharedFileListProps {
  searchQuery: string
}

export default function SharedFileList({ searchQuery }: SharedFileListProps) {
  // Filter files based on search query
  const filteredFiles = mockSharedFiles.filter(
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

  return (
    <div>
      {filteredFiles.length === 0 ? (
        <div className="text-center py-8">
          <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No shared files found</h3>
          <p className="text-sm text-gray-400">
            {searchQuery ? "Try a different search term" : "No one has shared files with you yet"}
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
                    onClick={() => console.log("View file:", file)}
                  >
                    <EyeIcon className="mr-2 h-4 w-4" />
                    View
                  </DropdownMenuItem>
                  {file.permissions.includes("download") && (
                    <DropdownMenuItem
                      className="flex items-center cursor-pointer hover:bg-gray-700"
                      onClick={() => console.log("Download file:", file)}
                    >
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="flex items-center cursor-pointer hover:bg-gray-700"
                    onClick={() => console.log("View details:", file)}
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
