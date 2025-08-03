import React from "react";
import CycleForm from "./CycleForm";

function CycleUploader() {
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        Create Cycle
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Set up academic cycles to group and manage related courses seamlessly.
      </p>

      <div className="pt-6">
        <CycleForm />
      </div>
    </div>
  );
}

export default CycleUploader;
