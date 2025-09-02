"use client";
import React, { useState } from "react";
import ClassContentUploader from "./ClassContentUploader";
import ContentList from "./ContentList";
import { Button } from "@/components/ui/button";
import LiveClassSchedule from "./LiveClassSchedule";
import LiveClassList from "./LiveClassList";

function ClassContentPanel() {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-center gap-3">
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
        <>
          <ClassContentUploader />
          <ContentList />
        </>
      ) : (
        <>
          <LiveClassSchedule />
          <LiveClassList />
        </>
      )}
    </div>
  );
}

export default ClassContentPanel;
