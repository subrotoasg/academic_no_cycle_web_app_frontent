"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";
import {
  useGetNoticeRoutinesByCourseIdQuery,
  useGetNoticeRoutinesByCycleCourseIdQuery,
} from "@/redux/services/noticeRoutineApi";
import LoadingData from "../common/LoadingData";

const NoticeCarousel = ({ courseId }) => {
  const { data: noticesData, isLoading } =
    useGetNoticeRoutinesByCycleCourseIdQuery({
      courseId,
    });
  const today = new Date();

  const filteredNotices = noticesData?.data?.data?.filter((notice) => {
    const endDate = new Date(notice.endTime);
    return endDate >= today;
  });

  if (!noticesData || filteredNotices.length === 0) {
    return null;
  }
  const notices = filteredNotices;
  return (
    <div className="w-full mt-3 md:mt-5 px-2 md:px-4 ">
      <h2 className="text-xl md:text-3xl font-bold text-center text-indigo-500 my-3 md:my-8">
        তোমার শিক্ষকের বার্তা
      </h2>
      <Carousel
        showArrows={true}
        autoPlay
        infiniteLoop
        showIndicators={false}
        showThumbs={false}
        stopOnHover
      >
        {notices?.map((notice, index) => (
          <div key={index}>
            {/* <p className="p-2 font-medium text-xs md:text-lg dark:text-white">
              {notice.title}
            </p> */}
            <div className="w-full h-60 sm:h-72 md:h-96 lg:h-[500px] xl:h-[600px] bg-black flex items-center justify-center rounded-2xl overflow-hidden">
              <Image
                src={notice?.image || "/img/aparsLogo.jpg"}
                alt={`Notice ${index + 1}`}
                width={800}
                height={600}
                className="object-fill w-full h-full"
              />
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default NoticeCarousel;
