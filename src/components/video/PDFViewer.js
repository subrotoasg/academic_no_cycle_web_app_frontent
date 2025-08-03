// /components/video/PDFViewer.js
import React, { useState } from "react";

const getDrivePreviewURL = (id) => `https://drive.google.com/file/d/${id}/preview`;

const PDFViewer = ({ id, title }) => {
  const [isPdfVisible, setIsPdfVisible] = useState(false);

  if (!id) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        No lecture sheet available for this class.
      </div>
    );
  }

  if (!isPdfVisible) {
    return (
      <div className="text-center mt-8 mb-4">
        <button
          onClick={() => setIsPdfVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition-transform transform hover:scale-105"
        >
          View Lecture Sheet
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 mx-auto">
      <div className="w-full max-w-5xl mx-auto">
        <iframe
          className="w-full h-[85vh] border border-gray-300 dark:border-gray-700 rounded-lg"
          src={getDrivePreviewURL(id)}
          title={title}
          allow="fullscreen"
        ></iframe>
      </div>
    </div>
  );
};

export default PDFViewer;