"use client";
import React from "react";
import ChapterCard from "@/components/cards/ChapterCard";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/admin/utilities/Loading";
import { MoveLeft } from "lucide-react";
import LoadingData from "@/components/common/LoadingData";
import { useGetAllChaptersByCycleSubjectIdQuery } from "@/redux/services/cycleChapterApi";

function CycleSubjectBasedChapter() {
  const params = useParams();
  const router = useRouter();

  const cycleSubjectId = params?.cycleSubjectId;
  const {
    data: subjectChapterData,
    isLoading,
    error,
  } = useGetAllChaptersByCycleSubjectIdQuery(
    { cycleSubjectId, limit: 100 },
    {
      skip: !cycleSubjectId,
    }
  );
  const subjectChapters = subjectChapterData?.data;
  const subjectName =
    subjectChapters && subjectChapters.length > 0
      ? subjectChapters?.[0].cycleSubject?.subject?.title
      : "Subject Details";

  if (isLoading || !cycleSubjectId) {
    return (
      <div className="mt-20">
        <LoadingData />
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
      <div className="text-center">
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
      <div className="text-center my-10 md:my-14">
        <button
          onClick={() => router.back()}
          className="flex justify-center items-center gap-2 px-3 md:px-6 py-1 md:py-2 bg-blue-500 text-white rounded-lg hover:rounded-full hover:bg-blue-600  mx-auto"
        >
          <MoveLeft /> Go Back
        </button>
      </div>
    </div>
  );
}

export default CycleSubjectBasedChapter;
