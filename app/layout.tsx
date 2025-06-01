import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { SettingsProvider } from "@/contexts/settings-context"
import { ThemeSwitcher } from "@/components/theme-switcher"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SecureShare - Blockchain-Based Secure File Sharing",
  description: "Secure file sharing platform using blockchain technology, IPFS, and encryption",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SettingsProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <ThemeSwitcher />
            <Navbar />
            {children}
          </ThemeProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
