import React from "react";
import ClassContentForm from "./ClassContentForm";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";

function ClassContentUploader({}) {
  const course = useSelector(selectCourse);
  const courseTitle = course?.title;
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        {" "}
        Add Class Content to {courseTitle}
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Upload your recorded session to make it available for students
      </p>

      <div className="pt-6">
        <ClassContentForm />
      </div>
    </div>
  );
}

export default ClassContentUploader;
