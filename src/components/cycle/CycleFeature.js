"use client";
import { useState } from "react";
import CycleCard from "../cards/CycleCard";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";
import { useGetCyclesByCourseIdQuery } from "@/redux/services/cycleCreateApi";
import { Card } from "../ui/focus-cards";
import { motion } from "framer-motion"; // Import motion from framer-motion

const CycleFeature = () => {
  const [hovered, setHovered] = useState(null);
  const course = useSelector(selectCourse);
  const courseId = course?.id;
  const { data: cycleData, isLoading } = useGetCyclesByCourseIdQuery(courseId);
  const cycles = cycleData?.data || [];

  const sortedCycles = [...cycles].sort((a, b) => {
    const numA = parseInt(a.title.replace(/[^\d]/g, ""));
    const numB = parseInt(b.title.replace(/[^\d]/g, ""));
    return numA - numB;
  });

  // Define animation variants for the grid container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // The delay between each child animating
      },
    },
  };

  // Define animation variants for each card item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 200,
      },
    },
  };

  if (!cycleData || cycles.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto p-2">
      {/* Animated Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 mb-8">
          Available Cycles
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mt-2">
          Explore our structured academic cycles, each covering a group of key
          subjects.
        </p>
      </motion.div>

      {/* Animated Grid Container */}
      <motion.div
        className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 md:py-8 p-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sortedCycles.map((cycle, index) => (
          <motion.div key={cycle.id} variants={itemVariants}>
            <Card
              card={cycle}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CycleFeature;
