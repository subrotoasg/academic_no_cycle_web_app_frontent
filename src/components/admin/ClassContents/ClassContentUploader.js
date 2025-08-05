import React from "react";
import ClassContentForm from "./ClassContentForm";

function ClassContentUploader() {
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3">
      <h1 className="text-xl md:text-3xl font-semibold text-center">
        Add Class Content to Course
      </h1>
      <p className="text-xs md:text-sm  text-muted-foreground text-center mt-2">
        Upload your recorded session to make it available for students
      </p>

      <div className="pt-6">
        <ClassContentForm />
      </div>
    </div>
  );
}

export default ClassContentUploader;
