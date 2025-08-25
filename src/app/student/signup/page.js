"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/admin/login/PasswordInput";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { useStudentSignUpMutation } from "@/redux/services/authApi";
import { useDispatch } from "react-redux";
import { setUserFromToken } from "@/redux/Features/authentication";

const StudentSignUp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [studentSignUp] = useStudentSignUpMutation();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, password } = formData;

    if (!name || !email || !phone || !password) {
      return toast.warning("All fields are required");
    }

    if (password.length < 8 || !/\d/.test(password)) {
      return toast.error(
        "Password must be minimum of 8 characters with at least a number"
      );
    }

    setLoading(true);
    try {
      const res = await studentSignUp(formData).unwrap();
      const token = res?.data?.authToken;
      if (res?.success) {
        dispatch(setUserFromToken(token));
        toast.success(res?.message);
        router.push("/student/dashboard");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Sign up failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-200 rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <div className="p-6 border-b-2 border-black dark:border-gray-200">
          <Image src="/logo.png" width={100} height={50} alt="Logo" />
        </div>

        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-black dark:text-white">
                Student Sign Up
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                অ্যাকাউন্ট তৈরির জন্য ইনভয়েসে উল্লেখিত ইমেইল ব্যবহার করুন
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
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
                placeholder="Create Password"
              />
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:bg-blue-700 transition"
              >
                {loading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Already have an account
              <Link href="/login">
                <button className="text-blue-500 hover:text-blue-600 ps-3 hover:cursor-pointer">
                  Sign In
                </button>
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUp;
