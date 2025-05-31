"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { FileIcon, UploadIcon, HistoryIcon, SearchIcon, Share2Icon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import FileUploader from "@/components/file-uploader"
import FileList from "@/components/file-list"
import SharedFileList from "@/components/shared-file-list"
import ActivityLog from "@/components/activity-log"

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("files")

  // Mock data for storage usage
  const storageUsed = 2.7 // GB
  const storageTotal = 10 // GB
  const storagePercentage = (storageUsed / storageTotal) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-400">Manage your secure files</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search files..."
                className="pl-10 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Files will be encrypted and stored securely on IPFS
                  </DialogDescription>
                </DialogHeader>
                <FileUploader />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="bg-gray-800 border-gray-700 text-white mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={storagePercentage} className="h-2 mb-2" />
                <p className="text-sm text-gray-400">
                  {storageUsed} GB of {storageTotal} GB used
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Quick Access</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <button
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-700 ${activeTab === "files" ? "bg-gray-700 border-l-4 border-emerald-500" : ""}`}
                  onClick={() => setActiveTab("files")}
                >
                  <FileIcon className="mr-3 h-5 w-5 text-gray-400" />
                  <span>My Files</span>
                </button>
                <button
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-700 ${activeTab === "shared" ? "bg-gray-700 border-l-4 border-emerald-500" : ""}`}
                  onClick={() => setActiveTab("shared")}
                >
                  <Share2Icon className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Shared with Me</span>
                </button>
                <button
                  className={`w-full flex items-center px-4 py-3 hover:bg-gray-700 ${activeTab === "activity" ? "bg-gray-700 border-l-4 border-emerald-500" : ""}`}
                  onClick={() => setActiveTab("activity")}
                >
                  <HistoryIcon className="mr-3 h-5 w-5 text-gray-400" />
                  <span>Activity Log</span>
                </button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="bg-gray-700 w-full justify-start rounded-none border-b border-gray-700">
                    <TabsTrigger value="files" className="data-[state=active]:bg-gray-800">
                      <FileIcon className="mr-2 h-4 w-4" />
                      My Files
                    </TabsTrigger>
                    <TabsTrigger value="shared" className="data-[state=active]:bg-gray-800">
                      <Share2Icon className="mr-2 h-4 w-4" />
                      Shared with Me
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="data-[state=active]:bg-gray-800">
                      <HistoryIcon className="mr-2 h-4 w-4" />
                      Activity Log
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="files" className="p-4">
                    <FileList searchQuery={searchQuery} />
                  </TabsContent>

                  <TabsContent value="shared" className="p-4">
                    <SharedFileList searchQuery={searchQuery} />
                  </TabsContent>

                  <TabsContent value="activity" className="p-4">
                    <ActivityLog />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
