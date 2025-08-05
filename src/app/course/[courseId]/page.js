"use client";
import React from "react";

import { useParams, useSearchParams } from "next/navigation";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import SubjectCard from "@/components/cards/SubjectCard";
import SubjectFeature from "@/components/subject/SubjectFeature";

function Course() {
  const params = useParams();
  const searchParams = useSearchParams();

  const courseId = params?.courseId;
  const courseTitle = searchParams.get("title");

  const { data: subjectData, isLoading } =
    useGetSubjectsByCourseIdQuery(courseId);
  console.log(subjectData);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-500 text-xl font-medium">Loading subjects...</p>
      </div>
    );
  }
  const subjects = subjectData?.data;
  return (
    <div className="container mx-auto pt-28">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 mb-8">
          📚 Available Subjects
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 mt-2">
          Explore the subjects available in the course and find the perfect fit
          for your academic path.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-8 mx-5">
        {subjects.length === 0 ? (
          <p className="text-red-500 text-lg font-semibold col-span-full text-center">
            No Subject Added yet.
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
    </div>
  );
}

export default Course;
