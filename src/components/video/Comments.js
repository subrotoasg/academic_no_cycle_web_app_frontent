'use client'; 

import React, { useEffect, useState } from "react";

const data = {
  facebookComments: {
    src: "https://www.facebook.com/plugins/feedback.php?app_id=1152515561798223&href=https%3A%2F%2Ffrb24.aparsclassroom.com%2FChemistry%2FPaper-1%2FChapter-3%2FClass-65d8a51adcc6dea65e5b9637&width=100%25&numposts=10&order_by=social&sdk=joey&version=v9.0",
  },
};

function Comments() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="mt-6">
      <iframe
        src={data.facebookComments.src}
        className="w-full rounded-xl"
        style={{
          minHeight: "1200px", 
          maxHeight: "1500px",
          width: "100%",
          border: "none",
          overflow: "auto",
        }}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        title="Facebook Comments"
      ></iframe>
    </div>
  );
}

export default Comments;
