"use client";

import EnrolledCourseCard from "@/components/cards/EnrolledCourseCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import StudentRoute from "@/PrivateRoute/StudentRoute";
import { useGetMyCoursesQuery } from "@/redux/services/studentCourseApi";
import { motion } from "framer-motion";
import {
  Atom,
  FlaskConical,
  Calculator,
  HeartPulse,
  BookOpenText,
  Languages,
} from "lucide-react";

// const subjects = [
//   {
//     name: "Physics",
//     progress: 0,
//     color: "bg-blue-500",
//     icon: Atom,
//     chaptersCompleted: 1,
//     totalChapters: 5,
//   },
//   {
//     name: "Chemistry",
//     progress: 0,
//     color: "bg-green-500",
//     icon: FlaskConical,
//     chaptersCompleted: 2,
//     totalChapters: 5,
//   },
//   {
//     name: "Mathematics",
//     progress: 0,
//     color: "bg-red-500",
//     icon: Calculator,
//     chaptersCompleted: 1,
//     totalChapters: 3,
//   },
//   {
//     name: "Biology",
//     progress: 0,
//     color: "bg-purple-500",
//     icon: HeartPulse,
//     chaptersCompleted: 2,
//     totalChapters: 3,
//   },
//   {
//     name: "Bangla",
//     progress: 0,
//     color: "bg-yellow-500",
//     icon: BookOpenText,
//     chaptersCompleted: 2,
//     totalChapters: 5,
//   },
//   {
//     name: "English",
//     progress: 0,
//     color: "bg-pink-500",
//     icon: Languages,
//     chaptersCompleted: 1,
//     totalChapters: 2,
//   },
// ];

function StudentDashboard() {
  const { data, isLoading, isError } = useGetMyCoursesQuery({
    page: 1,
    limit: 100,
  });
  const EnrolledCourses = data?.data?.data || [];
  // console.log("courseEnrolled", EnrolledCourses);
  // const calculateProgress = (completed, total) => {
  //   return Math.round((completed / total) * 100);
  // };
  return (
    <div className="container mx-auto pt-28">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Enrolled Courses
      </h1>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject, index) => {
          const Icon = subject.icon;
          const progress = calculateProgress(
            subject.chaptersCompleted,
            subject.totalChapters
          );
          return (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${subject.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold">{subject.name}</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {subject.progress}%
                  </span>
                </div>

                <Progress
                  value={progress}
                  className="h-2"
                  indicatorClassName={"bg-gray-400"}
                />

                <div className="mt-4 text-sm text-gray-500">
                  <p>
                    {subject.chaptersCompleted} out of {subject.totalChapters}{" "}
                    chapters completed
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div> */}
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
        <div className="text-center py-20 text-lg font-medium text-gray-500">
          You are not enrolled in any courses yet.
        </div>
      )}

      {!isLoading && !isError && EnrolledCourses.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4 md:py-8 p-4">
          {EnrolledCourses.map((courseInfo, index) => (
            <div key={index}>
              <EnrolledCourseCard courseInfo={courseInfo} />
            </div>
          ))}
        </div>
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
