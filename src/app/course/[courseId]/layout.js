"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetMyCoursesQuery } from "@/redux/services/studentCourseApi";
import StudentRoute from "@/PrivateRoute/StudentRoute";

function ActualLayoutLogic({ children }) {
  const { courseId } = useParams();
  const router = useRouter();

  const enrolledCourses = useSelector(
    (state) => state.studentCourses.enrolledCourses
  );

  const { data, isLoading } = useGetMyCoursesQuery({ page: 1, limit: 100 });
  const courses = enrolledCourses || data?.data?.data || [];

  const isEnrolled = courses?.some((c) => c.courseId === courseId);

  useEffect(() => {
    if (!isLoading && !isEnrolled) {
      router.replace("/unauthorized");
    }
  }, [isLoading, isEnrolled, router]);

  if (isLoading || !courses.length) {
    return (
      <div className="text-center mt-20 md:mt-36">
        Checking course access...
      </div>
    );
  }

  if (!isEnrolled) {
    return null;
  }

  return <>{children}</>;
}

export default function CourseLayout({ children }) {
  return (
    <StudentRoute>
      <ActualLayoutLogic>{children}</ActualLayoutLogic>
    </StudentRoute>
  );
}
