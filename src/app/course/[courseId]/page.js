"use client";
import React from "react";
import { useParams } from "next/navigation";
import Featured from "@/components/featured/Featured";
import NoticeBoard from "@/components/notice/NoticeBoard";
import { useGetArchivedCourseByIdQuery } from "@/redux/services/courseApi";
import ArchiveCourseCard from "@/components/cards/ArchiveCard";
import { useGetAllCourseCycleBasedOnCourseIdQuery } from "@/redux/services/cycleApi";
import CycleCard from "@/components/cards/CycleCard";
import { useGetMeQuery } from "@/redux/services/userInfoApi";
import LoadingData from "@/components/common/LoadingData";
import NoticeCarousel from "@/components/notice/NoticeCarousel";
import NoticeMarque from "@/components/notice/NoticeMarque";

function CourseContent() {
  const params = useParams();
  const courseId = params?.courseId;
  const { data: cycleData, isLoading } =
    useGetAllCourseCycleBasedOnCourseIdQuery({
      courseId,
      limit: 100,
    });
  const { data: archiveData, isLoading: isArchiveLoading } =
    useGetArchivedCourseByIdQuery(courseId);

  if (isLoading || isArchiveLoading) {
    return <LoadingData />;
  }
  const cycleDatas = cycleData?.data;
  const hascycleDatas = cycleDatas && cycleDatas?.length > 0;
  const courseTitle = hascycleDatas
    ? cycleDatas[0]?.course?.productFullName
    : null;

  return (
    <div className="container mx-auto mt-20 md:mt-28 p-1">
      <NoticeMarque courseId={courseId} />
      <div className="text-center mb-6">
        {hascycleDatas ? (
          <h3 className="text-2xl md:text-5xl font-bold text-center text-blue-500 mb-8">
            {courseTitle}
          </h3>
        ) : (
          <h3 className="text-2xl md:text-5xl font-bold text-center text-blue-700 mb-8">
            Course Details
          </h3>
        )}
      </div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-3xl font-bold text-center text-blue-500 my-10">
          Available Cycles
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mt-2">
          Explore the cycles available in the course and find the perfect fit
          for your academic path.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {cycleDatas?.length === 0 && !archiveData ? (
          <p className="text-green-600 text-lg font-semibold col-span-full text-center">
            Archive will be available soon ...
          </p>
        ) : (
          <>
            {cycleDatas?.map((cs, index) => (
              <div
                key={cs.id}
                className="transition-transform transform hover:scale-105"
              >
                <CycleCard cycle={cs} />
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
      <div className="my-10 md:my-10">
        {/* <NoticeBoard courseId={courseId} /> */}
        <NoticeCarousel courseId={courseId} />
      </div>
      <div className="my-10">
        <Featured courseId={courseId} />
      </div>
    </div>
  );
}

export default CourseContent;
