"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

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
        // pathname: `/content/${id}`,
        pathname: `/course/${courseId}/content/${id}`,
        query: { title: classTitle },
      }}
      className="block w-60 md:w-72 max-w-xs mx-auto rounded-lg shadow-lg overflow-hidden bg-indigo-100 dark:bg-gray-900"
    >
      {/* Thumbnail */}
      <div className="hover:bg-indigo-300 dark:hover:bg-indigo-600">
        <div className="relative w-full h-40">
          <Image
            src={thumbneil || "/placeholder-image.png"}
            alt={classTitle}
            layout="fill"
            className="object-cover"
          />
        </div>
        {/* Class Title */}
        <div className="p-2">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Class {classNo}: {classTitle}
          </h3>
        </div>

        {/* Content Info */}
        <div className="p-2">
          {(lectureSheet || practiceSheet || solutionSheet) && (
            <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
              Available materials:
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {lectureSheet && (
              <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                Lecture Sheet
              </span>
            )}
            {practiceSheet && (
              <span className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full">
                Practice Sheet
              </span>
            )}
            {solutionSheet && (
              <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
                Solution Sheet
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ClassCard;
