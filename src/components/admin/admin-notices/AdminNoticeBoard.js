"use client";

import React, { useState } from "react";
import { NoticeUploader } from "./NoticeUploader";
import { NoticeList } from "./NoticeList";
import Switch from "../utilities/Switch";

function AdminNoticeBoard() {
  const [showUploader, setShowUploader] = useState(false);

  const handleToggle = (e) => {
    setShowUploader(e.target.checked);
  };

  return (
    <div className="w-full p-4">
      <Switch
        checked={showUploader}
        onChange={handleToggle}
        labelOn=" + Add Notice"
        labelOff="Minimize Form"
      />

      {showUploader && <NoticeUploader />}
      <NoticeList />
    </div>
  );
}

export default AdminNoticeBoard;
