"use client";
import React from "react";
import ChapterCard from "@/components/cards/ChapterCard";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { MoveLeft } from "lucide-react";
import LoadingData from "@/components/common/LoadingData";
// import { useGetSubjectsByCycleIdQuery } from "@/redux/services/subjectsApi";
import CycleSubjectCard from "@/components/cards/CycleSubjectCard";
import { useGetSubjectsByCycleIdQuery } from "@/redux/services/cycleSubjectApi";

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
  const subjectName =
    cycleSubjects && cycleSubjects.length > 0
      ? cycleSubjects[0].courseSubject?.subject?.title
      : "Subject Details";

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
        Failed to load Subject. Please try again later.
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
        {!Array.isArray(cycleSubjects) || cycleSubjects.length === 0 ? (
          <div className="text-center text-lg text-gray-500 mt-2 md:mt-10">
            No Subject available yet.
          </div>
        ) : (
          <>
            <h3 className="md:text-2xl font-semibold text-center my-7 md:my-10 text-indigo-500">
              Available Subjects
            </h3>{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 justify-center gap-4 md:gap-7 items-center">
              {cycleSubjects?.map((subject) => (
                <CycleSubjectCard key={subject.id} subject={subject} />
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

export default Subject;
