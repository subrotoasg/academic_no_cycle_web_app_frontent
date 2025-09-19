"use client";
import React from "react";
import ChapterCard from "@/components/cards/ChapterCard";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MoveLeft } from "lucide-react";
import LoadingData from "@/components/common/LoadingData";
import CycleSubjectCard from "@/components/cards/CycleSubjectCard";
import { useGetSubjectsByCycleIdQuery } from "@/redux/services/cycleSubjectApi";
import NoticeMarque from "@/components/notice/NoticeMarque";
import NoticeCarousel from "@/components/notice/NoticeCarousel";
import Featured from "@/components/featured/Featured";

function Subject() {
  const params = useParams();
  const router = useRouter();
  const cycleBasedSubjectId = params?.cycleId;
  const {
    data: cycleBasedSubjectData,
    isLoading,
    error,
  } = useGetSubjectsByCycleIdQuery(cycleBasedSubjectId, {
    skip: !cycleBasedSubjectId,
  });
  const cycleSubjects = cycleBasedSubjectData?.data;
  const courseName =
    cycleSubjects && cycleSubjects.length > 0
      ? cycleSubjects?.[0].cycle?.course?.productName
      : "";

  const cycleId =
    cycleSubjects && cycleSubjects.length > 0
      ? cycleSubjects?.[0]?.cycle?.id
      : "";

  if (isLoading || !cycleBasedSubjectId) {
    return (
      <div className="mt-20">
        <LoadingData />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-26">
        দুঃখিত! ডেটা লোড করা যায় নি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করো
      </div>
    );
  }
  return (
    <div className="mt-24 mx-5 mb-5">
      <NoticeMarque courseId={cycleId} />
      <div className="text-center">
        <h1 className="pt-3 text-center font-bold text-2xl sm:text-3xl text-blue-500">
          {courseName}
        </h1>
      </div>

      <div className="w-full">
        {!Array.isArray(cycleSubjects) || cycleSubjects.length === 0 ? (
          <div className="text-center text-lg text-gray-500 mt-2 md:mt-10">
            কোনো সাবজেক্ট পাওয়া যায় নি। দুঃখিত!
          </div>
        ) : (
          <>
            <h3 className="md:text-2xl font-semibold text-center my-7 md:my-5 text-indigo-500">
              কোর্সের সাবজেক্ট গুলো দেখো
            </h3>{" "}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {cycleSubjects?.map((subject) => (
                <CycleSubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
            {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center gap-4 md:gap-7 items-center">
              {cycleSubjects?.map((subject) => (
                <CycleSubjectCard key={subject.id} subject={subject} />
              ))}
            </div> */}
          </>
        )}
      </div>
      <div className="my-4 md:my-8">
        <NoticeCarousel courseId={cycleId} />
      </div>
      <div className="my-10">
        <Featured courseId={cycleId} />
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
