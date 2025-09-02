"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Users,
  UserPlus,
  Film,
  Bell,
  Menu,
  LogOutIcon,
  Construction,
  Wrench,
  LucideBookImage,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";
import { FaHome, FaRegMoon } from "react-icons/fa";
import { GoSun } from "react-icons/go";
import { useTheme } from "next-themes";
import { MdOutlineLocalOffer, MdOutlineSubject } from "react-icons/md";
import Image from "next/image";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useLogOutMutation } from "@/redux/services/authApi";
import { useDispatch } from "react-redux";
import { removeUser } from "@/redux/Features/authentication";
import { clearCourses } from "@/redux/Features/courseInfo";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const isMobile = useMobile();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [logOut] = useLogOutMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleLogout = async () => {
    // Close the mobile sheet first
    if (isMobile) {
      setOpen(false);
    }

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
          // Safely redirect after modal closes
          // window.location.href = "/login";
          router.push("/login");
        });
      } catch (error) {
        toast.error(
          // error?.response?.data?.message || "Logout failed. Please try again."
          error?.data?.message || "Logout failed. Please try again."
        );
      }
    }
  };

  const navItems = [
    { title: "Main App", href: "/", icon: FaHome },
    { title: "Dashboard", href: "/admin", icon: BarChart3 },
    { title: "Create Admin", href: "/admin/create-admin", icon: UserPlus },
    {
      title: "Subjects Info",
      href: "/admin/subjectsInfo",
      icon: MdOutlineSubject,
    },
    {
      title: "Chapter Info",
      href: "/admin/chapterInfo",
      icon: LucideBookImage,
    },
    {
      title: "Add Class Contents",
      href: "/admin/courseClassContent",
      icon: Film,
    },

    {
      title: "Featured",
      href: "/admin/featured",
      icon: MdOutlineLocalOffer,
      badge: "New",
    },
    {
      title: "Notice Board",
      href: "/admin/notices",
      icon: Bell,
      badge: "Beta",
    },
    {
      title: "Student Records",
      href: "/admin/studentInfo",
      icon: Users,
    },
  ];

  if (!hasMounted) {
    return null;
  }

  if (isMobile) {
    return (
      <>
        <div className="bg-background fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-1 border-b border-input shadow-md">
          <Link href="/" className="flex items-center ">
            <Image src="/logo.png" width={200} height={32} alt="Logo" />
          </Link>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "dark" ? <FaRegMoon size={20} /> : <GoSun size={20} />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 flex flex-col h-full">
                <div className="flex items-center pt-3 ">
                  <SheetTitle className="text-lg font-semibold">
                    <div className="px-7">
                      <div className="flex items-start justify-start mb-2 mt-4">
                        <Link href="/" className="flex items-left ">
                          <Image
                            src="/logo.png"
                            width={200}
                            height={32}
                            alt="Logo"
                          />
                        </Link>
                      </div>
                      <div className="mt-4">
                        <p className="text-base text-center">
                          {" "}
                          Admin Dashboard
                        </p>
                      </div>
                    </div>
                  </SheetTitle>
                </div>

                <ScrollArea className="flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-1 p-2">
                    {navItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                        {item.badge && (
                          <span
                            className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold  ${
                              item.badge === "New"
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-black"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-2 border-t ">
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Logout <LogOutIcon />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="hidden w-full min-h-screen flex-col border md:flex">
      <div className="border-b px-5 py-4">
        <div className="flex items-center justify-start mb-2">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.png" width={200} height={32} alt="Logo" />
          </Link>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-base text-center"> Admin Dashboard</p>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="ml-auto h-6 w-6"
          >
            {theme === "dark" ? <FaRegMoon size={20} /> : <GoSun size={20} />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-1 p-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
              {item.badge && (
                <span
                  className={`ml-auto rounded-full px-2 py-0.5 text-xs font-semibold ${
                    item.badge === "New"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
        <div className="p-2 border-t">
          <Button
            onClick={handleLogout}
            className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Logout <LogOutIcon />
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};
