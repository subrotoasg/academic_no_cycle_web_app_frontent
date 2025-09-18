"use client";

import React from "react";
import NoticeCarousel from "./NoticeCarousel";
import { useGetNoticeRoutinesByCycleCourseIdQuery } from "@/redux/services/noticeRoutineApi";
import Marquee from "react-fast-marquee";
import "animate.css";

const NoticeMarque = ({ courseId }) => {
  const { data: notices, isLoading } = useGetNoticeRoutinesByCycleCourseIdQuery(
    {
      courseId,
    }
  );
  const today = new Date();

  const filteredNotices = notices?.data?.data?.filter((notice) => {
    const endDate = new Date(notice.endTime);
    return endDate >= today;
  });

  if (!notices || filteredNotices.length === 0) {
    return null;
  }
  const noticesData = filteredNotices;
  return (
    <div className="container mx-auto p-2 marquee-mobile">
      <Marquee>
        <div className="flex overflow-x-auto whitespace-nowrap px-2 md:px-6 py-2 md:py-3 scrollbar-hide">
          {noticesData?.map((notice, index) => (
            <p
              key={index}
              className="mx-3 md:mx-6 text-sm md:text-base text-green-600 dark:text-green-400 font-medium animate__animated animate__flash"
            >
              {notice?.description}
            </p>
          ))}
        </div>
      </Marquee>
    </div>
  );
};

export default NoticeMarque;
