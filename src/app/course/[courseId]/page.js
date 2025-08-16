"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import SubjectCard from "@/components/cards/SubjectCard";
import Featured from "@/components/featured/Featured";
import NoticeBoard from "@/components/notice/NoticeBoard";
import Loading from "@/app/admin/loading";
import { useGetArchivedCourseByIdQuery } from "@/redux/services/courseApi";
import Link from "next/link";
import Image from "next/image";
import ArchiveCourseCard from "@/components/cards/ArchiveCard";

function CourseContent() {
  const params = useParams();

  const courseId = params?.courseId;
  const { data: subjectData, isLoading } =
    useGetSubjectsByCourseIdQuery(courseId);
  const { data: archiveData, isLoading: isArchiveLoading } =
    useGetArchivedCourseByIdQuery(courseId);
  // console.log(archiveData);

  if (isLoading || isArchiveLoading) {
    return <Loading />;
  }
  const subjects = subjectData?.data;
  const hasSubjects = subjects && subjects.length > 0;
  const courseTitle = hasSubjects ? subjects[0].course.productFullName : null;
  return (
    <div className="container mx-auto mt-20 md:mt-28 p-1">
      <div className="text-center mb-6">
        {hasSubjects ? (
          <h3 className="text-2xl md:text-5xl font-bold text-center text-blue-700 mb-8">
            {courseTitle}
          </h3>
        ) : (
          <h3 className="text-2xl md:text-5xl font-bold text-center text-blue-700 mb-8">
            Course Details
          </h3>
        )}
      </div>
      <div className="my-10 md:my-20">
        <NoticeBoard courseId={courseId} />
      </div>
      <div className="my-10 md:my-20">
        <Featured courseId={courseId} />
      </div>
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-3xl font-bold text-center text-blue-500 my-10">
          Available Classes
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mt-2">
          Explore the classes available in the course and find the perfect fit
          for your admission path.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {subjects.length === 0 && !archiveData ? (
          <p className="text-green-600 text-lg font-semibold col-span-full text-center">
            Archive will be available soon ...
          </p>
        ) : (
          <>
            {subjects.map((cs, index) => (
              <div
                key={cs.id}
                data-aos="fade-up"
                data-aos-delay={index * 300}
                className="transition-transform transform hover:scale-105"
              >
                <SubjectCard courseSubject={cs} />
              </div>
            ))}
            {archiveData?.data && (
              <ArchiveCourseCard archiveData={archiveData} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default CourseContent;
