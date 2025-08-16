"use client";

import EnrolledCourseCard from "@/components/cards/EnrolledCourseCard";
import DashboardCourseCard from "@/components/cards/DashboardCourseCard";
import StudentRoute from "@/PrivateRoute/StudentRoute";
import { useGetMyCoursesQuery } from "@/redux/services/studentCourseApi";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { motion } from "framer-motion";
import { useMemo } from "react";
import Link from "next/link";

function StudentDashboard() {
  // Fetch enrolled courses
  const {
    data: enrolledData,
    isLoading: enrolledLoading,
    isError: enrolledError,
  } = useGetMyCoursesQuery({ page: 1, limit: 100 });
  // console.log(enrolledData);
  const {
    data: allCourseData,
    isLoading: allLoading,
    isError: allError,
  } = useGetAllCourseQuery({ limit: 100 });

  const EnrolledCourses = enrolledData?.data?.data || [];

  const courses = useMemo(() => {
    const allCourses = allCourseData?.data?.data || [];
    return allCourses.filter((course) => !course.markAsArchieve);
  }, [allCourseData]);

  // const mergedCourses = AllCourses?.map((course) => {
  const mergedCourses = courses?.map((course) => {
    const isEnrolled = EnrolledCourses?.some((en) => en.courseId === course.id);
    return { ...course, isEnrolled };
  });

  const sortedCourses = mergedCourses?.sort((a, b) => {
    if (a.isEnrolled === b.isEnrolled) return 0;
    return a.isEnrolled ? -1 : 1;
  });

  const isLoading = enrolledLoading || allLoading;
  const isError = enrolledError || allError;

  return (
    <div className="container mx-auto pt-16 md:pt-28 mb-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Enrolled Courses
      </h1>

      {isLoading && (
        <div className="text-center py-20 text-lg font-medium text-gray-600">
          Loading courses ...
        </div>
      )}

      {isError && (
        <div className="text-center py-20 text-lg font-medium text-red-500">
          Failed to load courses info, please try again.
        </div>
      )}

      {!isLoading && !isError && EnrolledCourses.length === 0 && (
        <>
          <div className="text-center py-10 text-lg font-medium text-gray-500">
            আপনি এখনও কোনো কোর্স অ্যাক্সেস করেননি। <br />
            <p className="text-blue-600 font-semibold cursor-pointer hover:underline my-3">
              নির্দিষ্ট কোর্সের জন্য অ্যাক্সেস কোড প্রদান করে আপনার কোর্সে
              প্রবেশ করুন।
            </p>
            <Link href="/" passHref>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs rounded hover:rounded-full">
                Access Course
              </button>
            </Link>
          </div>
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Available Courses
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 md:py-8 p-4">
              {sortedCourses.map((course) => (
                <DashboardCourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </>
      )}

      {!isLoading && !isError && EnrolledCourses.length > 0 && (
        <>
          <div className="mb-12">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
              {sortedCourses
                .filter((course) => course.isEnrolled)
                .map((course) => (
                  <EnrolledCourseCard
                    key={course.id}
                    courseInfo={{ courseId: course.id, course }}
                  />
                ))}
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-10 text-center">
              Available Courses
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
              {sortedCourses
                .filter((course) => !course.isEnrolled)
                .map((course) => (
                  <DashboardCourseCard key={course.id} course={course} />
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function StudentProfile() {
  return (
    <StudentRoute>
      <StudentDashboard />
    </StudentRoute>
  );
}
