"use client";

import { useGetClassContentsBySubjectChapterIdQuery } from "@/redux/services/contentsApi";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const PDFViewer = ({ id, title }) => {
  if (!id) return null;

  const getDrivePreviewURL = (id) =>
    `https://drive.google.com/file/d/${id}/preview`;
  const getDriveViewURL = (id) => `https://drive.google.com/file/d/${id}/view`;

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

// TabButton remains the same
const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 font-semibold text-base relative transition-colors ${
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

const YouTubePlayer = ({ videoId }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoId) return;

    const player = new Plyr(playerRef.current, {
      // controls: ["play", "progress", "mute", "volume", "fullscreen"],
      controls: [
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "settings", // enable settings menu
        "fullscreen",
      ],
      settings: ["quality", "speed"],
      speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
      quality: {
        default: 720,
        options: [4320, 2160, 1440, 1080, 720, 480, 360],
      },
      youtube: {
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3,
        showinfo: 0,
        controls: 0,
        fs: 0,
        disablekb: 1,
        playsinline: 1,
      },
    });

    return () => player.destroy();
  }, [videoId]);

  return (
    <div style={{ position: "relative", borderRadius: "12px" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100px",
          width: "100%",
          zIndex: 3,
          // pointerEvents: "none",
        }}
      />
      <div
        ref={playerRef}
        data-plyr-provider="youtube"
        data-plyr-embed-id={videoId}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "12px",
        }}
      />
    </div>
  );
};

// const YouTubePlayer = ({ videoId }) => {
//   const playerRef = useRef(null);
//   const containerRef = useRef(null);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     if (!videoId || !containerRef.current) return;

//     const player = new Plyr(containerRef.current, {
//       controls: [
//         "play-large",
//         "play",
//         "progress",
//         "current-time",
//         "duration",
//         "mute",
//         "volume",
//         "captions",
//         "settings",
//         "pip",
//         "airplay",
//         "fullscreen",
//       ],
//       youtube: {
//         noCookie: true,
//         rel: 0, // Don't show related videos
//         showinfo: 0, // Hide video title and uploader
//         iv_load_policy: 3, // Hide annotations
//         modestbranding: 1, // Reduce YouTube logo
//         disablekb: 1, // Disable keyboard controls
//         fs: 0, // Hide fullscreen button (we'll use Plyr's)
//         controls: 0, // Hide YouTube's native controls
//       },
//       keyboard: { focused: true, global: true },
//     });

//     player.on("ready", () => {
//       setIsReady(true);
//       playerRef.current = player;

//       // Additional safety to hide YouTube elements
//       const iframe = containerRef.current.querySelector("iframe");
//       if (iframe) {
//         iframe.style.width = "100%";
//         iframe.style.height = "100%";
//         iframe.style.position = "absolute";
//         iframe.style.top = "0";
//         iframe.style.left = "0";
//       }
//     });

//     return () => {
//       if (playerRef.current) {
//         playerRef.current.destroy();
//       }
//     };
//   }, [videoId]);

//   return (
//     <div className="relative w-full rounded-xl overflow-hidden aspect-video bg-black">
//       {/* Enhanced CSS to hide YouTube elements */}
//       <style jsx>{`
//         .plyr__video-embed iframe {
//           width: 100% !important;
//           height: 100% !important;
//           position: absolute !important;
//           top: 0 !important;
//           left: 0 !important;
//         }

//         .plyr__controls {
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           padding: 10px;
//           background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
//           z-index: 3;
//         }

//         .plyr__progress__container {
//           position: absolute;
//           bottom: 60px;
//           left: 0;
//           right: 0;
//           padding: 0 10px;
//           z-index: 3;
//         }

//         /* Hide YouTube's native elements */
//         .plyr__video-embed::after {
//           content: "";
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           right: 0;
//           height: 60px;
//           background: linear-gradient(
//             to top,
//             rgba(0, 0, 0, 0.7) 0%,
//             transparent 100%
//           );
//           pointer-events: none;
//           z-index: 2;
//         }
//       `}</style>

//       {!isReady && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       )}

//       <div
//         ref={containerRef}
//         className={`plyr__video-embed ${isReady ? "opacity-100" : "opacity-0"}`}
//       >
//         <iframe
//           src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&controls=0`}
//           allowFullScreen
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           className="absolute top-0 left-0 w-full h-full"
//           frameBorder="0"
//         />
//       </div>
//     </div>
//   );
// };

const VideoHolder = ({ classContent }) => {
  const user = useSelector(currentUser);
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState(null);

  const { data: chapterContentsData, isLoading } =
    useGetClassContentsBySubjectChapterIdQuery(
      classContent?.courseSubjectChapter?.id
    );
  const courseId =
    chapterContentsData?.data[0]?.courseSubjectChapter?.courseSubject?.course
      ?.id;
  const chapterContents = chapterContentsData?.data;

  const toggleTab = (key) =>
    setActiveTab((prev) => (prev === key ? null : key));

  return (
    <div className="min-h-auto bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl mx-auto">
      <div className="max-w-8xl mx-auto px-1 sm:px-4 py-4 md:py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-4">
          <div className="lg:col-span-9">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {classContent?.hostingType === "bunny" ? (
                <div
                  style={{
                    position: "relative",
                    paddingTop: "56.25%",
                    borderRadius: "12px",
                  }}
                >
                  <iframe
                    src={`https://iframe.mediadelivery.net/embed/${classContent.libraryId}/${classContent.videoUrl}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`}
                    loading="lazy"
                    style={{
                      border: 0,
                      position: "absolute",
                      top: 0,
                      height: "100%",
                      width: "100%",
                      borderRadius: "12px",
                    }}
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                    allowFullScreen
                  />
                </div>
              ) : (
                <YouTubePlayer videoId={classContent.videoUrl} />
              )}
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

export default VideoHolder;
