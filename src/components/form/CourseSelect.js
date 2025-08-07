"use client";

import React from "react";

function CourseSelect({
  label = "Select Course",
  courses = [],
  selectedCourseId,
  onChange,
}) {
  //   console.log(courses);
  return (
    <div className="p-2 pt-5 grid grid-cols-2 justify-center items-center">
      <label className="text-xs md:text-base w-full font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={selectedCourseId}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white text-xs md:text-sm"
      >
        <option value="">-- Select Course --</option>
        {courses?.map((course) => (
          <option key={course.id} value={course.id}>
            {course.productName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CourseSelect;
