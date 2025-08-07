"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import InputField from "@/components/form/InputField";
import { ShieldCheck } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useRedeemCourseMutation } from "@/redux/services/studentCourseApi";
import { useRouter } from "next/navigation";

export default function CourseAccessForm({ setIsModalOpen }) {
  const router = useRouter();
  const methods = useForm({
    defaultValues: { accessCode: "" },
  });

  const { handleSubmit, reset } = methods;
  const [redeemCourse, { isLoading }] = useRedeemCourseMutation();
  const onSubmit = async ({ accessCode }) => {
    try {
      const res = await redeemCourse(accessCode).unwrap();
      console.log(res);

      if (res.success) {
        Swal.fire({
          icon: "success",
          title: "Course access granted!",
          timer: 1500,
        });
        setIsModalOpen(false);
        router.push("/student/dashboard");
        reset();
      }
    } catch (error) {
      toast.error("Invalid access code or something went wrong.");
    }
  };

  return (
    <div className="w-full p-1 md:p-4 bg-white dark:bg-gray-900 shadow-lg rounded-2xl space-y-4">
      <h1 className="text-xl md:text-2xl font-bold text-center dark:text-white">
        Enter Course Access Code
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Submit your access code to unlock the course
      </p>

      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 max-w-md p-3 mx-auto"
        >
          <InputField
            label="Access Code"
            name="accessCode"
            placeholder="Enter your course access code"
            rules={{ required: "Access code is required." }}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center hover:rounded-full"
          >
            {isLoading ? "Verifying..." : "Submit Code"}
            <ShieldCheck className="ml-2 h-5 w-5" />
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
