"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { UploadIcon, Share2Icon, EyeIcon, DownloadIcon, TrashIcon, ExternalLinkIcon, HistoryIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ActivityLog() {
  const [activities, setActivities] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Load activities from localStorage
    const loadActivities = () => {
      try {
        const storedActivities = localStorage.getItem("userActivities")
        if (storedActivities) {
          setActivities(JSON.parse(storedActivities))
        } else {
          setActivities([])
        }
      } catch (error) {
        console.error("Error loading activities:", error)
        setActivities([])
      }
    }

    loadActivities()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userActivities") {
        loadActivities()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [mounted])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <UploadIcon className="h-5 w-5 text-emerald-500" />
      case "share":
        return <Share2Icon className="h-5 w-5 text-blue-500" />
      case "view":
        return <EyeIcon className="h-5 w-5 text-purple-500" />
      case "download":
        return <DownloadIcon className="h-5 w-5 text-amber-500" />
      case "delete":
        return <TrashIcon className="h-5 w-5 text-red-500" />
      default:
        return <EyeIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getActivityDescription = (activity: any) => {
    switch (activity.type) {
      case "upload":
        return `Uploaded "${activity.fileName}"`
      case "share":
        return `Shared "${activity.fileName}" with ${activity.sharedWith}`
      case "view":
        return `Viewed "${activity.fileName}"${activity.sharedBy ? ` shared by ${activity.sharedBy}` : ""}`
      case "download":
        return `Downloaded "${activity.fileName}"`
      case "delete":
        return `Deleted "${activity.fileName}"`
      default:
        return `Activity on "${activity.fileName}"`
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
    }
  }

  const openBlockchainExplorer = (txHash: string) => {
    // In a real implementation, this would open the transaction on Etherscan or similar
    window.open(`https://sepolia.etherscan.io/tx/${txHash}`, "_blank")
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
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <HistoryIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">No activity yet</h3>
          <p className="text-sm text-gray-400">Your file activities will appear here</p>
          <p className="text-sm text-gray-400 mt-2">Try uploading or sharing a file to see activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Activity</h3>
            <Badge variant="outline" className="bg-emerald-900/30 text-emerald-400 border-emerald-800">
              Blockchain Verified
            </Badge>
          </div>

          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start justify-between p-4 border border-gray-700 rounded-lg hover:bg-gray-750"
            >
              <div className="flex items-start">
                <div className="mr-3 mt-1">{getActivityIcon(activity.type)}</div>
                <div>
                  <p className="font-medium">{getActivityDescription(activity)}</p>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <span className="mr-4">{formatTimestamp(activity.timestamp)}</span>
                    <span className="mr-4">by {activity.user}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        activity.status === "success"
                          ? "bg-green-900/30 text-green-400 border-green-800"
                          : "bg-red-900/30 text-red-400 border-red-800"
                      }`}
                    >
                      {activity.status}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 mt-2">
                    <span className="mr-2">Blockchain TX:</span>
                    <code className="bg-gray-800 px-2 py-1 rounded text-xs mr-2">
                      {activity.blockchainTx.slice(0, 10)}...{activity.blockchainTx.slice(-8)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-emerald-500 hover:text-emerald-400"
                      onClick={() => openBlockchainExplorer(activity.blockchainTx)}
                    >
                      <ExternalLinkIcon className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {activities.length > 0 && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => {
                  localStorage.removeItem("userActivities")
                  setActivities([])
                }}
              >
                Clear Activity Log
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
