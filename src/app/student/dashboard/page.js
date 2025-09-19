"use client";
import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";

import EnrolledCourseCard from "@/components/cards/EnrolledCourseCard";
import DashboardCourseCard from "@/components/cards/DashboardCourseCard";
import StudentRoute from "@/PrivateRoute/StudentRoute";
import LiveClassLayout from "@/components/liveClass/LiveClassLayout";
import LoadingData from "@/components/common/LoadingData";
import ErrorDataFetching from "@/components/common/ErrorDataFetching";

import { useGetMyCoursesQuery } from "@/redux/services/studentCourseApi";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { useGetAllLiveClassQuery } from "@/redux/services/liveClassApi";
import { setEnrolledCourses } from "@/redux/Features/mycourses";

function StudentDashboard() {
  const dispatch = useDispatch();

  // Queries
  const {
    data: enrolledData,
    isLoading: enrolledLoading,
    isError: enrolledError,
  } = useGetMyCoursesQuery({ page: 1, limit: 100 });

  const {
    data: allCourseData,
    isLoading: allLoading,
    isError: allError,
  } = useGetAllCourseQuery({ limit: 100 });

  const { data: liveClassData, isLoading: liveClassLoading } =
    useGetAllLiveClassQuery();

  // Store enrolled courses in Redux
  useEffect(() => {
    if (enrolledData?.data?.data) {
      dispatch(setEnrolledCourses({ courses: enrolledData.data.data }));
    }
  }, [enrolledData, dispatch]);

  // Extract enrolled & all courses
  const enrolledCourses = useMemo(() => {
    return enrolledData?.data?.data ?? [];
  }, [enrolledData]);

  const allCourses = useMemo(() => {
    return allCourseData?.data?.data ?? [];
  }, [allCourseData]);

  // Merge enrolled info with all courses
  const mergedCourses = useMemo(() => {
    return allCourses
      ?.filter((course) => !course.markAsArchieve)
      ?.map((course) => ({
        ...course,
        isEnrolled: enrolledCourses.some((en) => en.courseId === course.id),
      }));
  }, [allCourses, enrolledCourses]);

  // Loading & error states
  const isLoading = enrolledLoading || allLoading || liveClassLoading;
  const isError = enrolledError || allError;

  if (isLoading) return <LoadingData />;
  if (isError) return <ErrorDataFetching />;

  return (
    <div className="container mx-auto pt-16 md:pt-28 mb-10">
      {enrolledCourses?.length === 0 ? (
        <>
          <div className="text-center pb-10 text-lg font-medium text-gray-500">
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

          {/* Available Courses */}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              আপনার জন্য কোর্সসমূহ
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 md:py-8 p-4">
              {mergedCourses?.map((course) => (
                <DashboardCourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Live Classes */}
          <LiveClassLayout data={liveClassData} />

          {/* Enrolled Courses */}
          <div className="mb-12">
            {/* <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white text-center md:mb-5 mb-2 md:text-left md:pl-4">
              আমার কোর্সসমূহ
            </h2> */}
            {mergedCourses?.filter((course) => course.isEnrolled).length >
              0 && (
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-blue-500  text-center md:mb-5 mb-2 md:text-left md:pl-4">
                {mergedCourses.filter((course) => course.isEnrolled).length ===
                1
                  ? "আমার কোর্স"
                  : "আমার কোর্সসমূহ"}
              </h2>
            )}
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
              {mergedCourses
                ?.filter((course) => course.isEnrolled)
                ?.map((course) => (
                  <EnrolledCourseCard
                    key={course.id}
                    courseInfo={{ courseId: course.id, course }}
                  />
                ))}
            </div>
          </div>

          {/* Available Courses */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-blue-500  text-center md:mb-5 mb-2 md:text-left md:pl-4 ">
              কোর্সগুলো শুরু করো এখনই
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
              {mergedCourses
                ?.filter(
                  (course) => !course.isEnrolled && course.productId !== 548
                )
                ?.map((course) => (
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
