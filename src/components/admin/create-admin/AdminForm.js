"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { ShieldUser } from "lucide-react";
import InputField from "@/components/form/InputField";
import Swal from "sweetalert2";
import { toast } from "sonner";
import PhoneField from "@/components/form/PhoneField";
import adminApiServices, {
  useAssignCoursesToAdminsMutation,
  useCreateAdminMutation,
} from "@/redux/services/adminApi";
import { useDispatch, useSelector } from "react-redux";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import Dropdown from "@/components/form/Dropdown";

export default function AdminForm() {
  const courses = useSelector(selectAllCourses);
  // console.log(courses);
  const courseOptions =
    courses?.data?.map((course) => ({
      label: course.productFullName,
      value: course.id,
    })) || [];
  const methods = useForm({
    defaultValues: { username: "", email: "", phone: "", courseId: "" },
  });

  const dispatch = useDispatch();

  const { handleSubmit, reset } = methods;

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [assignCoursesToAdmins, { isLoading: isAssigning }] =
    useAssignCoursesToAdminsMutation();

  const onSubmit = async (data) => {
    const { email, phone, username, courseId } = data;

    try {
      const { data: newAdmin } = await createAdmin({
        name: username,
        email,
        phone,
      }).unwrap();

      const assignRes = await assignCoursesToAdmins({
        newAdminId: newAdmin.id,
        courseId,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Admin successfully created & assigned",
        timer: 1500,
      });

      reset();
    } catch (err) {
      try {
        const { data: existingAdmin } = await dispatch(
          adminApiServices.endpoints.getAdminByEmailOrPhone.initiate(email)
        ).unwrap();
        // console.log(existingAdmin);
        const existingId = existingAdmin?.data?.[0]?.id;
        if (existingId) {
          await assignCoursesToAdmins({
            newAdminId: existingId,
            courseId,
          }).unwrap();
          Swal.fire({
            icon: "success",
            title: "Admin assigned to course!",
            timer: 1500,
          });
          reset();
          return;
        }
      } catch (err2) {
        toast.error(err2?.data?.message);
      }

      toast.error(err?.data?.message || "Failed to create admin.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 max-w-xl p-4 mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md"
      >
        <Dropdown
          label="Select Course"
          name="courseId"
          className="tiro-bangla-text"
          options={courseOptions}
          rules={{ required: "Course is required" }}
        />
        <InputField
          label="Name"
          name="username"
          placeholder="Enter admin name"
          rules={{
            required: "Name is required.",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters.",
            },
            pattern: {
              value: /^[A-Za-z\s'-]+$/,
              message:
                "Name can only contain letters, spaces, hyphens, and apostrophes.",
            },
          }}
        />

        <InputField
          label="Email Address"
          name="email"
          placeholder="Enter email address"
          type="email"
          rules={{
            required: "Email is required.",
            pattern: {
              value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
              message: "Invalid email format.",
            },
          }}
        />

        <PhoneField />

        <div>
          <button
            type="submit"
            disabled={isCreating || isAssigning}
            className="w-full bg-blue-400 text-sm md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating || isAssigning ? "Processing..." : "Create Admin"}
            <ShieldUser className="ml-2 h-5 w-5" />
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
