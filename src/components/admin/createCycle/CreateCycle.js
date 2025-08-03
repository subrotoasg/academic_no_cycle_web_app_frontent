"use client";

import React from "react";
import CycleUploader from "./CycleUploader";
import CycleList from "./CycleList";

function CreateCycle() {
  return (
    <div className="w-full p-4">
      <CycleUploader />

      <CycleList />
    </div>
  );
}

export default CreateCycle;
