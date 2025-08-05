"use client";

import { selectCourse } from "@/redux/Features/courseInfo";
import { useGetNoticeRoutinesByCourseIdQuery } from "@/redux/services/noticeRoutineApi";
import React from "react";
import { useSelector } from "react-redux";

function Routines() {
  const course = useSelector(selectCourse);
  const courseId = course?.id;
  const { data, isLoading } = useGetNoticeRoutinesByCourseIdQuery({ courseId });
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];

  const routine = data?.data?.data?.filter((notice) => {
    const startDate = new Date(notice.startTime).toISOString().split("T")[0];
    const endDate = new Date(notice.endTime).toISOString().split("T")[0];

    return (
      startDate <= todayDate &&
      endDate >= todayDate &&
      notice.type === "Routine"
    );
  });

  const lastRoutine = routine?.[routine.length - 1];
  // console.log(lastRoutine)
  return (
    <div className="pt-16 md:pt-20 px-4 md:my-12">
      <div className="text-center my-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 my-4">
          Routine Schedule
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mt-2">
          Stay organized with the latest class routines. Check the schedule to
          keep track of your subjects and session timings.
        </p>
      </div>

      <h3 className="md:text-xl text-center font-semibold my-8 text-indigo-500">
        {lastRoutine?.title}
      </h3>

      <div className="w-full h-[75vh] md:h-screen">
        {isLoading ? (
          <p className="text-center">Loading...</p>
        ) : lastRoutine?.url ? (
          <iframe
            src={lastRoutine.url}
            className="w-full h-full border rounded-3xl mx-auto"
            allowFullScreen
            title="Routine Sheet"
          ></iframe>
        ) : (
          <p className="text-base md:text-xl text-gray-600 text-center">
            No routine published yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Routines;
