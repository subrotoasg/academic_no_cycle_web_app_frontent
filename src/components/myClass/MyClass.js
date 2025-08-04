"use client";

import { selectCourse } from "@/redux/Features/courseInfo";
import { useGetCyclesByCourseIdQuery } from "@/redux/services/cycleCreateApi";
import React from "react";
import { useSelector } from "react-redux";
import CycleFeature from "../course/CourseFeature";

function MyClass() {
  const course = useSelector(selectCourse);
  const courseId = course?.id;
  const { data: cycleData, isLoading } = useGetCyclesByCourseIdQuery(courseId);

  if (isLoading) {
    return (
      <div className="py-24 mx-4">
        <h2 className="text-lg md:text-xl font-bold text-center text-blue-500">
          Loading Courses...
        </h2>
      </div>
    );
  }

  if (!cycleData || cycleData?.data?.length === 0) {
    return (
      <div className="py-25">
        <h2 className="text-2xl font-bold text-center text-red-500 mt-20">
          Oooops! No Cycles Available Yet
        </h2>
      </div>
    );
  }

  return (
    <div className="py-20 mx-4">
      <CycleFeature />
    </div>
  );
}

export default MyClass;
