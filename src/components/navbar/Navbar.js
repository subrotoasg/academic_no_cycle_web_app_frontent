"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import {
  FaFacebook,
  FaYoutube,
  FaFacebookMessenger,
  FaHome,
  FaUser,
  FaRegMoon,
} from "react-icons/fa"
import { GoSun } from "react-icons/go"
import { GrSchedule, GrUserAdmin } from "react-icons/gr"
import { Menu, X } from "lucide-react"
import { currentUser } from "@/redux/Features/authentication"
import { SiGoogleclassroom } from "react-icons/si"

const NAV_ITEMS = [
  {
    name: "Group",
    url: "https://www.facebook.com/groups/acs.hsc24.frb",
    icon: <FaFacebook size={18} />,
  },
  {
    name: "Channel",
    url: "https://www.youtube.com/c/aparsclassroom",
    icon: <FaYoutube size={18} />,
  },
  {
    name: "Contact",
    url: "https://www.messenger.com/login.php?next=https%3A%2F%2Fwww.messenger.com%2Ft%2F103533265542288%2F",
    icon: <FaFacebookMessenger size={18} />,
  },
]

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const user = useSelector(currentUser)
  const menuRef = useRef(null)
  const toggleButtonRef = useRef(null)

  useEffect(() => {
    setMounted(true)

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  if (pathname.startsWith("/admin")) return null

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const isActive = (href) => {
    if (href === "/myclass") {
      return (
        pathname === "/myclass" ||
        pathname.startsWith("/content/") ||
        pathname.startsWith("/subject/") ||
        pathname.startsWith("/classes/") ||
        pathname.startsWith("/cycles/")
      )
    }
    return pathname === href
  }

  const NavLinks = ({ isMobile = false }) => (
    <ul className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-2`}>
      <li>
        <Link
          href="/"
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-accent hover:text-accent-foreground ${
            isActive("/") ? "text-blue-800 font-bold" : "text-foreground"
          }`}
        >
           Home
        </Link>
      </li>
      <li>
        <Link
          href="/myclass"
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-accent hover:text-accent-foreground ${
            isActive("/myclass") ? "text-blue-800 font-bold" : "text-foreground"
          }`}
        >
          My Classes
        </Link>
      </li>
      <li>
        <Link
          href="/routine"
          className={`flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-accent hover:text-accent-foreground ${
            isActive("/routine") ? "text-blue-800 font-bold" : "text-foreground"
          }`}
        >
         Schedule
        </Link>
      </li>

      {user &&
        (user.role === "admin" ? (
          <li>
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-accent hover:text-accent-foreground ${
                isActive("/admin") ? "text-blue-700" : "text-foreground"
              }`}
            >
               Dashboard
            </Link>
          </li>
        ) : (
          <li>
            <Link
              href="/profile"
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition hover:bg-accent hover:text-accent-foreground ${
                isActive("/profile") ? "text-blue-800 font-bold" : "text-foreground"
              }`}
            >
              <FaUser /> Profile
            </Link>
          </li>
        ))}

      {NAV_ITEMS.map((item) => (
        <li key={item.name}>
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-foreground hover:text-blue-800 font-bold transition"
          >
            {item.icon}
          </Link>
        </li>
      ))}
    </ul>
  )

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-border bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" width={180} height={60} alt="Logo" priority />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </div>

        {/* Theme toggle + mobile menu button */}
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <FaRegMoon size={18} /> : <GoSun size={20} />)}
          </Button>

          {/* Mobile menu toggle button */}
          <Button
            ref={toggleButtonRef}
            onClick={toggleMenu}
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100 border-b border-border" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 bg-background">
          <NavLinks isMobile={true} />
        </div>
      </div>
    </nav>
  )
}
