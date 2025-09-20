"use client";
import React from "react";
import ChapterCard from "@/components/cards/ChapterCard";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MoveLeft } from "lucide-react";
import LoadingData from "@/components/common/LoadingData";
import CycleSubjectCard from "@/components/cards/CycleSubjectCard";
import NoticeMarque from "@/components/notice/NoticeMarque";
import NoticeCarousel from "@/components/notice/NoticeCarousel";
import Featured from "@/components/featured/Featured";
import NoticeBoard from "@/components/notice/NoticeBoard";
import { useGetSubjectsByCycleIdQuery } from "@/redux/services/cycleSubjectApi";
import { useGetArchivedCycleByIdQuery } from "@/redux/services/courseApi";
import ArchiveCourseCard from "@/components/cards/ArchiveCard";

function Subject() {
  const params = useParams();
  const router = useRouter();
  const cycleId = params?.cycleId;

  const {
    data: cycleBasedSubjectData,
    isLoading,
    error,
  } = useGetSubjectsByCycleIdQuery(cycleId, {
    skip: !cycleId,
  });

  const { data: archiveData, isLoading: isArchiveLoading } =
    useGetArchivedCycleByIdQuery(cycleId, {
      skip: !cycleId,
    });

  if (isLoading || isArchiveLoading || !cycleId) {
    return (
      <div className="mt-20">
        <LoadingData />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-26">Failed to laod data</div>
    );
  }

  const cycleSubjects = cycleBasedSubjectData?.data || [];
  const hasSubjects = cycleSubjects.length > 0;

  const courseTitle = hasSubjects
    ? `${cycleSubjects?.[0].cycle?.course?.productName} (${cycleSubjects?.[0].cycle?.title})`
    : "Cycle Course Details";

  return (
    <div className="mt-24 mx-5 mb-5">
      {/* <NoticeMarque courseId={cycleId} /> */}
      <div className="text-center">
        <h1 className="text-2xl md:text-5xl font-bold text-center text-blue-500 mb-8">
          {courseTitle}
        </h1>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl md:text-3xl font-bold text-center text-blue-500 my-10">
          Available Subjects
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mt-2">
          Explore the subjects in this course and find the right path for your
          preparation
        </p>
      </div>

      {/* Subjects & Archive */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {cycleSubjects.length === 0 && !archiveData ? (
          <p className="text-green-600 text-lg font-semibold col-span-full text-center">
            Archive will be available soon ...
          </p>
        ) : (
          <>
            {cycleSubjects.map((subject) => (
              <div
                key={subject.id}
                className="transition-transform transform hover:scale-105"
              >
                <CycleSubjectCard subject={subject} />
              </div>
            ))}
            {archiveData?.data && (
              <div className="transition-transform transform hover:scale-105">
                <ArchiveCourseCard archiveData={archiveData} />
              </div>
            )}
          </>
        )}
      </div>

      <div className="my-10 md:my-20">
        <NoticeBoard id={cycleId} type="cycle" />
      </div>
      <div className="my-10 md:my-20">
        <Featured id={cycleId} type="cycle" />
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

export default Subject;
