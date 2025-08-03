"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlayer from "./VideoPlayer";
import RelatedLessons from "./RelatedLessons";
import ResourceDownloads from "./ResourceDownloads";
import PDFViewer from "./PDFViewer";

const ClassDescription = ({ description }) => (
  <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
    <p className="text-gray-700 dark:text-gray-300 text-base leading-relaxed">
      {description || "No description available."}
    </p>
  </div>
);

const VideoHolder = ({ classContent, classTitle }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [iframeUrl, setIframeUrl] = useState(null);

  if (!classContent) {
    return <div className="text-center p-8">Loading class content...</div>;
  }

  const TABS = [
    { key: "description", label: "Description" },
    { key: "resources", label: "Sheets" },
    { key: "lessons", label: "Related Lessons" },
  ];

  if (classContent.lectureSheet?.fileId) {
    TABS.splice(1, 0, { key: "sheet", label: "Lecture Sheet" });
  }

  const tabContentVariants = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <motion.div
      className="w-full md:max-w-4xl lg:max-w-6xl mx-auto md:px-4 py-8 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {classTitle}
      </h1>

      <div className="mb-4">
        <VideoPlayer videoUrl={classContent.videoUrl} />
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setIframeUrl(null); 
                setActiveTab(tab.key);
              }}
              className={`${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + iframeUrl}
            variants={tabContentVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {iframeUrl ? (
              <div className="w-full aspect-video">
                <iframe
                  src={iframeUrl}
                  title="Resource Preview"
                  className="w-full h-[70vh] rounded-lg border"
                  allow="autoplay"
                ></iframe>
              </div>
            ) : activeTab === "description" ? (
              <ClassDescription description={classContent.description} />
            ) : activeTab === "sheet" ? (
              <PDFViewer
                id={classContent.lectureSheet?.fileId}
                title={classContent.lectureSheet?.title || `${classTitle} Lecture Sheet`}
              />
            ) : activeTab === "resources" ? (
              <ResourceDownloads classContent={classContent} onView={setIframeUrl} />
            ) : activeTab === "lessons" ? (
              <RelatedLessons chapterId={classContent.cycleSubjectChapter?.id} />
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default VideoHolder;
