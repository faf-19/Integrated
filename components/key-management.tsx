"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { KeyIcon, ShieldIcon, DownloadIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdvancedFileCrypto } from "@/utils/crypto-advanced"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function KeyManagement() {
  const [hasKeyPair, setHasKeyPair] = useState(false)
  const [publicKey, setPublicKey] = useState("")
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [generating, setGenerating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [privateKeyPassword, setPrivateKeyPassword] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Check if user has existing key pair
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const userKeys = localStorage.getItem(`userKeys_${currentUser.email}`)

    if (userKeys) {
      const keys = JSON.parse(userKeys)
      setHasKeyPair(true)
      setPublicKey(keys.publicKey)
    }
  }, [mounted])

  const generateKeyPair = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!")
      return
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long!")
      return
    }

    try {
      setGenerating(true)

      // Generate new key pair
      const keyPair = await AdvancedFileCrypto.generateKeyPair()

      // Encrypt private key with password
      const encryptedPrivateKeyData = await AdvancedFileCrypto.encryptPrivateKey(keyPair.privateKey, password)

      // Store keys
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
      const keyData = {
        keyId: keyPair.keyId,
        publicKey: keyPair.publicKey,
        encryptedPrivateKey: encryptedPrivateKeyData.encryptedPrivateKey,
        salt: encryptedPrivateKeyData.salt,
        iv: encryptedPrivateKeyData.iv,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(`userKeys_${currentUser.email}`, JSON.stringify(keyData))

      setHasKeyPair(true)
      setPublicKey(keyPair.publicKey)
      setPassword("")
      setConfirmPassword("")

      alert("Key pair generated successfully!\n\n⚠️ IMPORTANT: Remember your password - it's needed to decrypt files!")
    } catch (error) {
      console.error("Key generation failed:", error)
      alert("Failed to generate key pair. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const exportKeys = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
    const userKeys = localStorage.getItem(`userKeys_${currentUser.email}`)

    if (!userKeys) {
      alert("No keys found to export!")
      return
    }

    const keys = JSON.parse(userKeys)
    const exportData = {
      email: currentUser.email,
      keyId: keys.keyId,
      publicKey: keys.publicKey,
      encryptedPrivateKey: keys.encryptedPrivateKey,
      salt: keys.salt,
      iv: keys.iv,
      createdAt: keys.createdAt,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `secureshare-keys-${currentUser.email}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    alert("Keys exported successfully!\n\n⚠️ Keep this file safe and secure!")
  }

  const requestPrivateKey = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      setShowPasswordDialog(true)

      const handleSubmit = async () => {
        try {
          const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}")
          const userKeys = JSON.parse(localStorage.getItem(`userKeys_${currentUser.email}`) || "{}")

          const privateKey = await AdvancedFileCrypto.decryptPrivateKey(
            userKeys.encryptedPrivateKey,
            privateKeyPassword,
            userKeys.salt,
            userKeys.iv,
          )

          setShowPasswordDialog(false)
          setPrivateKeyPassword("")
          resolve(privateKey)
        } catch (error) {
          alert("Invalid password! Please try again.")
          resolve(null)
        }
      }

      // Store the resolve function to call it later
      ;(window as any).resolvePrivateKey = handleSubmit
    })
  }

  // Make this function available globally for file decryption
  useEffect(() => {
    if (mounted) {
      ;(window as any).requestPrivateKey = requestPrivateKey
    }
  }, [mounted])

  if (!mounted) {
    return <div className="animate-pulse">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <KeyIcon className="mr-2 h-5 w-5" />
            Cryptographic Keys
          </CardTitle>
          <CardDescription className="text-gray-400">
            Manage your public/private key pair for secure file encryption and decryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasKeyPair ? (
            <div className="space-y-4">
              <Alert className="bg-amber-900/30 border-amber-800 text-amber-200">
                <ShieldIcon className="h-4 w-4" />
                <AlertDescription>
                  You need to generate a key pair to encrypt and decrypt files securely.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Private Key Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-700 border-gray-600"
                  />
                </div>

                <Button
                  onClick={generateKeyPair}
                  disabled={generating || !password || !confirmPassword}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {generating ? "Generating..." : "Generate Key Pair"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-emerald-900/30 border-emerald-800 text-emerald-200">
                <ShieldIcon className="h-4 w-4" />
                <AlertDescription>
                  Your key pair is ready! You can now encrypt and decrypt files securely.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Public Key (Share this with others)</Label>
                <div className="relative">
                  <Input
                    value={publicKey.substring(0, 100) + "..."}
                    readOnly
                    className="bg-gray-700 border-gray-600 pr-10"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1 h-8 w-8"
                    onClick={() => navigator.clipboard.writeText(publicKey)}
                  >
                    📋
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={exportKeys}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Export Keys
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Dialog for Private Key Access */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Enter Private Key Password</DialogTitle>
            <DialogDescription className="text-gray-400">
              Your private key is needed to decrypt this file. Please enter your password.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="privateKeyPassword">Password</Label>
              <Input
                id="privateKeyPassword"
                type="password"
                placeholder="Enter your private key password"
                value={privateKeyPassword}
                onChange={(e) => setPrivateKeyPassword(e.target.value)}
                className="bg-gray-700 border-gray-600"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && privateKeyPassword) {
                    ;(window as any).resolvePrivateKey?.()
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              onClick={() => {
                setShowPasswordDialog(false)
                setPrivateKeyPassword("")
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => (window as any).resolvePrivateKey?.()}
              disabled={!privateKeyPassword}
            >
              <KeyIcon className="mr-2 h-4 w-4" />
              Decrypt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
