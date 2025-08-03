"use client";

import React from "react";
import CycleSubjectsLists from "./CycleSubjectList";
import CycleSubjectUploader from "./CycleSubjectUploader";

function CycleSubjects() {
  return (
    <div className="w-full p-4">
      <CycleSubjectUploader />
      <CycleSubjectsLists />
    </div>
  );
}

export default CycleSubjects;
