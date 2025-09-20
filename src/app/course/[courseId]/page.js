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
import { useGetAllLiveClassQuery } from "@/redux/services/liveClassApi";
import LiveClassLayout from "@/components/liveClass/LiveClassLayout";

function CourseContent() {
  const params = useParams();
  const courseId = params?.courseId;
  const { data: cycleData, isLoading } =
    useGetAllCourseCycleBasedOnCourseIdQuery({
      courseId,
      limit: 100,
    });
  const { data, isLoading: isLiveLoading } = useGetAllLiveClassQuery();
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
      <div className="text-center mb-6">
        {hascycleDatas ? (
          <h3 className="text-2xl md:text-5xl font-bold text-center text-blue-500 mb-8">
            {courseTitle}
          </h3>
        ) : (
          <h3 className="text-2xl md:text-5xl font-bold text-center text-blue-700 mb-8">
            কোর্সের বিস্তারিত
          </h3>
        )}
      </div>
      <LiveClassLayout data={data} />

      <div className="text-center mb-6">
        <h2 className="text-xl md:text-3xl font-bold text-center text-blue-500 mt-7 md:mb-3 mb-1">
          অধ্যায় ভিত্তিক সাইকেলের তালিকা
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          {/* কোর্সে থাকা সাইকেলগুলো দেখে নাও এবং পছন্দের কোর্সটিতে এখনই ভর্তি হয়ে
          আপনার শেখার যাত্রা শুরু করুন। */}
          সাইকেলভিত্তিক কোর্সগুলো দেখুন এবং আপনার একাডেমিক যাত্রার জন্য সবচেয়ে
          উপযুক্ত কোর্সটিতে এখনই এনরোল হয়ে নিন।
        </p>
      </div>

      {/* <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {cycleDatas?.length === 0 && !archiveData ? (
          <p className="text-green-600 text-lg font-semibold col-span-full text-center">
            আর্কাইভ খুব শীঘ্রই আপডেট করা হবে...
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
      </div> */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {cycleDatas?.length === 0 ? (
          <p className="text-green-600 text-lg font-semibold col-span-full text-center">
            No cycle available yet in this course...
          </p>
        ) : (
          cycleDatas?.map((cs) => (
            <div
              key={cs.id}
              className="transition-transform transform hover:scale-105"
            >
              <CycleCard cycle={cs} />
            </div>
          ))
        )}
      </div>
      <div className="my-8 md:my-14">
        <NoticeBoard courseId={courseId} />
      </div>
      <div className="my-10 md:my-14">
        <Featured courseId={courseId} />
      </div>
    </div>
  );
}

export default CourseContent;
