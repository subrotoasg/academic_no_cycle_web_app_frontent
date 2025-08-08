"use client";
import React from "react";

import { useParams, useSearchParams } from "next/navigation";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import { useSelector } from 'react-redux';
import { selectHasCourseAccess } from '@/redux/Features/mycourses';
import SubjectCard from "@/components/cards/SubjectCard";
import Featured from "@/components/featured/Featured";
import NoticeBoard from "@/components/notice/NoticeBoard";
import StudentRoute from "@/PrivateRoute/StudentRoute";
import Link from "next/link";

function CourseContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const courseId = params?.courseId;
  const courseTitle = searchParams.get("title");

  const hasAccess = useSelector(selectHasCourseAccess(courseId));

  const { data: subjectData, isLoading } =
    useGetSubjectsByCourseIdQuery(courseId);
  // console.log(subjectData);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-blue-500 text-xl font-medium">
          Loading Course Data...
        </p>
      </div>
    );
  }

    if (!hasAccess) {
    return (
      <div className="container mx-auto pt-28">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
          <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You dont have access to this course. Please purchase the course to view its content.
          </p>
          <Link 
            href="https://aparsclassroom.com/shop/"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            target="_blank"
          >
            Visit Shop
          </Link>
        </div>
      </div>
    );
  }


  const subjects = subjectData?.data?.data;
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
        {!isLoading && (!subjects || subjects.length === 0) ? (
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

export default function Course() {
  return (
    <StudentRoute>
      <CourseContent />
    </StudentRoute>
  );
}
