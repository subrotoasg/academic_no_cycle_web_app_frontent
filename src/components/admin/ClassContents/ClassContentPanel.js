"use client";

import React from "react";
import ClassContentUploader from "./ClassContentUploader";
import ContentList from "./ContentList";

function ClassContentPanel() {
  return (
    <div className="w-full p-4">
      <ClassContentUploader />

      <ContentList />
    </div>
  );
}

export default ClassContentPanel;
