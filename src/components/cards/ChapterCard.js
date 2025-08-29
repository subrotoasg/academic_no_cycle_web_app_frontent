"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

function ChapterCard({ chapter }) {
  const imageUrl =
    chapter?.courseSubjectChapterImage ||
    chapter?.chapter?.chapterImage ||
    "/placeholder-image.png";
  // console.log(chapter);
  const courseId = chapter?.courseSubject?.course?.id;
  return (
    <Link
      href={{
        pathname: `/course/${courseId}/classes/${chapter?.id}`,
        query: {
          title: chapter?.chapter?.chapterName,
        },
      }}
      className="block rounded-xl overflow-hidden shadow-md hover:scale-102 bg-gray-600"
    >
      <div className="p-2">
        <h3 className="text-xl font-semibold text-white ">
          {chapter?.chapter?.chapterName}
        </h3>
      </div>
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={chapter?.chapter?.chapterName || "Chapter image"}
          layout="fill"
          className="object-cover rounded-b-xl"
        />
      </div>
    </Link>
  );
}

export default ChapterCard;
