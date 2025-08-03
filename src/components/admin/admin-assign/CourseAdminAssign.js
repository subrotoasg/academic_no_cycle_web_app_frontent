"use client";

import React from "react";
import AdminAssignUploader from "./AdminAssignUploader";
import AdminAssignList from "./AdminAssignList";
// import useAssignedAdmins from "@/hooks/useAssignedAdmins";

function CourseAdminAssign() {
  const { adminAssignedInfo, loading, refetchAssignedAdminInfo } =
    useAssignedAdmins();

  return (
    <div className="w-full">
      <AdminAssignUploader fetchAssignedAdminInfo={refetchAssignedAdminInfo} />
      <AdminAssignList
        fetchAssignedAdminInfo={refetchAssignedAdminInfo}
        adminAssignedInfo={adminAssignedInfo}
        loading={loading}
      />
    </div>
  );
}

export default CourseAdminAssign;
