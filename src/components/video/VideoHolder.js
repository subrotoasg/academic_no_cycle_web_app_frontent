"use client";

import { useGetClassContentsBySubjectChapterIdQuery } from "@/redux/services/contentsApi";
import React, { useState } from "react";
import ReactPlayer from "react-player/youtube";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";

const getDrivePreviewURL = (id) =>
  `https://drive.google.com/file/d/${id}/preview`;
const getDriveViewURL = (id) => `https://drive.google.com/file/d/${id}/view`;

const PDFViewer = ({ id, title }) => {
  if (!id) return null;
  return (
    <motion.div
      className="w-full mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <iframe
        className="w-full min-h-[80vh] border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-xl"
        src={getDrivePreviewURL(id)}
        title={title}
      />
      <div className="text-center mt-4">
        <motion.button
          onClick={() => window.open(getDriveViewURL(id), "_blank")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-semibold transition shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Open in New Tab
        </motion.button>
      </div>
    </motion.div>
  );
};

const VideoHolder = ({ classContent }) => {
  const user = useSelector(currentUser);
  // console.log(classContent);
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (key) => {
    setActiveTab((prev) => (prev === key ? null : key));
  };

  const { data: chapterContentsData, isLoading } =
    useGetClassContentsBySubjectChapterIdQuery(
      classContent?.courseSubjectChapter?.id
    );
  const courseId =
    chapterContentsData?.data[0]?.courseSubjectChapter?.courseSubject?.course
      ?.id;
  const chapterContents = chapterContentsData?.data;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl">
      <div className="max-w-8xl mx-auto  px-1 sm:px-4 lg:px-8 py-4 md:py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative pb-[56.25%] h-0 bg-black rounded-2xl overflow-hidden shadow-2xl">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${classContent?.videoUrl}`}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                  controls
                  playing
                />
              </div>
            </motion.div>

            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <h1 className="text-xl md:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                {classContent?.classTitle}
              </h1>
              <p className="mt-4 text-xs md:text-xl text-gray-600 dark:text-gray-300">
                {classContent?.description}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-3 mt-5 lg:mt-0">
            <div className="sticky top-8 p-1 md:p-2">
              <h2 className="md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Related Lessons
              </h2>
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-gray-500 dark:text-gray-400">
                    Loading lessons...
                  </p>
                ) : chapterContents?.length > 0 ? (
                  chapterContents.map((content, index) => (
                    <motion.a
                      key={content.id}
                      href={
                        isAdmin
                          ? `/admin/content/${content.id}?title=${content.classTitle}`
                          : `/course/${courseId}/content/${content.id}?title=${content.classTitle}`
                      }
                      className="block p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-md"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <p className="font-semibold text-gray-800 dark:text-white">
                        {content.classTitle}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Lesson {content.classNo}
                      </p>
                    </motion.a>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No related lessons found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 container">
          <div className="flex border-b-1 border-gray-200 dark:border-gray-700 pb-2">
            {classContent?.lectureSheet && (
              <TabButton
                title="Lecture "
                isActive={activeTab === "lectureSheet"}
                onClick={() => toggleTab("lectureSheet")}
              />
            )}
            {classContent?.practiceSheet && (
              <TabButton
                title="Practice "
                isActive={activeTab === "practiceSheet"}
                onClick={() => toggleTab("practiceSheet")}
              />
            )}
            {classContent?.solutionSheet && (
              <TabButton
                title="Solution "
                isActive={activeTab === "solutionSheet"}
                onClick={() => toggleTab("solutionSheet")}
              />
            )}
          </div>
          <AnimatePresence>
            {activeTab && (
              <PDFViewer id={classContent[activeTab]} title={activeTab} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 font-semibold text-lg relative transition-colors ${
      isActive
        ? "text-indigo-500 dark:text-indigo-400"
        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    }`}
  >
    {title}
    {isActive && (
      <motion.div
        className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-indigo-500 dark:bg-indigo-400"
        layoutId="underline"
      />
    )}
  </button>
);

export default VideoHolder;
