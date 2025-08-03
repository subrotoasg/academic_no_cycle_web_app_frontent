"use client";
import Loading from "@/components/admin/utilities/Loading";
import SubjectFeature from "@/components/subject/SubjectFeature";
import { useGetSubjectsByCycleIdQuery } from "@/redux/services/cycleSubjectApi";
import { useParams, useSearchParams } from "next/navigation";

const CyclePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const cycleId = params.cycleId;
  const courseTitle = searchParams.get("title");

  const {
    data: courseSubjectsData,
    isLoading: courseSubjectLoading,
    error,
  } = useGetSubjectsByCycleIdQuery({ cycleId });

  if (courseSubjectLoading) {
    return (
      <div className="mt-20">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500 mt-26">
        Failed to load Cycle. Please try again later.
      </div>
    );
  }
  const courseSubjects = courseSubjectsData?.data;
  return (
    <div className="mt-24 mx-2">
      <div className="text-center mb-6" data-aos="fade-down">
        <h1 className="pt-3 text-center text-2xl md:text-3xl font-bold text-indigo-600 mb-6">
          Course Title: {courseTitle}
        </h1>
      </div>

      {courseSubjects.length === 0 ? (
        <div className="text-center text-lg text-gray-500  mt-2 md:mt-10">
          No subjects added to this course yet.
        </div>
      ) : (
        <SubjectFeature courseSubjects={courseSubjects} />
      )}
    </div>
  );
};

export default CyclePage;
