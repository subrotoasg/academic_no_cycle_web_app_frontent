"use client";
import React from "react";
import FeaturedForm from "./FeaturedForm";

export default function FeatureUploader() {
  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-2">
      <h1 className="text-xl md:text-3xl font-semibold text-center">
        Add New Feature
      </h1>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Create featured content such as promotional offers, discounts, and
        special announcements.
      </p>

      <div className="pt-6">
        <FeaturedForm />
      </div>
    </div>
  );
}
