"use client";

import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Dropdown from "@/components/form/Dropdown";
import { Button } from "@/components/ui/button";
// import { getCourse } from "@/api/admin/createCourse";
// import { assignCoursesToAdmins } from "@/api/admin/CoursesToAdmins/CoursesToAdminsApis";
import Loading from "../utilities/Loading";
import { toast } from "sonner";
import Swal from "sweetalert2";
// import useAdmins from "@/hooks/useAdmins";

export default function AdminAssignForm({ fetchAssignedAdminInfo }) {
  const [courseOptions, setCourseOptions] = useState([]);
  const [adminOptions, setAdminOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState([]);
  const methods = useForm({
    defaultValues: {
      course: "",
      admin: "",
    },
  });
  const { admins } = useAdmins();
  useEffect(() => {
    setAdminId(admins?.data);
  }, [admins]);

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    async function fetchData() {
      try {
        const courses = await getCourse();       
        const formattedCourses = courses.map((course) => ({
          label: course.title,
          value: course.id,
        }));

        const formattedAdmins = adminId.map((admin) => ({
          label: admin.name,
          value: admin.id,
        }));

        setCourseOptions(formattedCourses);
        setAdminOptions(formattedAdmins);
      } catch (error) {
        toast.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [adminId]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("newAdminId", data.admin);
    formData.append("courseId", data.course);

    try {
      await assignCoursesToAdmins(formData);
      Swal.fire({
        icon: "success",
        title: "Course Successfully Assigned to Admin",
        timer: 1500,
      });
      reset();
      await fetchAssignedAdminInfo();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Course Assign Failed. Try Again!"
      );
    }
  };

  if (loading) return <Loading />;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md"
      >
        <Dropdown
          label="Select Course"
          name="course"
          options={courseOptions}
          placeholder="Choose a course"
          rules={{ required: "Course selection is required." }}
        />

        <Dropdown
          label="Select Admin"
          name="admin"
          options={adminOptions}
          placeholder="Choose an admin"
          rules={{ required: "Admin selection is required." }}
        />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-400 text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {isSubmitting ? "Assigning..." : "Assign Course"}
        </Button>
      </form>
    </FormProvider>
  );
}
