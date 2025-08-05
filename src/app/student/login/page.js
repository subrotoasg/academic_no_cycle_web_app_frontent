"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/admin/login/PasswordInput";
import { toast } from "sonner";
import { useStudentSignUpMutation, useStudentSignInMutation } from "@/redux/services/authApi";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const StudentAuth = () => {
  const router = useRouter();
  const [isSignIn, setIsSignIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [studentSignUp] = useStudentSignUpMutation();
  const [studentSignIn] = useStudentSignInMutation();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignIn) {
      if (!formData.email || !formData.password) {
        return toast.warning("All fields are required");
      }
      setLoading(true);
      try {
        const response = await studentSignIn({ email: formData.email, password: formData.password }).unwrap();
        toast.success("Sign in successful!");
        router.push("/student/dashboard");
      } catch (error) {
        toast.error(error?.data?.message || "Sign in failed");
      }
    } else {
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        return toast.warning("All fields are required");
      }
      if (formData.password.length < 8 || !/\d/.test(formData.password)) {
        return toast.error("Password must be 8+ characters with a number.");
      }
      setLoading(true);
      try {
        const response = await studentSignUp(formData).unwrap();
        toast.success("Sign up successful!");
        setIsSignIn(true);
      } catch (error) {
        toast.error(error?.data?.message || "Sign up failed");
      }
    }
    setLoading(false);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-200 rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <div className="p-6 border-b-2 border-black dark:border-gray-200">
          <Image src="/logo.png" width={100} height={50} alt="Logo" />
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignIn ? "signin" : "signup"}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="space-y-1">
                <h1 className="text-xl font-bold text-black dark:text-white">
                  {isSignIn ? "Sign In" : "Sign Up"}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isSignIn ? "Welcome back!" : "Create your account"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {!isSignIn && (
                  <>
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="h-11 rounded-md border-2"
                    />
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="h-11 rounded-md border-2"
                    />
                  </>
                )}
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="h-11 rounded-md border-2"
                />
                <PasswordInput
                  name="password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  placeholder={isSignIn ? "Enter Password" : "Create Password"}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:bg-blue-700 transition"
                >
                  {loading ? (isSignIn ? "Signing in..." : "Signing up...") : (isSignIn ? "Sign In" : "Sign Up")}
                </Button>
              </form>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                {isSignIn ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  onClick={() => {
                    setIsSignIn(!isSignIn);
                    setFormData({ name: "", email: "", phone: "", password: "" });
                  }}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {isSignIn ? "Sign Up" : "Sign In"}
                </Button>
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default StudentAuth;