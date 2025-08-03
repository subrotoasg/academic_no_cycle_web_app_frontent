import React from "react";
import AdminAssignForm from "./AdminAssignForm";

function AdminAssignUploader({ fetchAssignedAdminInfo }) {
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        
        Assign Courses to Admins
      </h2>
      <p className="text-muted-foreground text-center mt-2">
        Select admins and assign them specific courses to manage academic
        responsibilities efficiently.
      </p>

      <div className="pt-6">
        <AdminAssignForm fetchAssignedAdminInfo={fetchAssignedAdminInfo} />
      </div>
    </div>
  );
}

export default AdminAssignUploader;
