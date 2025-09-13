import React from "react";

const LoadingData = () => {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      <span className="ml-4 text-blue-500 font-semibold text-lg">
        Loading courses...
      </span>
    </div>
  );
};

export default LoadingData;
