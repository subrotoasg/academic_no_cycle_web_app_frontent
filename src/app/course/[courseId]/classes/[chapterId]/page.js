"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ClassCard from "@/components/cards/ClassCard";
import { useGetClassContentsByCycleSubjectChapterIdQuery } from "@/redux/services/contentsApi";
import { MoveLeft } from "lucide-react";
import { useUploadingLiveClassQuery } from "@/redux/services/liveClassApi";
import UploadingClass from "@/components/liveClass/uploadingClass/UploadingClasses";
import LoadingData from "@/components/common/LoadingData";
import VideoHolderModified from "@/components/video/VideoHolderModified";

function Class() {
  const params = useParams();
  const router = useRouter();

  const cycleSubjectChapterId = params.chapterId;

  const {
    data: chapterContentsData,
    isLoading,
    isError,
  } = useGetClassContentsByCycleSubjectChapterIdQuery(cycleSubjectChapterId);

  const chapterContents = chapterContentsData?.data;
  const chapterTitle =
    chapterContents && chapterContents.length > 0
      ? chapterContents?.[0]?.cycleSubjectChapter?.chapter?.chapterName
      : "Chapter Details";

  if (isLoading || !cycleSubjectChapterId) {
    return (
      <div className="mt-20">
        <LoadingData />
      </div>
    );
  }

  {
    isError && (
      <div className="text-center py-20 text-lg font-medium text-red-500">
        Failed to load chapter data, please try again.
      </div>
    );
  }

  return (
    <div className="w-full mt-24 container mx-auto">
      <h1 className="pt-3 text-center font-bold text-2xl md:text-3xl mb-2 text-blue-500">
        {chapterTitle}
      </h1>
      <div className="md:flex gap-4 justify-between my-5">
        <div className="w-full">
          {chapterContents?.length > 0 ? (
            <>
              {/* <h3 className="md:text-2xl font-semibold text-center mb-7 text-indigo-500">
                Available Classes
              </h3>{" "}
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                {chapterContents?.map((content) => (
                  <ClassCard content={content} key={content?.id} />
                ))}
              </div> */}
              <VideoHolderModified content={chapterContents?.[0]} />
            </>
          ) : (
            <p className="text-center text-lg font-semibold text-gray-500">
              No classes available for this chapter.
            </p>
          )}
          <UploadingClass cycleSubjectChapterId={cycleSubjectChapterId} />
          {/* Go Back Button */}
          <div className="text-center my-10 md:my-14">
            <button
              onClick={() => router.back()}
              className="flex justify-center items-center gap-2 px-3 md:px-6 py-1 md:py-2 text-xs md:text-base bg-blue-500 text-white rounded-lg hover:rounded-full hover:bg-blue-600 mx-auto"
            >
              <MoveLeft /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Class;
