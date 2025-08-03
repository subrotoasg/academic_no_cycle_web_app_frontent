"use client";
import React from "react";
import AdminForm from "./AdminForm";

function AdminUploader() {
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-lg rounded-2xl space-y-2">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        Create New Admin
      </h2>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Add a new admin to manage and oversee platform operations
      </p>

      <div className="pt-6">
        <AdminForm />
      </div>
    </div>
  );
}

export default AdminUploader;
