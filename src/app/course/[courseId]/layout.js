"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useGetMyCoursesQuery } from "@/redux/services/studentCourseApi";
import StudentRoute from "@/PrivateRoute/StudentRoute";
import { selectEnrolledCourses } from "@/redux/Features/mycourses";
import { currentUser } from "@/redux/Features/authentication";
import { selectAllCourses } from "@/redux/Features/courseInfo";

function ActualLayoutLogic({ children }) {
  const { courseId } = useParams();
  const router = useRouter();

  const user = useSelector(currentUser);
  const role = user?.role;
  // const enrolledCourses = useSelector(
  //   (state) => state.studentCourses.enrolledCourses
  // );

  const enrolledCourses = useSelector(selectEnrolledCourses);

  const allowedArchives = useSelector(
    (state) => state.archiveAccess.allowedArchiveCourseIds
  );

  const { data, isLoading } = useGetMyCoursesQuery({ page: 1, limit: 100 });
  const courses = enrolledCourses || data?.data?.data || [];

  // Admin data
  const teacherCourses = useSelector(selectAllCourses);
  console.log(teacherCourses);

  // const isEnrolledOrArchiveAllowed =
  //   courses?.some((c) => c.courseId === courseId) ||
  //   allowedArchives.includes(courseId);

  // Check access
  const isEnrolledOrArchiveAllowed =
    role === "student" &&
    (courses?.some((c) => c.courseId === courseId) ||
      allowedArchives.includes(courseId));

  // Admin access (course or archive)
  const isTeacherAllowed =
    role === "admin" &&
    ((Array.isArray(teacherCourses?.data) &&
      teacherCourses.data.some((c) => c.id === courseId)) ||
      allowedArchives.includes(courseId));

  useEffect(() => {
    // if (!isLoading && !isEnrolledOrArchiveAllowed) {
    if (!isLoading && !(isEnrolledOrArchiveAllowed || isTeacherAllowed)) {
      router.replace("/unauthorized");
    }
    // }, [isLoading, isEnrolledOrArchiveAllowed, router]);
  }, [isLoading, isEnrolledOrArchiveAllowed, isTeacherAllowed, router]);

  // if (!isEnrolledOrArchiveAllowed) {
  //   return null;
  // }
  if (!isEnrolledOrArchiveAllowed && !isTeacherAllowed) {
    return null;
  }

  // if (isLoading || !courses.length) {
  if (isLoading && role === "student") {
    return (
      <div className="text-center mt-20 md:mt-36">
        Checking course access...
      </div>
    );
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
