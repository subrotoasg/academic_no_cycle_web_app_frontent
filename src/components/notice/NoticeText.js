import React from "react";

const NoticeText = ({ text }) => {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
      <p className="text-gray-800 dark:text-white text-center text-xs md:text-base">
        {text}
      </p>
    </div>
  );
};

export default NoticeText;
