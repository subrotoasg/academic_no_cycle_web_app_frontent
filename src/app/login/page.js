"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/admin/login/PasswordInput";
import { toast } from "sonner";
import Loading from "../admin/loading";
import { useDispatch, useSelector } from "react-redux";
import {
  currentUser,
  removeUser,
  setUserFromToken,
} from "@/redux/Features/authentication";
import {
  useChangePasswordMutation,
  useUserLoginMutation,
  useVerifyLoginMutation,
} from "@/redux/services/authApi";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [step, setStep] = useState("email");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [userLogin] = useUserLoginMutation();
  const [verifyLogin] = useVerifyLoginMutation();
  const [changePassword] = useChangePasswordMutation();

  const user = useSelector(currentUser);

  // Prevent redirect before password set
  // useEffect(() => {
  //   if (user && step !== "newPassword") {
  //     router.replace(user.role === "admin" ? "/admin" : "/");
  //   }
  // }, [user, router, step]);

  useEffect(() => {
    if (user && step !== "newPassword") {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "student") {
        router.replace("/student/dashboard");
      } else {
        router.replace("/");
      }
    }
  }, [user, router, step]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) return toast.warning("Email or phone is required.");
    setLoading(true);
    try {
      const response = await userLogin({ emailOrPhone }).unwrap();
      if (response?.meta?.role === "admin" || "student") {
        setStep("password");
      } else {
        toast.error("You are not authorized to access the admin panel.");
      }
    } catch (error) {
      toast.error(
        error?.data?.message || "No user found with these credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!password) return toast.warning("Password cannot be empty.");
    setLoading(true);
    try {
      const response = await verifyLogin({ otpValue: password }).unwrap();
      const token = response?.data?.authToken;
      setEmailOrPhone("");
      if (response?.data?.newLogin) {
        setStep("newPassword");
        setPassword("");
        dispatch(setUserFromToken(token));
      } else {
        dispatch(setUserFromToken(token));
        toast.success("Login Successful!");
        const role = response?.meta?.role || response?.data?.role;
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "student") {
          router.push("/student/dashboard");
        } else {
          router.push("/");
        }
      }

      setPassword("");
    } catch (error) {
      toast.error(error?.data?.message || "Invalid password.");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      return toast.error("Password must be 8+ characters with a number.");
    }
    setLoading(true);
    try {
      await changePassword({ newPassword }).unwrap();
      toast.success("Password set! Please login again to continue.");
      dispatch(removeUser());
      setNewPassword("");
      setStep("email");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to set password.");
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const transition = { duration: 0.3, ease: "easeInOut" };

  if (user && step !== "newPassword") return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-200 rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.2)] transition-shadow duration-300">
        <div className="p-6 border-b-2 border-black dark:border-gray-200">
          <Image src="/logo.png" width={100} height={50} alt="Logo" />
        </div>

        <div className="p-6 h-[290px] overflow-hidden relative">
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div
                key="email"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transition}
                className="space-y-5"
              >
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-black dark:text-white">
                    Access Your Account
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sign in to your profile
                  </p>
                </div>
                <form onSubmit={handleLogin} className="space-y-3">
                  <Input
                    id="emailOrPhone"
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Email or Phone"
                    required
                    className="h-11 rounded-md border-2 border-black dark:border-gray-200 bg-transparent focus:ring-4 focus:ring-blue-400/50 dark:focus:ring-blue-500/50"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Continue..." : "Continue"}
                  </Button>
                </form>
                <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account!
                  <Link href="/student/signup" passHref>
                    <button className="text-blue-500 hover:text-blue-600 ps-3 hover:cursor-pointer">
                      Sign Up
                    </button>
                  </Link>
                </p>
              </motion.div>
            )}

            {step === "password" && (
              <motion.div
                key="password"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transition}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-black dark:text-white">
                    Enter Password
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    for {emailOrPhone}
                  </p>
                </div>
                <div className="space-y-3">
                  <PasswordInput
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <div className="flex items-center mb-3 mt-4">
                    <div className="flex ml-auto">
                      <Link
                        href="/forgot-password"
                        className="inline-flex text-xs sm:text-sm text-yellow-500 hover:text-yellow-400"
                      >
                        Forgot Your Password ?
                      </Link>
                    </div>
                  </div>

                  <Button
                    onClick={handlePasswordSubmit}
                    disabled={loading}
                    className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setStep("email")}
                    className="w-full h-11 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  >
                    <MdArrowBack className="mr-2" />
                    Back
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "newPassword" && (
              <motion.div
                key="newPassword"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={transition}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-black dark:text-white">
                    Create Password
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Must be 8+ characters with a number.
                  </p>
                </div>
                <div className="space-y-3">
                  <PasswordInput
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <Button
                    onClick={handleSetNewPassword}
                    disabled={loading}
                    className="w-full h-11 rounded-md border-2 border-black dark:border-gray-200 bg-blue-400 text-black font-bold active:translate-y-0.5 active:translate-x-0.5 shadow-[4px_4px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_rgba(255,255,255,0.2)] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Setting..." : "Set Password"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
