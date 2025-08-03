"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import ClassCard from "@/components/cards/ClassCard";
import { useGetCycleClassContentByChapterIdQuery } from "@/redux/services/cycleClassContentApi";
import Loading from "@/app/loading";

function Class() {
  const params = useParams();
  const searchParams = useSearchParams();

  const chapterId = params.chapterId;
  const chapterTitle = searchParams.get("title");

  const {
    data: chapterContentsData,
    isLoading,
    error,
  } = useGetCycleClassContentByChapterIdQuery(chapterId);

  if (isLoading) {
    return (
      <div className="mt-20">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500 mt-26">
        Failed to load Classes. Please try again later.
      </div>
    );
  }

  const chapterContents = chapterContentsData?.data
    ?.slice()
    .sort((a, b) => Number(a.classNo) - Number(b.classNo));

  return (
    <div className="mt-24 w-full">
      <div className="text-center mb-6" data-aos="fade-down">
        <h1 className="pt-5 text-center font-bold text-2xl md:text-3xl mb-5 text-blue-400">
          Chapter: {chapterTitle}
        </h1>
      </div>

      <div className="md:flex gap-10 justify-between my-5">
        <div className="w-full">
          <h3
            className="md:text-2xl font-semibold text-center my-7 text-blue-600"
            data-aos="fade-up"
          >
            Available Classes
          </h3>
          {chapterContents?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-10">
              {chapterContents.map((content, index) => (
                <div
                  key={content.id}
                  data-aos="zoom-in"
                  data-aos-delay={index * 200}
                >
                  <ClassCard content={content} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg font-semibold text-gray-500">
              No classes available for this chapter.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Class;
