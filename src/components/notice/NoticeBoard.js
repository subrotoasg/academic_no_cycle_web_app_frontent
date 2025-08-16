"use client";

import React from "react";
import NoticeCarousel from "./NoticeCarousel";
import { useGetNoticeRoutinesByCourseIdQuery } from "@/redux/services/noticeRoutineApi";
import Loading from "@/app/loading";
import Marquee from "react-fast-marquee";
import "animate.css";

const NoticeBoard = ({ courseId }) => {
  const { data: notices, isLoading } = useGetNoticeRoutinesByCourseIdQuery({
    courseId,
  });
  // console.log(notices);
  const today = new Date();

  const filteredNotices = notices?.data?.data?.filter((notice) => {
    const endDate = new Date(notice.endTime);
    return endDate >= today;
  });

  if (!notices || filteredNotices.length === 0) {
    return null;
  }
  const noticesData = filteredNotices;
  // console.log(noticesData);
  return (
    <div className="container mx-auto p-2 marquee-mobile">
      <div className="my-2 md:my-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-500 my-3 md:my-5">
          Announcements
        </h2>
        <Marquee>
          <div className="flex mx-2 md:mx-8 py-2 md:py-3">
            {noticesData.map((notice, index) => (
              <p key={index} className="mx-2 md:mx-4">
                <span className="text-sm md:text-lg text-red-700 animate__animated animate__flash">
                  {notice.description}
                </span>
              </p>
            ))}
          </div>
        </Marquee>
      </div>
      <NoticeCarousel notices={noticesData} />
    </div>
  );
};

export default NoticeBoard;
