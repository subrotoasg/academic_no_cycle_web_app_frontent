"use client";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import PrivateRouter from "@/PrivateRoute/PrivateRoute";
import { useDispatch } from "react-redux";
import { useGetCourseByIdQuery } from "@/redux/services/courseApi";
import { useEffect } from "react";
import { setCourse } from "@/redux/Features/courseInfo";

export default function AdminLayout({ children }) {
  const courseId = "24269548-8338-4666-84db-a7d330dbb210";
  const dispatch = useDispatch();

  const { data: courseInfo, isSuccess } = useGetCourseByIdQuery(courseId);

  useEffect(() => {
    if (isSuccess && courseInfo?.data) {
      dispatch(setCourse(courseInfo.data));
    }
  }, [isSuccess, courseInfo, dispatch]);

  return (
    <PrivateRouter>
      <div className="min-h-auto grid grid-cols-1 md:grid-cols-12 my-10 md:my-0">
        <aside className="md:col-span-4 lg:col-span-3 border-r border-muted bg-white dark:bg-gray-900">
          <AdminSidebar />
        </aside>

        <main className="md:col-span-8 lg:col-span-9 px-4 mt-10 mb-2 md:mb-5 md:mt-5 w-full max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </PrivateRouter>
  );
}
