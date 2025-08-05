"use client";

import PrivateRouter from "@/PrivateRoute/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { selectAllCourses, setCourses } from "@/redux/Features/courseInfo";

export default function AdminLayout({ children }) {
  const defaultLimit = 100;
  const dispatch = useDispatch();

  const {
    data: courseData,
    isLoading,
    isError,
    isSuccess,
    refetch: refetchCourses,
  } = useGetAllCourseQuery({ limit: defaultLimit });
  console.log(courseData);

  useEffect(() => {
    if (isSuccess && courseData?.data) {
      dispatch(setCourses(courseData.data));
    }
  }, [isSuccess, courseData, dispatch]);

  const courses = useSelector(selectAllCourses);

  return (
    <PrivateRouter>
      <div className="min-h-auto grid grid-cols-1 md:grid-cols-12 my-10 md:my-0">
        <aside className="md:col-span-4 lg:col-span-3 border-r border-muted bg-white dark:bg-gray-900 ">
          <AdminSidebar />
        </aside>

        <main className="md:col-span-8 lg:col-span-9 px-4 mt-10 mb-2 md:mb-5 md:mt-5 w-full max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </PrivateRouter>
  );
}
