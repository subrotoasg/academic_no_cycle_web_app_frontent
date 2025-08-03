"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MdOutlineMail } from "react-icons/md";
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
const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showNewPasswordDialog, setShowNewPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLogin] = useUserLoginMutation();
  const [verifyLogin] = useVerifyLoginMutation();
  const [changePassword] = useChangePasswordMutation();
  const user = useSelector(currentUser);
  useEffect(() => {
    // Only redirect if user exists and NOT showing new password dialog
    if (user && !showNewPasswordDialog) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else {
        router.push("/");
      }
    }
  }, [user, showNewPasswordDialog, router]);

  if (user && !showNewPasswordDialog) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrPhone) {
      toast.warning("Please enter your email or phone number");
      return;
    }
    try {
      setLoading(true);
      const response = await userLogin({ emailOrPhone });
      const userRole = response?.data?.meta?.role;
      if (userRole === "admin") {
        setShowPasswordDialog(true);
      } else {
        toast.error("Unrecognized user role");
      }
      setRole(userRole);
    } catch (error) {
      toast.error("No user found!", error?.message);
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordSubmit = async () => {
    try {
      setLoading(true);
      const response = await verifyLogin({ otpValue: password });
      const success = response?.data?.success;
      const message = response?.error?.data?.message;

      if (!success) {
        toast.error(message || "Invalid password");
      }
      const token = response?.data?.data?.authToken;
      if (token) {
        dispatch(setUserFromToken(token));
        if (response?.data?.data?.newLogin) {
          setShowPasswordDialog(false);
          setShowNewPasswordDialog(true);
        } else {
          toast.success("Login successful");
          setShowPasswordDialog(false);
          router.push("/admin");
        }
        setPassword("");
      }
    } catch (error) {
      // console.error("Login error:", error);
      toast.error(
        `Password error: ${
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
        }`
      );
    } finally {
      setLoading(false);
    }
  };
  const handleSetNewPassword = async () => {
    const hasMinimumLength = newPassword.length >= 8;
    const hasDigit = /\d/.test(newPassword);

    if (!hasMinimumLength || !hasDigit) {
      toast.error(
        "Password must be at least 8 characters and include a digit."
      );
      return;
    }
    try {
      setLoading(true);
      await changePassword({ newPassword });
      toast.success(
        "Password set successfully! Please, Login again to confirm."
      );
      dispatch(removeUser());
      setNewPassword("");
      setShowNewPasswordDialog(false);
      router.push("/login");
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <Loading />;
  }
  return (
    <div className="h-[560px] w-full flex items-center justify-center px-4 mt-6 md:mt-10 lg:mt-30">
      {!showPasswordDialog && !showNewPasswordDialog && (
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="flex flex-col items-center py-4">
            <Image src="/logo.png" width={120} height={60} alt="Logo" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign In for Admin Dashboard
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label
                  htmlFor="emailOrPhone"
                  className="flex items-center gap-2 mb-3"
                >
                  <MdOutlineMail />
                  Email / Phone
                </Label>
                <Input
                  id="emailOrPhone"
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="Enter your email or phone number"
                  required
                />
              </div>
              <Button type="submit"             className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send User Credential
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      {/* Password Dialog */}
      {!showNewPasswordDialog && (
        <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="px-10 py-4">
                <Image
                  src="/logo.png"
                  width={120}
                  height={60}
                  alt="Logo"
                  className="mx-auto mb-4"
                />
              </div>
              <DialogTitle>Enter Password</DialogTitle>
              <DialogDescription>
                Please enter your password to continue.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <PasswordInput
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handlePasswordSubmit}             className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {/* Set New Password Dialog */}
      <Dialog
        open={showNewPasswordDialog}
        onOpenChange={setShowNewPasswordDialog}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="px-10 py-4">
              <Image
                src="/logo.png"
                width={120}
                height={60}
                alt="Logo"
                className="mx-auto mb-4"
              />
            </div>
            <DialogTitle>Set New Password (8 digit)</DialogTitle>
            <DialogDescription>
              It looks like this is your first login. Please set a new password.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <PasswordInput
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              onClick={handleSetNewPassword}
              className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={newPassword.length < 8 || !/\d/.test(newPassword)}
            >
              Set Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default Login;
