"use client";

import { useGetClassContentsBySubjectChapterIdQuery } from "@/redux/services/contentsApi";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";
import { Eye, Maximize, Minimize } from "lucide-react";

const YouTubeOverlayPlayer = ({ videoId }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const ytPlayer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState("0:00 / 0:00");
  const [progress, setProgress] = useState(0);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);

  const changeVolume = (e) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);

    if (!ytPlayer.current) return;

    ytPlayer.current.setVolume(newVolume);

    if (newVolume === 0) {
      ytPlayer.current?.mute?.();
    } else if (ytPlayer.current?.isMuted?.()) {
      ytPlayer.current.unMute();
    }
  };
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  useEffect(() => {
    if (!videoId) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = initPlayer;
      document.body.appendChild(tag);
    } else {
      initPlayer();
    }

    function initPlayer() {
      ytPlayer.current = new window.YT.Player(playerRef.current, {
        videoId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          fs: 0,
          showinfo: 0,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      });
    }

    function onPlayerReady() {
      const interval = setInterval(() => {
        if (!ytPlayer.current?.getCurrentTime) return;
        const current = ytPlayer.current.getCurrentTime();
        const total = ytPlayer.current.getDuration();
        setTimeDisplay(`${formatTime(current)} / ${formatTime(total)}`);
        setProgress((current / total) * 100);
      }, 500);
      return () => clearInterval(interval);
    }

    function onPlayerStateChange(e) {
      setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
    }

    return () => {
      if (ytPlayer.current?.destroy) ytPlayer.current.destroy();
    };
  }, [videoId]);

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00:00";
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = Math.floor(sec % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
  };

  const togglePlay = useCallback(() => {
    if (!ytPlayer.current) return;
    if (isPlaying) ytPlayer.current.pauseVideo();
    else ytPlayer.current.playVideo();
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  const skip = (seconds) => {
    if (!ytPlayer.current) return;
    const newTime = ytPlayer.current.getCurrentTime() + seconds;
    ytPlayer.current.seekTo(newTime, true);
  };

  const toggleMute = () => {
    if (!ytPlayer.current?.isMuted) return;
    if (ytPlayer.current.isMuted()) ytPlayer.current.unMute();
    else ytPlayer.current.mute();
  };

  const changeSpeed = (rate) => {
    if (!ytPlayer.current) return;
    ytPlayer.current.setPlaybackRate(parseFloat(rate));
  };

  const seekToPercent = (e) => {
    if (!ytPlayer.current) return;
    const rect = e.target.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    ytPlayer.current.seekTo(ytPlayer.current.getDuration() * percent, true);
  };

  // FullScreen controller
  const goFullscreen = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
      container.mozRequestFullScreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
  };

  return (
    <div
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden"
      ref={containerRef}
    >
      <div
        ref={playerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-center items-center flex-1">
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="bg-black/50 text-white p-4 rounded-full pointer-events-auto"
            >
              ▶
            </button>
          )}
        </div>

        <div className="bg-black/50 px-4 py-2 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="text-lg">
              {isPlaying ? "⏸" : "▶"}
            </button>
            <div className="relative group flex items-center">
              <button onClick={toggleMute} className="z-10">
                {ytPlayer.current?.isMuted?.() ? "🔇" : "🔊"}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={changeVolume}
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-8 h-8 w-24 opacity-0 group-hover:opacity-100 transition-opacity rotate-[-90deg] z-20"
              />
            </div>

            <span className="text-xs">{timeDisplay}</span>
          </div>

          <div
            className="flex-1 mx-4 h-2 bg-gray-500 rounded cursor-pointer"
            onClick={seekToPercent}
          >
            <div
              className="h-2 bg-red-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => skip(-5)}>⏪ </button>
            <button onClick={() => skip(5)}>⏩</button>
            <select
              onChange={(e) => changeSpeed(e.target.value)}
              className="text-xs"
            >
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => (
                <option key={v} value={v}>
                  {v}x
                </option>
              ))}
            </select>
            {/* <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Speed</span>
              <select
                onChange={(e) => changeSpeed(e.target.value)}
                className="text-xs border rounded px-1 py-0.5"
              >
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => (
                  <option key={v} value={v}>
                    {v}x
                  </option>
                ))}
              </select>
            </div> */}

            {!isFullscreen ? (
              <button onClick={goFullscreen}>
                {" "}
                <Maximize className="w-5 h-5" />
              </button>
            ) : (
              <button onClick={exitFullscreen}>
                <Minimize className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

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

const VideoHolderModified = ({ classContent }) => {
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
                <YouTubeOverlayPlayer videoId={classContent.videoUrl} />
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

              {classContent?.description && (
                <p className="mt-4 text-xs md:text-xl text-gray-600 dark:text-gray-300">
                  {classContent.description}
                </p>
              )}

              {classContent?.instructor && (
                <p className="mt-2 text-sm md:text-lg font-medium text-gray-700 dark:text-gray-400">
                  Instructor: {classContent.instructor}
                </p>
              )}

              <div className="mt-1 flex items-center space-x-1 text-xs md:text-sm font-normal text-blue-600 dark:text-blue-500">
                <Eye className="w-4 h-4 md:w-5 md:h-5 mr-1 text-blue-500" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={classContent.views}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Views: {classContent.views}
                  </motion.span>
                </AnimatePresence>
              </div>
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

export default VideoHolderModified;
