"use client";
import React from "react";
import ChapterCard from "@/components/cards/ChapterCard";
import { useParams, useSearchParams } from "next/navigation";
import Loading from "@/components/admin/utilities/Loading";
import { useGetChaptersByCycleSubjectIdQuery } from "@/redux/services/chapterAPi";

function Subject() {
  const params = useParams();
  const searchParams = useSearchParams();

  const cycleSubjectId = params.subjectId;
  const cycleSubjectTitle = searchParams.get("title");

  const {
    data: subjectChapterData,
    isLoading,
    error,
  } = useGetChaptersByCycleSubjectIdQuery(cycleSubjectId, {
    skip: !cycleSubjectId,
  });

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
        Failed to load chapters. Please try again later.
      </div>
    );
  }

  const subjectChapters = subjectChapterData?.data;
  return (
    <div className="mt-24 mx-5">
      <div className="text-center mb-6">
        <h1 className="pt-3 text-center font-bold text-2xl md:text-3xl mb-5 text-blue-400 tiro-bangla-text">
          {cycleSubjectTitle}
        </h1>
      </div>

      <div className="">
        <div className="w-full">
          {subjectChapterData?.data?.length === 0 ? (
            <div className="text-center text-lg text-gray-500 mt-2 md:mt-10">
              No chapters available now.
            </div>
          ) : (
            <>
              <h3 className="md:text-2xl font-semibold text-center my-7 md:my-10 text-indigo-500">
                Available Chapters
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4  md:gap-7 justify-center items-center">
                {subjectChapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    data-aos="zoom-in"
                    data-aos-delay={index * 200}
                  >
                    <ChapterCard key={chapter.id} chapter={chapter} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Subject;
