import React from "react";
import { formatTime } from "@/utlis/dateFormater";
import { Lock, Play } from "lucide-react";

const VideoCard = ({ video, setSelectedClass, setIsPlaying }) => {
  const isLive = video?.status === "live";
  const handleVideoEnroll = (url) => {
    return window.open(url, "_blank");
  };
  const handleVideoCardClicked = (video) => {
    setSelectedClass(() => video);
  };
  const getThumbnail = (cls) => {
    if (cls?.status === "live") return "/live_class.jpg";

    if (cls?.thumbnail && cls.thumbnail.trim() !== "") return cls.thumbnail;

    if (cls?.thumbnailPath && cls.thumbnailPath.trim() !== "")
      return cls.thumbnailPath;

    return "/scheduled.jpg";
  };

  return (
    <div
      onClick={() => handleVideoCardClicked(video)}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 h-full flex flex-col cursor-pointer"
    >
      <div className="relative flex-grow">
        <div
          className="w-full h-48 bg-gray-800 flex items-center justify-center"
          style={{
            // backgroundImage: `url(${
            //   video?.thumbnailPath
            //     ? video?.thumbnailPath
            //     : video?.status === "live"
            //     ? "/live_class.jpg"
            //     : "/scheduled.jpg"
            // })`,
            backgroundImage: `url(${getThumbnail(video)})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {video?.hasAccess ? (
              <button className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg cursor-pointer">
                <Play className="w-6 h-6" />
              </button>
            ) : (
              <div
                onClick={() => handleVideoEnroll(video?.Permalink)}
                className="bg-black/60 text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer whitespace-nowrap text-ellipsis"
              >
                <Lock className="w-5 h-5" />
                <span className="text-sm font-semibold">এনরোল করো</span>
              </div>
            )}
          </div>
        </div>
        {isLive ? (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            Live
          </div>
        ) : (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {video?.status}
          </div>
        )}
      </div>
      <div className="p-5 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
        {/* Video Info */}
        <div>
          <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
            {video?.title || "Untitled Video"}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {video?.description || "No description available"}
          </p>

          <div className="flex items-center">
            {/* <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 mr-3">
              <span className="font-medium text-sm">
                {video?.instructor?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div> */}
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                শিক্ষকঃ {video?.instructor || "Anonymous Instructor"}
              </p>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <svg
                  className="w-3 h-3 mr-1 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {formatTime(video?.startTime) || "Time not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
