"use client";
import { useResetPasswordMutation } from "@/redux/services/authApi";
import { jwtDecode } from "jwt-decode";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

const page = () => {
  const [userResetPassword, { isLoading }] = useResetPasswordMutation();
  const searchParams = useSearchParams();
  const user = searchParams.get("user");
  const decoded = jwtDecode(user);
  const router = useRouter();

  //handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const password = formData.get("password");
    try {
      const res = await userResetPassword({
        email: decoded?.email,
        newPassword: password,
      }).unwrap();

      if (res.success) {
        toast.success(res?.message);
        router.push("/login");
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
        <div className="text-center font-semibold text-lg">
          Set Your New Password
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="flex flex-col gap-1 mb-3">
            <label htmlFor="email" className="mb-1">
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="**********"
              required
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="flex justify-center items-center text-white bg-gray-900 hover:bg-gray-800 dark:bg-blue-600 dark:hover:bg-blue-500 w-full py-3 rounded-md shadow-md mt-3 cursor-pointer"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
