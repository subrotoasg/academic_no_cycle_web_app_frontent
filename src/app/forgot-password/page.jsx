"use client";

import { useForgotPasswordMutation } from "@/redux/services/authApi";
import { toast } from "sonner";

const page = () => {
  const [userForgottenInfo, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const emailAddress = formData.get("email");
    try {
      const res = await userForgottenInfo({ email: emailAddress }).unwrap();
      if (res.success) {
        toast.success(res?.message);
        e.target.reset();
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 text-sm text-gray-900 dark:text-gray-100 flex flex-col gap-5 rounded-lg shadow-md">
        {/* Title */}
        <div className="text-center font-semibold text-lg">Forgot Password</div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-1 mb-3">
            <label htmlFor="email" className="mb-1">
              Email
            </label>
            <input
              type="email"
              id="emailOrPhone"
              name="email"
              placeholder="Enter your email"
              required
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="flex justify-center items-center text-white bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500 w-full py-3 rounded-md shadow-md mt-3 cursor-pointer"
          >
            Send Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
