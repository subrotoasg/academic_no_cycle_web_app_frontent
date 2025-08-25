import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { bn, id } from "date-fns/locale";
import { useJoinLiveClassQuery } from "@/redux/services/liveClassApi";
import { Lock, Play } from "lucide-react";
import Image from "next/image";
import VideoPlayButtonAnimation from "../videoAnimation/VideoPlayButtonAnimation";

const VideoHeroSection = ({ selectedClass }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: liveClassUrl } = useJoinLiveClassQuery(
    { videoId: selectedClass?.videoId },
    {
      skip: !isPlaying,
    }
  );
  const joinUrl = liveClassUrl?.data?.isLiveUrl;

  if (joinUrl) {
    return window.location.replace(joinUrl);
  }
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return format(date, "hh:mm a", { locale: bn });
  };

  const handleVideoEnroll = (url) => {
    return window.open(url, "_blank");
  };
  return (
    <div className="py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Video Section with Overlay */}
          <div className="w-full">
            <div className="relative bg-black rounded-lg overflow-hidden shadow-xl">
              {!isPlaying ? (
                <>
                  <div
                    style={{
                      backgroundImage: `url(${
                        selectedClass?.thumbnailPath
                          ? selectedClass?.thumbnailPath
                          : selectedClass?.status === "live"
                          ? "/live_class.jpg"
                          : "/scheduled.jpg"
                      })`,
                      // backgroundSize: "cover",
                      // backgroundPosition: "center",
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                    }}
                    className="w-full aspect-video bg-gray-800 flex items-center justify-center relative"
                  >
                    {/* Video Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-100% p-4 md:p-6">
                      <div className="container mx-auto">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                          {selectedClass?.title}
                        </h1>
                        <p className="text-gray-200 mt-1 sm:mt-2 line-clamp-2 text-sm sm:text-base">
                          {selectedClass?.description}
                        </p>
                        <div className="flex items-center mt-2 sm:mt-4 flex-wrap gap-2">
                          <div className="bg-blue-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-sm sm:text-base">
                            {selectedClass?.instructor?.charAt(0)}
                          </div>
                          <div className="ml-2 sm:ml-3">
                            <p className="font-semibold text-white text-sm sm:text-base">
                              {selectedClass?.instructor}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-300">
                              {selectedClass?.courseTitle || "No Course"}
                            </p>
                          </div>
                          {selectedClass?.status === "live" ? (
                            <>
                              <div className="ml-auto bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                                Live Now
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="ml-auto bg-blue-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm">
                                scheduled
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer w-full h-full"
                      aria-label="Play video"
                    >
                      <div className="transform scale-75 sm:scale-90 md:scale-100 cursor-pointer">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {selectedClass?.hasAccess ? (
                            <button
                              onClick={() => setIsPlaying(true)}
                              // className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg cursor-pointer"
                              className="cursor-pointer"
                            >
                              {/* <Play className="w-6 h-6" /> */}
                              <VideoPlayButtonAnimation />
                            </button>
                          ) : (
                            <div
                              onClick={() =>
                                handleVideoEnroll(selectedClass?.Permalink)
                              }
                              className="bg-black/60 text-white px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer whitespace-nowrap text-ellipsis"
                            >
                              <Lock className="w-5 h-5" />
                              <span className="text-sm font-semibold">
                                এনরোল করো
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative w-full aspect-video bg-black">
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-lg md:text-xl font-semibold text-white text-center">
                        Joining class, please wait...
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoHeroSection;
