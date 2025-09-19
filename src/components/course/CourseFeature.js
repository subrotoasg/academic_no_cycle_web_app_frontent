"use client";
import { useState, useMemo } from "react";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import LiveClassLayout from "../liveClass/LiveClassLayout";
import { useGetAllLiveClassQuery } from "@/redux/services/liveClassApi";
import LoadingData from "../common/LoadingData";
import ErrorDataFetching from "../common/ErrorDataFetching";
import NoCourseAvailable from "../common/NoCourseAvailable";
import CourseSimpleCard from "../cards/CourseSimpleCard";

const defaultLimit = 1000;

function normalize(str) {
  return typeof str === "string" ? str.trim().toLowerCase() : "";
}

const CourseFeature = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const {
    data: courseData,
    isLoading,
    isError,
  } = useGetAllCourseQuery({ limit: defaultLimit });
  const { data, isLoading: isLiveLoading } = useGetAllLiveClassQuery();

  const courses = useMemo(() => {
    return courseData?.data?.data ?? [];
  }, [courseData]);

  // subcategories from the courses
  const subCategories = useMemo(() => {
    const unique = Array.from(
      new Set(courses?.map((c) => c.SubCategory).filter(Boolean))
    );
    return ["All", ...unique];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All") return courses;
    return courses?.filter(
      (c) => normalize(c.SubCategory) === normalize(selectedCategory)
    );
  }, [courses, selectedCategory]);

  //loading data
  if (isLoading || isLiveLoading) {
    return <LoadingData />;
  }
  //error fetch data
  if (isError) {
    return <ErrorDataFetching />;
  }
  //data not found
  if (!courses?.length > 0) {
    return <NoCourseAvailable />;
  }
  return (
    <>
      <LiveClassLayout data={data} />
      <div className="container mx-auto p-2">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {subCategories?.map((cat) => (
            <button
              key={cat}
              className={`btn rounded-full py-2 px-4 text-nowrap shadow-sm border font-bold ${
                selectedCategory === cat
                  ? "text-white bg-blue-500 border-blue-700 border-1"
                  : "bg-white text-blue-500 border-blue-700 border-1"
              }`}
              style={{
                backgroundColor:
                  selectedCategory === cat
                    ? "#1c4bb1"
                    : hoveredCategory === cat
                    ? "#bfdbfe"
                    : "",
              }}
              onClick={() => setSelectedCategory(cat)}
              onMouseEnter={() => setHoveredCategory(cat)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-x-3 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 py-4 md:py-6 p-4 justify-center">
          {filteredCourses?.map((course) => (
            <div key={course.id}>
              <CourseSimpleCard course={course} />
            </div>
          ))}
          {filteredCourses?.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No courses found for {selectedCategory}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CourseFeature;
