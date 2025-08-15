// "use client";

// import { useGetClassContentsBySubjectChapterIdQuery } from "@/redux/services/contentsApi";
// import React, { useEffect, useRef, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSelector } from "react-redux";
// import { currentUser } from "@/redux/Features/authentication";

// const YouTubeOverlayPlayer = ({ videoId }) => {
//   const playerRef = useRef(null);
//   const ytPlayer = useRef(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [timeDisplay, setTimeDisplay] = useState("0:00 / 0:00");
//   const [progress, setProgress] = useState(0);

//   // Load YouTube API
//   useEffect(() => {
//     if (!videoId) return;

//     if (!window.YT) {
//       const tag = document.createElement("script");
//       tag.src = "https://www.youtube.com/iframe_api";
//       window.onYouTubeIframeAPIReady = initPlayer;
//       document.body.appendChild(tag);
//     } else {
//       initPlayer();
//     }

//     function initPlayer() {
//       ytPlayer.current = new window.YT.Player(playerRef.current, {
//         videoId,
//         playerVars: {
//           autoplay: 0,
//           controls: 0,
//           rel: 0,
//           modestbranding: 1,
//           iv_load_policy: 3,
//           disablekb: 1,
//           fs: 0,
//           showinfo: 0,
//         },
//         events: {
//           onReady: onPlayerReady,
//           onStateChange: onPlayerStateChange,
//         },
//       });
//     }

//     function onPlayerReady() {
//       const interval = setInterval(() => {
//         if (!ytPlayer.current || ytPlayer.current.getCurrentTime == null)
//           return;
//         const current = ytPlayer.current.getCurrentTime();
//         const total = ytPlayer.current.getDuration();
//         setTimeDisplay(`${formatTime(current)} / ${formatTime(total)}`);
//         setProgress((current / total) * 100);
//       }, 500);
//       return () => clearInterval(interval);
//     }

//     function onPlayerStateChange(e) {
//       setIsPlaying(e.data === window.YT.PlayerState.PLAYING);
//     }

//     return () => {
//       if (ytPlayer.current?.destroy) ytPlayer.current.destroy();
//     };
//   }, [videoId]);

//   const formatTime = (sec) => {
//     if (!sec || isNaN(sec)) return "0:00";
//     const minutes = Math.floor(sec / 60);
//     const seconds = Math.floor(sec % 60);
//     return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
//   };

//   const togglePlay = () => {
//     if (!ytPlayer.current) return;
//     if (isPlaying) ytPlayer.current.pauseVideo();
//     else ytPlayer.current.playVideo();
//   };

//   const skip = (seconds) => {
//     if (!ytPlayer.current) return;
//     const newTime = ytPlayer.current.getCurrentTime() + seconds;
//     ytPlayer.current.seekTo(newTime, true);
//   };

//   const toggleMute = () => {
//     if (!ytPlayer.current) return;
//     if (ytPlayer.current.isMuted()) ytPlayer.current.unMute();
//     else ytPlayer.current.mute();
//   };

//   const changeSpeed = (rate) => {
//     if (!ytPlayer.current) return;
//     ytPlayer.current.setPlaybackRate(parseFloat(rate));
//   };

//   const seekToPercent = (e) => {
//     if (!ytPlayer.current) return;
//     const rect = e.target.getBoundingClientRect();
//     const percent = (e.clientX - rect.left) / rect.width;
//     ytPlayer.current.seekTo(ytPlayer.current.getDuration() * percent, true);
//   };

//   const goFullscreen = () => {
//     if (playerRef.current && playerRef.current.requestFullscreen) {
//       playerRef.current.requestFullscreen();
//     }
//   };

//   return (
//     <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
//       {/* YouTube Player */}
//       <div ref={playerRef} className="absolute inset-0" />

//       {/* Overlay Controls */}
//       <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
//         {/* Center Play Button */}
//         <div className="flex justify-center items-center flex-1">
//           <button
//             onClick={togglePlay}
//             className="bg-black/50 text-white p-4 rounded-full pointer-events-auto"
//           >
//             {isPlaying ? "⏸" : "▶"}
//           </button>
//         </div>

//         {/* Bottom Controls */}
//         <div className="bg-black/50 px-4 py-2 flex items-center justify-between pointer-events-auto">
//           <div className="flex items-center gap-2">
//             <button onClick={() => skip(-5)}>⏪ 5s</button>
//             <button onClick={toggleMute}>🔊</button>
//             <span>{timeDisplay}</span>
//           </div>

//           <div
//             className="flex-1 mx-4 h-2 bg-gray-500 rounded cursor-pointer"
//             onClick={seekToPercent}
//           >
//             <div
//               className="h-2 bg-red-500 rounded"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>

//           <div className="flex items-center gap-2">
//             <select onChange={(e) => changeSpeed(e.target.value)}>
//               {[0.5, 0.75, 1, 1.25, 1.5, 2].map((v) => (
//                 <option key={v} value={v}>
//                   {v}x
//                 </option>
//               ))}
//             </select>
//             <button onClick={() => skip(5)}>5s ⏩</button>
//             <button onClick={goFullscreen}>⛶</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const VideoPlayer = ({ classContent }) => {
//   const user = useSelector(currentUser);
//   const isAdmin = user?.role === "admin";
//   const [activeTab, setActiveTab] = useState(null);

//   const { data: chapterContentsData, isLoading } =
//     useGetClassContentsBySubjectChapterIdQuery(
//       classContent?.courseSubjectChapter?.id
//     );

//   const courseId =
//     chapterContentsData?.data[0]?.courseSubjectChapter?.courseSubject?.course
//       ?.id;

//   const chapterContents = chapterContentsData?.data;

//   const toggleTab = (key) =>
//     setActiveTab((prev) => (prev === key ? null : key));

//   return (
//     <div className="bg-gray-50 dark:bg-gray-900 rounded-xl">
//       <div className="grid grid-cols-12 gap-4">
//         <div className="col-span-9">
//           <motion.div>
//             <YouTubeOverlayPlayer videoId={classContent.videoUrl} />
//           </motion.div>
//           <h1 className="mt-4 text-2xl font-bold">
//             {classContent?.classTitle}
//           </h1>
//           <p className="text-gray-500">{classContent?.description}</p>
//         </div>
//         <div className="col-span-3">
//           <h2 className="text-lg font-semibold mb-2">Related Lessons</h2>
//           {isLoading
//             ? "Loading..."
//             : chapterContents?.map((content) => (
//                 <a
//                   key={content.id}
//                   href={
//                     isAdmin
//                       ? `/admin/content/${content.id}`
//                       : `/course/${courseId}/content/${content.id}`
//                   }
//                   className="block p-2 bg-white dark:bg-gray-800 rounded mb-2"
//                 >
//                   {content.classTitle}
//                 </a>
//               ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VideoPlayer;
