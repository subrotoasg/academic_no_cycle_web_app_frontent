"use client";

import React, { useState } from "react";
import FeatureUploader from "./FeaturedUploader";
import { FeaturedList } from "./FeaturedList";
import Switch from "../utilities/Switch";

function AdminFeatured() {
  const [showUploader, setShowUploader] = useState(false);

  const handleToggle = (e) => {
    setShowUploader(e.target.checked);
  };
  return (
    <div className="w-full p-4">
      <Switch
        checked={showUploader}
        onChange={handleToggle}
        labelOn=" + Add Feature"
        labelOff="Minimize Form"
      />

      {showUploader && <FeatureUploader />}
      <FeaturedList />
    </div>
  );
}

export default AdminFeatured;
