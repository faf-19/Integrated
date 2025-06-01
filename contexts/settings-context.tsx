"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface SettingsContextType {
  settings: {
    general: {
      darkMode: boolean
      notifications: boolean
      emailUpdates: boolean
    }
    security: {
      twoFactorAuth: boolean
      loginAlerts: boolean
      sessionTimeout: string
    }
    privacy: {
      publicProfile: boolean
      showActivity: boolean
      dataCollection: boolean
    }
  }
  updateSettings: (newSettings: any) => void
  updateSetting: (category: string, setting: string, value: any) => void
}

const defaultSettings = {
  general: {
    darkMode: true,
    notifications: true,
    emailUpdates: false,
  },
  security: {
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: "30",
  },
  privacy: {
    publicProfile: false,
    showActivity: true,
    dataCollection: false,
  },
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  updateSetting: () => {},
})

export const useSettings = () => useContext(SettingsContext)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage on mount
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error("Error parsing settings:", error)
      }
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("userSettings", JSON.stringify(settings))
    }
  }, [settings, mounted])

  const updateSettings = (newSettings: any) => {
    setSettings(newSettings)
  }

  const updateSetting = (category: string, setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value,
      },
    }))
  }

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateSetting }}>{children}</SettingsContext.Provider>
  )
}
