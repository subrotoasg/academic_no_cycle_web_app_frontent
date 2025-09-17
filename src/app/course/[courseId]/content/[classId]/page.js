"use client";

import Loading from "@/components/admin/utilities/Loading";
import LoadingData from "@/components/common/LoadingData";
import Comments from "@/components/video/Comments";
import VideoHolder from "@/components/video/VideoHolder";
import VideoHolderModified from "@/components/video/VideoHolderModified";
import { useGetClassContentByCycleClassIdQuery } from "@/redux/services/contentsApi";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";

const Videos = () => {
  const params = useParams();
  const classId = params.classId;

  const {
    data: classContentData,
    isLoading,
    error,
  } = useGetClassContentByCycleClassIdQuery(classId);

  if (isLoading) {
    return (
      <div className="mt-20">
        <LoadingData />
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
    <div className="p-2 mt-20">
      {classContentData?.data.length === 0 ? (
        <p className="text-center text-lg font-semibold text-gray-500">
          No classes available for this chapter.
        </p>
      ) : (
        <>
          {/* <VideoHolder classContent={classContent} /> */}
          <VideoHolderModified classContent={classContent} />
          {/* <div className="md:px-20">
            <Comments />
          </div> */}
        </>
      )}
    </div>
  );
};

export default Videos;
