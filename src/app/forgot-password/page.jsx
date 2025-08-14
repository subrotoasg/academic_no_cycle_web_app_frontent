// "use client";

// import { useForgotPasswordMutation } from "@/redux/services/authApi";
// import { toast } from "sonner";

// const page = () => {
//   const [userForgottenInfo, { isLoading }] = useForgotPasswordMutation();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const emailAddress = formData.get("email");
//     try {
//       const res = await userForgottenInfo({ email: emailAddress }).unwrap();
//       if (res.success) {
//         toast.success(res?.message);
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
//           Forgot Password{" "}
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="flex flex-col">
//           <div className="flex flex-col gap-1 mb-3">
//             <label htmlFor="email" className="mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               id="emailOrPhone"
//               name="email"
//               placeholder="Enter your email"
//               required
//               className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="flex justify-center items-center text-white bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500 w-full py-3 rounded-md shadow-md mt-3 cursor-pointer"
//           >
//             Send Password
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default page;

"use client";

import { useForgotPasswordMutation } from "@/redux/services/authApi";
import { toast } from "sonner";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [userForgottenInfo, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await userForgottenInfo({ email }).unwrap();
      if (res.success) {
        toast.success(res?.message);
        setEmail("");
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
              Forgot Password
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Enter your email to reset your password
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="h-11 w-full rounded-md border-2 border-black dark:border-gray-200 bg-transparent px-3 focus:ring-4 focus:ring-blue-400/50 dark:focus:ring-blue-500/50 text-gray-900 dark:text-gray-100"
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
