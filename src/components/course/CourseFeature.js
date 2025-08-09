// "use client";

// import CourseCard from "../cards/CourseCard";
// import { useGetAllCourseQuery } from "@/redux/services/courseApi";

// const defaultLimit = 1000;
// const CourseFeature = () => {
//   const {
//     data: courseData,
//     isLoading,
//     isError,
//     refetch: refetchCourses,
//   } = useGetAllCourseQuery({ limit: defaultLimit });

//   const courses = courseData?.data?.data || [];
//   console.log(courses);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[40vh]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
//         <span className="ml-4 text-blue-500 font-semibold text-lg">
//           Loading courses...
//         </span>
//       </div>
//     );
//   }

//   if (isError || !courseData) {
//     return (
//       <div className="text-center text-red-500 font-medium py-10">
//         Failed to load courses.
//       </div>
//     );
//   }
//   const sortedCourses = [...courses].sort((a, b) => {
//     const numA = parseInt(a.productName?.replace(/[^\d]/g, ""));
//     const numB = parseInt(b.productName?.replace(/[^\d]/g, ""));
//     return numA - numB;
//   });

//   if (!courseData || courses.length === 0) {
//     return null;
//   }

//   return (
//     <div className="container mx-auto p-2">
//       <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 mb-8">
//         Available Courses
//       </h2>

//       <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 md:py-8 p-4">
//         {sortedCourses.map((course, index) => (
//           <div key={course.id}>
//             <CourseCard course={course} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CourseFeature;

"use client";

import { useState, useMemo, useEffect } from "react";
import CourseCard from "../cards/CourseCard";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";

const defaultLimit = 1000;

function normalize(str) {
  return typeof str === "string" ? str.trim().toLowerCase() : "";
}

const CourseFeature = () => {
  const {
    data: courseData,
    isLoading,
    isError,
  } = useGetAllCourseQuery({ limit: defaultLimit });
  console.log(courseData);

  const courses = useMemo(() => {
    return courseData?.data?.data || [];
  }, [courseData]);

  //  Get all unique subcategories from the courses
  const subCategories = useMemo(() => {
    const unique = Array.from(
      new Set(courses.map((c) => c.SubCategory).filter(Boolean))
    );
    return ["All", ...unique];
  }, [courses]);

  // State for selected tab/category
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Sort courses numerically by productName’s numeric part
  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      const numA = parseInt(a.productName?.replace(/[^\d]/g, ""));
      const numB = parseInt(b.productName?.replace(/[^\d]/g, ""));
      return numA - numB;
    });
  }, [courses]);

  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All") return sortedCourses;
    return sortedCourses.filter(
      (c) => normalize(c.SubCategory) === normalize(selectedCategory)
    );
  }, [sortedCourses, selectedCategory]);

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

  if (isError) {
    return (
      <div className="text-center text-red-500 font-medium py-10">
        Failed to load courses.
      </div>
    );
  }

  if (!courses.length) {
    return (
      <div className="text-center text-gray-500 py-10">
        No courses available.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 mb-8">
        Available Courses
      </h2>

      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {subCategories.map((cat) => (
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

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 md:py-8 p-4">
        {filteredCourses.map((course) => (
          <div key={course.id}>
            <CourseCard course={course} />
          </div>
        ))}
        {filteredCourses.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-8">
            No courses found for {selectedCategory}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseFeature;
