"use client";

import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import React from "react";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";
import Loading from "../admin/utilities/Loading";
import SubjectFeature from "../subject/SubjectFeature";

function MyClass() {
  // const course = useSelector(selectCourse);
  // const courseId = course?.id;
  const courseId = "a220ea44-dfb4-4d4d-a073-50f6bd7d6669";

  const {
    data: subjectData,
    isLoading,
    isError,
  } = useGetSubjectsByCourseIdQuery(courseId, {
    skip: !courseId,
  });

  const subjects = subjectData?.data;

  if (isLoading) {
    return (
      <div className="py-25 mx-4">
        <Loading />
      </div>
    );
  }

  if (isError || !subjects || subjects.length === 0) {
    return (
      <div className="py-25 mx-4">
        <h2 className="text-2xl font-bold text-center text-red-500 mt-20">
          Oooops! No Subjects Available Yet
        </h2>
      </div>
    );
  }

  return (
    <div className="py-25 mx-4">
      <SubjectFeature />
    </div>
  );
}

export default MyClass;
