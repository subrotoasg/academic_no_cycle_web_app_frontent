"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

  return (
    <Link
      href={{
        pathname: `/content/${id}`,
        query: { title: classTitle },
      }}
      className="block"
    >
      <div className="mx-auto  max-w-xs h-auto gap-4 overflow-hidden rounded-2xl bg-blue-100 border border-gray-200   shadow-sm dark:bg-gray-700 dark:border-gray-700 transition-transform transform hover:scale-105 flex flex-col relative">
        <div className="w-full h-44 overflow-hidden">
          <Image
            className="w-full h-full object-fill transition-transform duration-300 group-hover:scale-105"
            src={thumbneil}
            alt={classTitle}
            priority
            width={400}
            height={400}
          />
        </div>

        <div className="absolute top-3 right-4 pl-3 mx-auto ">
          <div className="flex justify-end items-end gap-1">
            {lectureSheet && (
              <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full hover:underline">
                Lecture
              </span>
            )}
            {practiceSheet && (
              <span className="px-2 py-1 text-xs font-semibold text-white  bg-indigo-600 rounded-full hover:underline">
                Practice
              </span>
            )}
            {solutionSheet && (
              <span className="px-2 py-1 text-xs font-semibold text-white  bg-emerald-600 rounded-full hover:underline">
                Solution
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 p-3 text-center flex flex-col justify-between">
          <h5 className="mb-2 tiro-bangla-text text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {classNo} - {classTitle}
          </h5>
        </div>
      </div>
    </Link>
  );
}

export default ClassCard;
