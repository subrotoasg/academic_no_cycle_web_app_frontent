"use client";

import { useGetClassContentsBySubjectChapterIdQuery } from "@/redux/services/contentsApi";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";
import { Eye, Maximize, Minimize } from "lucide-react";
import Image from "next/image";
import backupImg from "../../../public/img/backup.png";

const YouTubeOverlayPlayer = ({ videoId }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const ytPlayer = useRef(null);
  const progressRef = useRef(null);
  const isDragging = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState("0:00 / 0:00");
  const [progress, setProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [volume, setVolume] = useState(100);

  // const singleTapTimer = useRef(null);

  //  ------------ controls visibility -------------
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef(null);

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);

    if (isPlaying) {
      hideTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(hideTimer.current);
  }, [isPlaying, resetControlsTimer]);

  const handleUserActivity = useCallback(() => {
    resetControlsTimer();
  }, [resetControlsTimer]);

  // Listen for hover/touch on container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleUserActivity);
    container.addEventListener("touchstart", handleUserActivity);

    return () => {
      container.removeEventListener("mousemove", handleUserActivity);
      container.removeEventListener("touchstart", handleUserActivity);
    };
  }, [handleUserActivity]);

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

  const lastTap = useRef(0);

  // const handleSingleTap = () => {
  //   togglePlay(); // play or pause
  // };

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      if (!document.fullscreenElement) {
        goFullscreen();
      } else {
        exitFullscreen();
      }
    }
    lastTap.current = now;
  };

  const handleTap = (e) => {
    handleUserActivity();
    handleDoubleTap(e);
    // // If there's already a pending single tap, it's a double tap
    // if (singleTapTimer.current) {
    //   clearTimeout(singleTapTimer.current);
    //   singleTapTimer.current = null;
    //   handleDoubleTap(); // fullscreen
    // } else {
    //   singleTapTimer.current = setTimeout(() => {
    //     handleSingleTap(); // play/pause
    //     singleTapTimer.current = null;
    //   }, 250); // adjust delay if needed
    // }
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
      switch (e.code) {
        case "Space":
        case "KeyK":
          e.preventDefault();
          togglePlay();
          break;

        case "ArrowRight":
          e.preventDefault();
          skip(10);
          break;

        case "ArrowLeft":
          e.preventDefault();
          skip(-10);
          break;

        case "ArrowUp":
          e.preventDefault();
          setVolume((prev) => {
            const newVolume = Math.min(prev + 5, 100);
            ytPlayer.current?.setVolume(newVolume);
            if (ytPlayer.current?.isMuted?.()) ytPlayer.current.unMute();
            return newVolume;
          });
          break;

        case "ArrowDown":
          e.preventDefault();
          setVolume((prev) => {
            const newVolume = Math.max(prev - 5, 0);
            ytPlayer.current?.setVolume(newVolume);
            if (newVolume === 0) ytPlayer.current?.mute?.();
            return newVolume;
          });
          break;

        default:
          break;
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
    if (!ytPlayer.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    let clientX;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }

    let percent = (clientX - rect.left) / rect.width;
    percent = Math.min(Math.max(percent, 0), 1);

    const seekTime = ytPlayer.current.getDuration() * percent;
    ytPlayer.current.seekTo(seekTime, true);
    setProgress(percent * 100);
  };

  const handleDragStart = (e) => {
    isDragging.current = true;
    seekToPercent(e);
  };

  const handleDragMove = (e) => {
    if (!isDragging.current) return;
    seekToPercent(e);
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };
  // FullScreen
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
      onDoubleClick={handleTap}
      // onClick={handleTap}
      onTouchEnd={handleTap}
    >
      <div
        ref={playerRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={showControls ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex flex-col justify-between pointer-events-none"
      >
        <div className="flex justify-center items-center flex-1">
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="bg-black/60 text-white p-3 rounded-full pointer-events-auto text-lg"
            >
              ▶
            </button>
          )}
        </div>

        <div className="bg-black/80 px-4 py-2 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="text-lg md:text-xl text-white pr-2"
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            {/* <div className="relative group flex items-center">
              <div className="hidden md:flex items-center">
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

              <div className="flex items-center  md:hidden">
                <button onClick={toggleMute}>
                  {ytPlayer.current?.isMuted?.() ? "🔇" : "🔊"}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={changeVolume}
                  className="h-2 w-8"
                />
              </div>
            </div> */}
            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-lg md:text-xl">
                {ytPlayer.current?.isMuted?.() ? "🔇" : "🔊"}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={changeVolume}
                className="h-2 w-8 md:w-24 accent-blue-500"
              />
            </div>

            <span className="text-xs text-white">{timeDisplay}</span>
          </div>
          {/* Changes to progressRef */}
          <div
            ref={progressRef}
            className="flex-1 mx-2 h-2 bg-gray-500 rounded cursor-pointer"
            onClick={seekToPercent}
            // onTouchStart={seekToPercent}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <div
              className="h-2 bg-red-500 rounded"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => skip(-5)} className="text-base md:text-lg">
              ⏪{" "}
            </button>
            <button onClick={() => skip(5)} className="text-base md:text-lg">
              ⏩
            </button>
            <select
              onChange={(e) => changeSpeed(e.target.value)}
              className="text-xs md:text-sm text-white"
            >
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => (
                <option key={v} value={v}>
                  {v}x
                </option>
              ))}
            </select>

            {!isFullscreen ? (
              <button onClick={goFullscreen}>
                {" "}
                <Maximize className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            ) : (
              <button onClick={exitFullscreen}>
                <Minimize className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
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
      className="w-full flex justify-center items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <iframe
        className="w-full  min-h-[60vh] md:min-h-[90vh] border-2 border-gray-300 dark:border-gray-700 rounded-lg shadow-xl"
        src={getDrivePreviewURL(id)}
        title={title}
      />
    </motion.div>
  );
};

const TabButton = ({ title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-1 md:py-2 px-2 md:px-4 font-semibold text-xs md:text-base transition-colors rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
      isActive
        ? "bg-indigo-500 text-white dark:bg-indigo-600"
        : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-500 dark:text-gray-200 dark:hover:bg-blue-700"
    }`}
  >
    {title}
  </button>
);

const VideoHolderModified = ({ classContent }) => {
  const user = useSelector(currentUser);
  const isAdmin = user?.role === "admin";
  const [activeTab, setActiveTab] = useState(null);
  const pdfRef = useRef(null);

  const { data: chapterContentsData, isLoading } =
    useGetClassContentsBySubjectChapterIdQuery(
      classContent?.courseSubjectChapter?.id
    );

  const courseId =
    chapterContentsData?.data[0]?.courseSubjectChapter?.courseSubject?.course
      ?.id;

  const chapterContents = chapterContentsData?.data;
  // console.log(chapterContents);
  const toggleTab = (key) => {
    setActiveTab((prev) => {
      const isOpening = prev !== key;
      const newActive = isOpening ? key : null;

      if (isOpening) {
        setTimeout(() => {
          if (pdfRef.current) {
            pdfRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }

      return newActive;
    });
  };

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
                    src={`https://iframe.mediadelivery.net/embed/${classContent?.libraryId}/${classContent?.videoUrl}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`}
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
                <YouTubeOverlayPlayer videoId={classContent?.videoUrl} />
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
                  {classContent?.description}
                </p>
              )}

              {classContent?.instructor && (
                <p className="mt-2 text-sm md:text-lg font-medium text-gray-700 dark:text-gray-400">
                  Instructor: {classContent?.instructor}
                </p>
              )}

              <div className="mt-1 flex items-center space-x-1 text-xs md:text-sm font-normal text-blue-600 dark:text-blue-500">
                <Eye className="w-4 h-4 md:w-5 md:h-5 mr-1 text-blue-500" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={classContent?.views}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    Views: {classContent?.views}
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
                          ? `/admin/content/${content?.id}?title=${content?.classTitle}`
                          : `/course/${courseId}/content/${content?.id}?title=${content?.classTitle}`
                      }
                      className="flex items-center p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 shadow-md"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      {" "}
                      {/* Thumbnail */}
                      <div className="flex-shrink-0 w-16 h-12 md:w-24 md:h-16 rounded-md overflow-hidden mr-3">
                        <Image
                          src={content?.thumbneil || backupImg}
                          alt={content?.classTitle}
                          className="w-full h-full object-fill"
                          width={50}
                          height={30}
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-sm">
                        <p className="font-semibold text-gray-800 dark:text-white truncate">
                          {content?.classTitle}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Lesson {content?.classNo} •{" "}
                          {content?.instructor || "Unknown"}
                        </p>
                      </div>
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

        <div className="mt-10 w-full  px-2 sm:px-4">
          <div className="flex border-gray-200 dark:border-gray-700 mb-2 gap-2">
            {classContent?.lectureSheet && (
              <TabButton
                title="Lecture Sheet "
                isActive={activeTab === "lectureSheet"}
                onClick={() => toggleTab("lectureSheet")}
              />
            )}
            {classContent?.practiceSheet && (
              <TabButton
                title="Practice Sheet "
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
          <div className="mt-2">
            <AnimatePresence>
              {activeTab && (
                <div ref={pdfRef} className="w-full">
                  <PDFViewer id={classContent[activeTab]} title={activeTab} />
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoHolderModified;
