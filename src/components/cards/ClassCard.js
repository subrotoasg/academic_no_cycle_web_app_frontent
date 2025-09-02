"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";
import backupImg from "../../../public/img/backup.png";

function ClassCard({ content }) {
  const {
    id,
    classTitle,
    classNo,
    thumbneil,
    lectureSheet,
    practiceSheet,
    solutionSheet,
  } = content || {};
  const courseId = content?.courseSubjectChapter?.courseSubject?.course?.id;
  return (
    <Link
      href={{
        pathname: `/course/${courseId}/content/${id}`,
        query: { title: classTitle },
      }}
      className="block w-full max-w-xs mx-auto rounded-lg shadow-lg overflow-hidden bg-indigo-100 dark:bg-gray-900 hover:bg-indigo-300 dark:hover:bg-indigo-600 transition-colors duration-200"
    >
      {/* Thumbnail */}
      {/* <div className="hover:bg-indigo-300 dark:hover:bg-indigo-600"> */}
      <div className="relative w-full md:h-40 h-48">
        <Image
          src={thumbneil || backupImg}
          alt={classTitle}
          layout="fill"
          className="object-fill"
        />
      </div>

      <div className="p-1">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white text-center">
          Class {classNo} : {classTitle}
        </h3>
      </div>

      {/* Content Info */}
      {(lectureSheet || practiceSheet || solutionSheet) && (
        <div className="p-2 md:p-2">
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-3 font-medium">
            Lesson Materials:
          </p>

          <div className="flex flex-wrap gap-2">
            {lectureSheet && (
              <span className="px-2 py-1 text-xs md:text-sm font-semibold text-blue-800 bg-blue-100 dark:bg-blue-900 dark:text-blue-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                Lecture Sheet
              </span>
            )}
            {practiceSheet && (
              <span className="px-2 py-1 text-xs md:text-sm font-semibold text-emerald-800 bg-emerald-100 dark:bg-emerald-900 dark:text-emerald-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                Practice Sheet
              </span>
            )}
            {solutionSheet && (
              <span className="px-2 py-1 text-xs md:text-sm font-semibold text-purple-800 bg-purple-100 dark:bg-purple-900 dark:text-purple-200 rounded-full shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
                Solution Sheet
              </span>
            )}
          </div>
        </div>
      )}
      {/* </div> */}
    </Link>
  );
}

export default ClassCard;
