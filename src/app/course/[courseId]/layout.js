"use client";
import { useParams, useRouter } from "next/navigation";
import { useGetMyCoursesQuery } from "@/redux/services/studentCourseApi";
import StudentRoute from "@/PrivateRoute/StudentRoute";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";
import LoadingData from "@/components/common/LoadingData";

function ActualLayoutLogic({ children }) {
  const { courseId } = useParams();
  const router = useRouter();
  const user = useSelector(currentUser);
  const role = user?.role;

  const { data, isLoading } = useGetMyCoursesQuery({ limit: 100 });

  const course = data?.data?.data?.find((c) => c.courseId === courseId);
  const isEnrolled = course?.isEnrolled ?? false;

  const allowedArchives = useSelector(
    (state) => state.archiveAccess.allowedArchiveCourseIds
  );

  // Access Control
  const isStudentAllowed =
    role === "student" && (isEnrolled || allowedArchives.includes(courseId));

  const isTeacherAllowed =
    role === "admin" && allowedArchives.includes(courseId);

  // Unauthorized redirect
  // if (!isLoading && !(isStudentAllowed || isTeacherAllowed)) {
  //   router.replace("/unauthorized");
  //   return null;
  // }

  if (isLoading) {
    return <LoadingData />;
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

//=====================
// "use client";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useGetMyCoursesQuery } from "@/redux/services/studentCourseApi";
// import StudentRoute from "@/PrivateRoute/StudentRoute";
// import { selectEnrolledCourses } from "@/redux/Features/mycourses";
// import { currentUser } from "@/redux/Features/authentication";
// import { selectAllCourses } from "@/redux/Features/courseInfo";

// function ActualLayoutLogic({ children }) {
//   const { courseId } = useParams();
//   const { data, isLoading } = useGetMyCoursesQuery({ limit: 100 });
//   const router = useRouter();
//   const user = useSelector(currentUser);
//   const role = user?.role;

//   const enrolledCourses = useSelector(selectEnrolledCourses);
//   const allowedArchives = useSelector(
//     (state) => state.archiveAccess.allowedArchiveCourseIds
//   );

//   const courses = data?.data?.data || enrolledCourses || [];
//   // Admin data
//   const teacherCourses = useSelector(selectAllCourses);
//   // Check access
//   const isEnrolledOrArchiveAllowed =
//     role === "student" &&
//     (courses?.some((c) => c.courseId === courseId) ||
//       allowedArchives.includes(courseId));

//   // Admin access (course or archive)
//   const isTeacherAllowed =
//     role === "admin" &&
//     ((Array.isArray(teacherCourses?.data) &&
//       teacherCourses.data.some((c) => c.id === courseId)) ||
//       allowedArchives.includes(courseId));

//   // useEffect(() => {
//   //   if (!isLoading && !(isEnrolledOrArchiveAllowed || isTeacherAllowed)) {
//   //     router.replace("/unauthorized");
//   //   }
//   // }, [isLoading, isEnrolledOrArchiveAllowed, isTeacherAllowed, router]);

//   // if (!isEnrolledOrArchiveAllowed && !isTeacherAllowed) {
//   //   return null;
//   // }

//   // if (isLoading || !courses.length) {
//   if (isLoading && role === "student") {
//     return (
//       <div className="text-center mt-20 md:mt-36">
//         Checking course access...
//       </div>
//     );
//   }
//   return <>{children}</>;
// }

// export default function CourseLayout({ children }) {
//   return (
//     <StudentRoute>
//       <ActualLayoutLogic>{children}</ActualLayoutLogic>
//     </StudentRoute>
//   );
// }
