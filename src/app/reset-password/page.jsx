// "use client";
// import { useResetPasswordMutation } from "@/redux/services/authApi";
// import { jwtDecode } from "jwt-decode";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";

// const page = () => {
//   const [userResetPassword, { isLoading }] = useResetPasswordMutation();
//   const searchParams = useSearchParams();
//   const user = searchParams.get("user");
//   const decoded = jwtDecode(user);
//   const router = useRouter();

//   //handle Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const password = formData.get("password");
//     try {
//       const res = await userResetPassword({
//         email: decoded?.email,
//         newPassword: password,
//       }).unwrap();

//       if (res.success) {
//         toast.success(res?.message);
//         router.push("/login");
//         e.target.reset();
//       }
//     } catch (error) {
//       toast.error(error?.message);
//     }
//   };
//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
//       <div className="bg-white dark:bg-gray-800 p-8 text-sm text-gray-900 dark:text-gray-100 flex flex-col gap-5 rounded-lg shadow-md">
//         {/* Title */}
//         <div className="text-center font-semibold text-lg">
//           Set Your New Password
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="flex flex-col">
//           <div className="flex flex-col gap-1 mb-3">
//             <label htmlFor="email" className="mb-1">
//               New Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="**********"
//               required
//               className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="flex justify-center items-center text-white bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500 w-full py-3 rounded-md shadow-md mt-3 cursor-pointer"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default page;

"use client";

import { useResetPasswordMutation } from "@/redux/services/authApi";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";

const ResetPasswordPage = () => {
  const [userResetPassword, { isLoading }] = useResetPasswordMutation();
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  // const decoded = jwtDecode(user);
  const router = useRouter();

  let decoded = null;
  try {
    if (user) {
      decoded = jwtDecode(user);
    } else {
      toast.error("Invalid or missing reset link");
      // router.push("/login");
    }
  } catch (err) {
    toast.error("Invalid token");
    // router.push("/login");
  }
  const [password, setPassword] = useState("");

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userResetPassword({
        email: decoded?.email,
        newPassword: password,
      }).unwrap();

      if (res.success) {
        toast.success(res?.message);
        setPassword("");
        router.push("/login");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-gray-950 p-4 transition-colors duration-300">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 border-2 border-black dark:border-gray-200 rounded-lg shadow-[8px_8px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_rgba(255,255,255,0.2)] transition-shadow duration-300">
        {/* Logo */}
        <div className="p-6 border-b-2 border-black dark:border-gray-200 flex justify-center">
          <Image src="/logo.png" width={100} height={50} alt="Logo" />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-1 mb-5">
            <h1 className="text-xl font-bold text-black dark:text-white">
              Set Your New Password
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter a strong password for your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              className="h-11 w-full rounded-md border-2 border-black dark:border-gray-200 bg-transparent px-3 focus:ring-4 focus:ring-blue-400/50 dark:focus:ring-blue-500/50 text-gray-900 dark:text-gray-100"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
