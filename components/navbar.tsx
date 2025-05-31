"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
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
          <Link
            href="/dashboard"
            className={`text-sm ${isActive("/dashboard") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className={`text-sm ${isActive("/about") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
          >
            About
          </Link>
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
          <Link
            href="/dashboard"
            className={`block py-2 ${isActive("/dashboard") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/about"
            className={`block py-2 ${isActive("/about") ? "text-emerald-500" : "text-gray-300 hover:text-white"}`}
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
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
        </div>
      )}
    </nav>
  )
}
