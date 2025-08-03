import React from "react";
import ReactPlayer from "react-player";
import { motion } from "framer-motion";

/**
 * 
 * @param {{ videoUrl: string }} props
 */
const VideoPlayer = ({ videoUrl }) => {
 
  const fullVideoUrl = `https://www.youtube.com/watch?v=${videoUrl}`;

  const playerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg bg-black"
      variants={playerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {videoUrl ? (
        <ReactPlayer
          url={fullVideoUrl}
          width="100%"
          height="100%"
          className="absolute top-0 left-0"
          controls
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Video not available.
        </div>
      )}
    </motion.div>
  );
};
export default VideoPlayer;