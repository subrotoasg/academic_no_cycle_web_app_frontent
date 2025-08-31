"use client";
import React from "react";
import ChapterCard from "@/components/cards/ChapterCard";
import { useParams, useSearchParams } from "next/navigation";
import Loading from "@/components/admin/utilities/Loading";
import { useGetChaptersByCourseSubjectIdQuery } from "@/redux/services/chapterAPi";

function Subject() {
  const params = useParams();
  const courseSubjectId = params?.subjectId;

  const {
    data: subjectChapterData,
    isLoading,
    error,
  } = useGetChaptersByCourseSubjectIdQuery(courseSubjectId, {
    skip: !courseSubjectId,
  });

  const subjectChapters = subjectChapterData?.data;

  const subjectName =
    subjectChapters && subjectChapters.length > 0
      ? subjectChapters[0].courseSubject?.subject?.title
      : "Subject Details";

  if (isLoading || !courseSubjectId) {
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

  return (
    <div className="mt-24 mx-5 mb-5">
      <div className="text-center mb-12">
        <h1 className="pt-3 text-center font-bold text-2xl sm:text-3xl mb-5 text-blue-500">
          {subjectName}
        </h1>
      </div>

      <div className="w-full">
        {!Array.isArray(subjectChapters) || subjectChapters.length === 0 ? (
          <div className="text-center text-lg text-gray-500 mt-2 md:mt-10">
            No chapters available yet.
          </div>
        ) : (
          <>
            <h3 className="md:text-2xl font-semibold text-center my-7 md:my-10 text-indigo-500">
              Available Chapters
            </h3>{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center gap-4 md:gap-7 items-center">
              {subjectChapters?.map((chapter) => (
                <ChapterCard key={chapter.id} chapter={chapter} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Subject;
