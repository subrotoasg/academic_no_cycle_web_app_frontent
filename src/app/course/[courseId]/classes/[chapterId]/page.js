"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ClassCard from "@/components/cards/ClassCard";
import Loading from "@/components/admin/utilities/Loading";
import { useGetClassContentsBySubjectChapterIdQuery } from "@/redux/services/contentsApi";
import { MoveLeft } from "lucide-react";

function Class() {
  const params = useParams();
  const router = useRouter();

  const subjectChapterId = params.chapterId;

  const {
    data: chapterContentsData,
    isLoading,
    isError,
  } = useGetClassContentsBySubjectChapterIdQuery(subjectChapterId);

  const chapterContents = chapterContentsData?.data;
  // console.log(chapterContents);

  const chapterTitle =
    chapterContents && chapterContents.length > 0
      ? chapterContents[0].courseSubjectChapter?.chapter?.chapterName
      : "Chapter Details";

  if (isLoading || !subjectChapterId) {
    return (
      <div className="mt-20">
        <Loading />
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

  // const chapterContents = chapterContentsData?.data
  //   ?.slice()
  //   .sort((a, b) => Number(a.classNo) - Number(b.classNo));

  return (
    <div className="w-full mt-24 container mx-auto">
      <div className="text-center mb-6">
        <h1 className="pt-3 text-center font-bold text-2xl md:text-3xl mb-5 text-blue-500">
          {chapterTitle}
        </h1>
      </div>

      <div className="md:flex gap-8 justify-between my-5">
        <div className="w-full">
          {chapterContents?.length > 0 ? (
            <>
              <h3 className="md:text-2xl font-semibold text-center my-7 text-indigo-500">
                Available Classes
              </h3>{" "}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 lg:mx-0 mx-2">
                {chapterContents?.map((content) => (
                  <div key={content.id}>
                    <ClassCard content={content} />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-lg font-semibold text-gray-500">
              No classes available for this chapter.
            </p>
          )}
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
