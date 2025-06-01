"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Loader2, CheckCircle, Shield, Moon, Key } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/contexts/settings-context"

export default function Settings() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("general")

  // Use the settings context
  const { settings, updateSetting } = useSettings()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check if user is authenticated
    const authStatus = localStorage.getItem("isAuthenticated")
    if (authStatus !== "true") {
      router.push("/login")
      return
    }
  }, [mounted, router])

  const handleSwitchChange = (category: string, setting: string, checked: boolean) => {
    updateSetting(category, setting, checked)
  }

  const handleInputChange = (category: string, setting: string, value: string) => {
    updateSetting(category, setting, value)
  }

  const saveSettings = async () => {
    setError("")
    setLoading(true)

    try {
      // Settings are automatically saved by the context
      // Just simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Failed to save settings. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        <Card className="bg-gray-800 border-gray-700 text-white">
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription className="text-gray-400">
              Customize your SecureShare experience and security preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="bg-red-900 border-red-800 text-white mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-emerald-900 border-emerald-800 text-white mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>Settings saved successfully!</AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-gray-700 w-full justify-start rounded-md mb-6">
                <TabsTrigger value="general" className="data-[state=active]:bg-gray-600">
                  <Moon className="mr-2 h-4 w-4" />
                  General
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-gray-600">
                  <Shield className="mr-2 h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="privacy" className="data-[state=active]:bg-gray-600">
                  <Key className="mr-2 h-4 w-4" />
                  Privacy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="darkMode" className="text-base">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-gray-400">Enable dark mode for the application</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={settings.general.darkMode}
                    onCheckedChange={(checked) => handleSwitchChange("general", "darkMode", checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications" className="text-base">
                      Browser Notifications
                    </Label>
                    <p className="text-sm text-gray-400">Receive notifications in your browser</p>
                  </div>
                  <Switch
                    id="notifications"
                    checked={settings.general.notifications}
                    onCheckedChange={(checked) => handleSwitchChange("general", "notifications", checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailUpdates" className="text-base">
                      Email Updates
                    </Label>
                    <p className="text-sm text-gray-400">Receive updates and newsletters via email</p>
                  </div>
                  <Switch
                    id="emailUpdates"
                    checked={settings.general.emailUpdates}
                    onCheckedChange={(checked) => handleSwitchChange("general", "emailUpdates", checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactorAuth" className="text-base">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => handleSwitchChange("security", "twoFactorAuth", checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="loginAlerts" className="text-base">
                      Login Alerts
                    </Label>
                    <p className="text-sm text-gray-400">Receive alerts for new login attempts</p>
                  </div>
                  <Switch
                    id="loginAlerts"
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) => handleSwitchChange("security", "loginAlerts", checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-base">
                    Session Timeout (minutes)
                  </Label>
                  <p className="text-sm text-gray-400 mb-2">Automatically log out after a period of inactivity</p>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleInputChange("security", "sessionTimeout", e.target.value)}
                    className="bg-gray-700 border-gray-600 max-w-xs"
                    min="5"
                    max="120"
                  />
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="publicProfile" className="text-base">
                      Public Profile
                    </Label>
                    <p className="text-sm text-gray-400">Allow others to see your profile information</p>
                  </div>
                  <Switch
                    id="publicProfile"
                    checked={settings.privacy.publicProfile}
                    onCheckedChange={(checked) => handleSwitchChange("privacy", "publicProfile", checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="showActivity" className="text-base">
                      Activity Visibility
                    </Label>
                    <p className="text-sm text-gray-400">Show your file activity to shared users</p>
                  </div>
                  <Switch
                    id="showActivity"
                    checked={settings.privacy.showActivity}
                    onCheckedChange={(checked) => handleSwitchChange("privacy", "showActivity", checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataCollection" className="text-base">
                      Data Collection
                    </Label>
                    <p className="text-sm text-gray-400">Allow anonymous usage data collection for improvements</p>
                  </div>
                  <Switch
                    id="dataCollection"
                    checked={settings.privacy.dataCollection}
                    onCheckedChange={(checked) => handleSwitchChange("privacy", "dataCollection", checked)}
                    className="data-[state=checked]:bg-emerald-600"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={saveSettings} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
