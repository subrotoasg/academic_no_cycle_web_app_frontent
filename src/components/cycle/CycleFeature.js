"use client";
import { useState } from "react";
import CycleCard from "../cards/CycleCard";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";
import { useGetCyclesByCourseIdQuery } from "@/redux/services/cycleCreateApi";
import { Card } from "../ui/focus-cards";
import { motion } from "framer-motion";
import CourseCard from "../cards/CourseCard";

const CycleFeature = () => {
  const [hovered, setHovered] = useState(null);
  const course = useSelector(selectCourse);
  const courseId = course?.id;
  // const courseId = "9edd9b7f-6ed7-4ad4-9766-abdeec2530e3";
  const { data: cycleData, isLoading } = useGetCyclesByCourseIdQuery(courseId);
  const cycles = cycleData?.data || [];
  console.log(cycleData);

  const sortedCycles = [...cycles].sort((a, b) => {
    const numA = parseInt(a.title.replace(/[^\d]/g, ""));
    const numB = parseInt(b.title.replace(/[^\d]/g, ""));
    return numA - numB;
  });

  if (!cycleData || cycles.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 mb-8">
        Available Courses
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 md:py-8 p-4">
        {sortedCycles.map((cycle, index) => (
          <div key={cycle.id}>
            <CourseCard course={cycle} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CycleFeature;
