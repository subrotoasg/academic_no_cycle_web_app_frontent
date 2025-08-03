import React from "react";
import CycleSubjectForm from "./CycleSubjectForm";

function CycleSubjectUploader() {
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        {" "}
        Add Subject to Cycle
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Create cycle-subject links to organize academic content more
        efficiently.
      </p>

      <div className="pt-6">
        <CycleSubjectForm />
      </div>
    </div>
  );
}

export default CycleSubjectUploader;
