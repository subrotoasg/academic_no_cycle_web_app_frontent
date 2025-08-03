import React from "react";

function Loading() {
  return (
    <div className="flex justify-center items-center py-10">
      <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-blue-500 me-3">
        {" "}
      </div>
      Loading...
    </div>
  );
}

export default Loading;
