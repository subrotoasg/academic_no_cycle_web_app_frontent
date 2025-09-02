import StudentProfile from "@/components/profile/StudentProfile";
import StudentRoute from "@/PrivateRoute/StudentRoute";
import React from "react";

const page = () => {
  return (
    <>
      <StudentRoute>
        <StudentProfile />
      </StudentRoute>
    </>
  );
};

export default page;
