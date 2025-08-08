"use client";

import Loading from "@/components/admin/utilities/Loading";
import Comments from "@/components/video/Comments";
import VideoHolder from "@/components/video/VideoHolder";
import { useGetClassContentByClassIdQuery } from "@/redux/services/contentsApi";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const Videos = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const classId = params.classId;
  const classTitle = searchParams.get("title");

  const {
    data: classContentData,
    isLoading,
    error,
  } = useGetClassContentByClassIdQuery(classId);

  if (isLoading) {
    return (
      <div className="mt-20">
        <Loading />
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500 mt-26">
        Failed to load class content. Please try again later.
      </div>
    );
  }

  const classContent = classContentData?.data;
  return (
    <div className="p-2 mt-5">
      <h2 className="text-2xl md:text-4xl text-center text-blue-500 mb-5">
        Recorded Class Content
      </h2>
      {classContentData?.data.length === 0 ? (
        <p className="text-center text-lg font-semibold text-gray-500">
          No classes available for this chapter.
        </p>
      ) : (
        <>
          <VideoHolder classContent={classContent} classTitle={classTitle} />
          {/* <div className="md:px-20">
            <Comments />
          </div> */}
        </>
      )}
    </div>
  );
};

export default Videos;
