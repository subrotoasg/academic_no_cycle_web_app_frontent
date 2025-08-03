"use client";
import Loading from "@/components/admin/utilities/Loading";
import SubjectFeature from "@/components/subject/SubjectFeature";
import { useGetSubjectsByCycleIdQuery } from "@/redux/services/cycleSubjectApi";
import { useParams, useSearchParams } from "next/navigation";

const CyclePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const cycleId = params.cycleId;
  const cycleTitle = searchParams.get("title");

  const {
    data: cycleSubjectsData,
    isLoading: cycleSubjectLoading,
    error,
  } = useGetSubjectsByCycleIdQuery({ cycleId });

  if (cycleSubjectLoading) {
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
  const cycleSubjects = cycleSubjectsData?.data;
  return (
    <div className="mt-24 mx-2">
      <div className="text-center mb-6" data-aos="fade-down">
        <h1 className="pt-3 text-center text-2xl md:text-3xl font-bold text-indigo-600 mb-6">
          Cycle Title: {cycleTitle}
        </h1>
      </div>

      {cycleSubjects.length === 0 ? (
        <div className="text-center text-lg text-gray-500  mt-2 md:mt-10">
          No subjects added to this cycle yet.
        </div>
      ) : (
        <SubjectFeature cycleSubjects={cycleSubjects} />
      )}
    </div>
  );
};

export default CyclePage;
