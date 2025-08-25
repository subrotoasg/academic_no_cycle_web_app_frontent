"use client";
import React, { useState } from "react";
import ClassContentUploader from "./ClassContentUploader";
import ContentList from "./ContentList";
import { Button } from "@/components/ui/button";
import LiveClassSchedule from "./LiveClassSchedule";

function ClassContentPanel() {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-center gap-3">
        <Button
          variant={activeTab === "content" ? "default" : "outline"}
          onClick={() => setActiveTab("content")}
        >
          Upload Class Content
        </Button>
        <Button
          variant={activeTab === "live" ? "default" : "outline"}
          onClick={() => setActiveTab("live")}
        >
          Schedule Live Class
        </Button>
      </div>

      {activeTab === "content" ? (
        <ClassContentUploader />
      ) : (
        <LiveClassSchedule />
      )}
      <ContentList />
    </div>
  );
}

export default ClassContentPanel;
