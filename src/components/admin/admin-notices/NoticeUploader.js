"use client";
import React from "react";
import NoticeForm from "./NoticeForm";

export function NoticeUploader() {
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3">
      <h1 className="text-xl md:text-3xl font-semibold text-center">
        Add Notice & Routine
      </h1>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Upload class routines or important notices to keep students informed and
        up to date.
      </p>

      <div className="pt-6">
        <NoticeForm />
      </div>
    </div>
  );
}
