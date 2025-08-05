"use client";
import React from "react";
import ClassContentUploader from "./ClassContentUploader";
import ContentList from "./ContentList";

function ClassContentPanel() {
  return (
    <div className="w-full">
      <ClassContentUploader />
      <ContentList />
    </div>
  );
}

export default ClassContentPanel;
