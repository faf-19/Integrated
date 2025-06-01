"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings, FileIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication status on component mount and when pathname changes
  useEffect(() => {
    if (!mounted) return

    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("currentUser")

      if (authStatus === "true" && userData) {
        try {
          const parsedUser = JSON.parse(userData)
          setIsAuthenticated(true)
          setCurrentUser(parsedUser)
        } catch (error) {
          console.error("Error parsing user data:", error)
          setIsAuthenticated(false)
          setCurrentUser(null)
        }
      } else {
        setIsAuthenticated(false)
        setCurrentUser(null)
      }
    }

    checkAuth()

    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [mounted, pathname])

  const isActive = (path: string) => {
    return pathname === path
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("currentUser")
    localStorage.removeItem("userFiles") // Clear user files on logout
    setIsAuthenticated(false)
    setCurrentUser(null)
    window.location.href = "/"
  }

  const getInitials = (fullName: string) => {
    if (!fullName) return "U"
    return fullName
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getFirstName = (fullName: string) => {
    if (!fullName) return "User"
    return fullName.split(" ")[0]
  }

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <nav className="bg-gray-900 border-b border-gray-800 py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-emerald-500">
            SecureShare
          </Link>
          <div className="hidden md:flex items-center space-x-6">
            <div className="w-20 h-8 bg-gray-700 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-emerald-500">
          SecureShare
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`text-sm ${isActive("/") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}>
            Home
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={`text-sm ${isActive("/dashboard") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/about"
            className={`text-sm ${isActive("/about") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
          >
            About
          </Link>

          {!isAuthenticated ? (
            <div className="flex space-x-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-emerald-600 text-emerald-500 hover:bg-emerald-950"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-300">
                Welcome, <span className="text-emerald-400 font-medium">{getFirstName(currentUser?.fullName)}</span>
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-700">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-emerald-600 text-white font-semibold text-sm">
                        {getInitials(currentUser?.fullName)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 bg-gray-800 border-gray-700 text-white" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{currentUser?.fullName}</p>
                    <p className="text-xs leading-none text-gray-400">{currentUser?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer">
                    <Link href="/dashboard" className="flex items-center">
                      <FileIcon className="mr-2 h-4 w-4" />
                      My Files
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer">
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="hover:bg-gray-700 cursor-pointer">
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem
                    className="hover:bg-gray-700 cursor-pointer text-red-400 focus:text-red-400"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-3 px-6 space-y-3 bg-gray-900 border-t border-gray-800">
          <Link
            href="/"
            className={`block py-2 ${isActive("/") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          {isAuthenticated && (
            <Link
              href="/dashboard"
              className={`block py-2 ${isActive("/dashboard") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/about"
            className={`block py-2 ${isActive("/about") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>

          {!isAuthenticated ? (
            <div className="flex flex-col space-y-2 pt-2">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-emerald-600 text-emerald-500 hover:bg-emerald-950"
              >
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  Register
                </Link>
              </Button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-emerald-600 text-white text-sm">
                    {getInitials(currentUser?.fullName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{currentUser?.fullName}</p>
                  <p className="text-xs text-gray-400">{currentUser?.email}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-300 hover:bg-gray-700"
                >
                  <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <FileIcon className="mr-2 h-4 w-4" />
                    My Files
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-300 hover:bg-gray-700"
                >
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-300 hover:bg-gray-700"
                >
                  <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-400 hover:bg-gray-700 hover:text-red-400"
                  onClick={() => {
                    handleLogout()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
