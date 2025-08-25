import React from "react";
import LiveClassForm from "./LiveClassForm";
// import LiveClassForm from "./LiveClassForm";

function LiveClassSchedule() {
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3">
      <h1 className="text-xl md:text-3xl font-semibold text-center">
        Schedule Live Class
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Schedule your live class session for students
      </p>

      <div className="pt-6">
        <LiveClassForm />
      </div>
    </div>
  );
}

export default LiveClassSchedule;
