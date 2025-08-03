import React, { useState } from "react";
import { motion } from "framer-motion";

const getDriveViewURL = (id) => `https://drive.google.com/file/d/${id}/preview`;
const getDriveDownloadURL = (id) => `https://drive.google.com/uc?export=download&id=${id}`;

const RESOURCES_CONFIG = [
  { key: "lectureSheet", label: "Lecture Sheet" },
  { key: "practiceSheet", label: "Practice Sheet" },
  { key: "solutionSheet", label: "Solution Sheet" },
];

const ResourceDownloads = ({ classContent, onView }) => {
  const availableResources = RESOURCES_CONFIG.filter(res => classContent[res.key]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (availableResources.length === 0) {
    return (
      <motion.div
        className="p-8 bg-white dark:bg-gray-800 rounded-b-lg text-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        No resources are available for this lesson.
      </motion.div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-b-lg">
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {availableResources.map(res => (
          <motion.div
            key={res.key}
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100 mb-3 sm:mb-0">
              {res.label}
            </h3>

            <div className="flex items-center shrink-0 space-x-3">
              <button
                onClick={() => onView(getDriveViewURL(classContent[res.key]))}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View
              </button>

              <a
                href={getDriveDownloadURL(classContent[res.key])}
                download
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-800 bg-gray-200 border border-transparent rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Download
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ResourceDownloads;
