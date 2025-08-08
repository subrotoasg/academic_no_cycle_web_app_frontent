"use client";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import SubjectCard from "@/components/cards/SubjectCard";
import Featured from "@/components/featured/Featured";
import NoticeBoard from "@/components/notice/NoticeBoard";

function CourseContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const courseId = params?.courseId;
  const courseTitle = searchParams.get("title");

  const { data: subjectData, isLoading } =
    useGetSubjectsByCourseIdQuery(courseId);
  console.log(subjectData);

  const subjects = subjectData?.data;
  console.log(subjects);

  return (
    <div className="container mx-auto pt-28">
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-4xl font-bold text-center text-blue-800 mb-8">
          Course Title : {courseTitle}
        </h3>
        <h2 className="text-xl md:text-2xl font-bold text-center text-blue-500 mb-8">
          📚 Available Classes
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mt-2">
          Explore the classes available in the course and find the perfect fit
          for your academic path.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {isLoading ? (
          <p className="text-blue-500 col-span-full text-center text-lg">
            Loading Course Data...
          </p>
        ) : !subjects || subjects.length === 0 ? (
          <p className="text-red-500 text-lg font-semibold col-span-full text-center">
            No Class Added yet.
          </p>
        ) : (
          subjects.map((cs, index) => (
            <div
              key={cs.id}
              data-aos="fade-up"
              data-aos-delay={index * 300}
              className="transition-transform transform hover:scale-105"
            >
              <SubjectCard courseSubject={cs} />
            </div>
          ))
        )}
      </div>

      <div>
        <Featured courseId={courseId} />
      </div>
      <div className="my-10 md:my-20">
        <NoticeBoard courseId={courseId} />
      </div>
    </div>
  );
}

export default CourseContent;
