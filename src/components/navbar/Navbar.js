"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  FaFacebook,
  FaYoutube,
  FaFacebookMessenger,
  FaHome,
  FaUser,
  FaRegMoon,
} from "react-icons/fa";
import { GoSun } from "react-icons/go";
import { GrSchedule } from "react-icons/gr";
import { Menu, X } from "lucide-react";
import { currentUser, removeUser } from "@/redux/Features/authentication";
import { SiGoogleclassroom } from "react-icons/si";
import { BiSolidDashboard } from "react-icons/bi";
import { useLogOutMutation } from "@/redux/services/authApi";
import { clearCourses } from "@/redux/Features/courseInfo";
import Swal from "sweetalert2";

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
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const user = useSelector(currentUser);
  const menuRef = useRef(null);
  const router = useRouter();
  const toggleRef = useRef(null);
  const dispatch = useDispatch();
  const [logOut] = useLogOutMutation();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You are about to log out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log out",
    });

    if (result.isConfirmed) {
      try {
        await logOut();
        dispatch(removeUser());
        dispatch(clearCourses());
        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          // window.location.href = "/";
          router.push("/");
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Logout failed. Please try again."
        );
      }
    }
  };
  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const isActive = (href) => {
    if (href === "/myclass") {
      return (
        pathname === "/myclass" ||
        pathname.startsWith("/content/") ||
        pathname.startsWith("/subject/") ||
        pathname.startsWith("/classes/")
      );
    }
    return pathname === href;
  };
  const NavItem = ({ href, icon, label, isMobile }) => {
    const active = isActive(href);
    const baseClass = `flex items-center gap-2 px-3 py-2 rounded-md transition  duration-300 ease-in-out hover:bg-accent hover:text-accent-foreground`;

    return (
      <Link
        href={href}
        className={`${baseClass} ${
          active ? "text-white bg-blue-500" : "text-foreground"
        }`}
      >
        {icon}
        {(isMobile || active) && <span>{label}</span>}
      </Link>
    );
  };

  const NavLinks = ({ isMobile = false }) => (
    <ul
      className={`flex ${
        isMobile ? "flex-col" : "flex-row"
      } gap-2 md:items-center md:justify-center`}
    >
      <li>
        <NavItem href="/" icon={<FaHome />} label="Home" isMobile={isMobile} />
      </li>
      {/* <li>
        <NavItem
          href="/myclass"
          icon={<SiGoogleclassroom />}
          label="My Courses"
          isMobile={isMobile}
        />
      </li> */}
      {/* <li>
        <NavItem
          href="/routine"
          icon={<GrSchedule />}
          label="Routine"
          isMobile={isMobile}
        />
      </li> */}

      {user &&
        (user.role === "admin" ? (
          <li>
            <NavItem
              href="/admin"
              icon={<BiSolidDashboard />}
              label="Admin Dashboard"
              isMobile={isMobile}
            />
          </li>
        ) : (
          <li>
            <NavItem
              href="/student/dashboard"
              icon={<FaUser />}
              label="My Dashboard"
              isMobile={isMobile}
            />
          </li>
        ))}

      {NAV_ITEMS.map((item) => (
        <li key={item.name}>
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-foreground hover:text-[#578EEB] transition"
          >
            {item.icon}
            {isMobile && <span>{item.name}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-border bg-background shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo.png" width={180} height={60} alt="Logo" priority />
        </Link>

        <div className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="h-9 w-9"
            aria-label="Toggle theme"
          >
            {mounted &&
              (theme === "dark" ? (
                <FaRegMoon size={18} />
              ) : (
                <GoSun size={20} />
              ))}
          </Button>
          {user ? (
            <Button
              onClick={handleLogout}
              variant="secondary"
              className="text-sm font-bold bg-blue-500 hover:bg-blue-800 text-white"
            >
              Logout
            </Button>
          ) : (
            <Link href="/login">
              <Button
                variant="secondary"
                className="text-sm font-bold bg-blue-500 hover:bg-blue-800 text-white"
              >
                Login
              </Button>
            </Link>
          )}

          <Button
            onClick={toggleMenu}
            ref={toggleRef}
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "max-h-[500px] opacity-100 border-b border-border"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 bg-background">
          <NavLinks isMobile={true} />
        </div>
      </div>
    </nav>
  );
}
