"use client";

import Loading from "@/app/loading";
import CourseCard from "../cards/CourseCard";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";

const defaultLimit = 1000;
const CourseFeature = () => {
  const {
    data: courseData,
    isLoading,
    isError,
    refetch: refetchCourses,
  } = useGetAllCourseQuery({ limit: defaultLimit });
  // console.log(courseData);
  const courses = courseData?.data?.data || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <span className="ml-4 text-blue-500 font-semibold text-lg">
          Loading courses...
        </span>
      </div>
    );
  }

  if (isError || !courseData) {
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Failed to load courses.
      </div>
    );
  }
  const sortedCourses = [...courses].sort((a, b) => {
    const numA = parseInt(a.productName?.replace(/[^\d]/g, ""));
    const numB = parseInt(b.productName?.replace(/[^\d]/g, ""));
    return numA - numB;
  });

  if (!courseData || courses.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 mb-8">
        Available Courses
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 md:py-8 p-4">
        {sortedCourses.map((course, index) => (
          <div key={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseFeature;
