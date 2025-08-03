"use client";

import React from "react";
import AdminList from "./AdminList";
import AdminUploader from "./AdminUploader";

const CreateAdmin = () => {
  return (
    <div className="w-full">
      <AdminUploader />

      <AdminList />
    </div>
  );
};

export default CreateAdmin;
