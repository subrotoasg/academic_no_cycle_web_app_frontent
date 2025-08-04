import Image from "next/image";
import Link from "next/link";
import React from "react";

function ChapterCard({ chapter }) {
  return (
    <Link
      href={{
        pathname: `/classes/${chapter?.id}`,
        query: {
          title: chapter?.chapter?.chapterName,
        },
      }}
      className="group block "
      data-aos="fade-up"
    >
      <div className="flex flex-col h-full rounded-2xl overflow-hidden shadow-lg transition-transform transform group-hover:scale-105 dark:bg-gray-800 bg-white">
        <div className="flex-grow">
          <Image
            src={
              chapter?.courseSubjectChapterImage ||
              chapter?.chapter?.chapterImage
            }
            alt={`Chapter ${chapter?.chapter?.chapterName} image`}
            className="w-full h-48 rounded-md"
            priority
            width={100}
            height={100}
          />
        </div>
        <div className="p-4 text-center dark:text-white text-gray-800  flex items-center justify-center">
          <p className="tiro-bangla-text text-lg font-semibold truncate">
            {chapter?.chapter?.chapterName}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default ChapterCard;
