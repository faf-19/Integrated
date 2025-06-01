"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"
import { useSettings } from "@/contexts/settings-context"

export function ThemeSwitcher() {
  const { setTheme } = useTheme()
  const { settings } = useSettings()

  useEffect(() => {
    setTheme(settings.general.darkMode ? "dark" : "light")
  }, [settings.general.darkMode, setTheme])

  return null
}
