"use client";

import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Image from "next/image";

const NoticeCarousel = ({ notices }) => {
  return (
    <div className="w-full mx-auto max-w-4xl mt-3 md:mt-5">
      <Carousel
        showArrows={true}
        autoPlay
        infiniteLoop
        showIndicators={false}
        showThumbs={false}
        stopOnHover
      >
        {notices.map((notice, index) => (
          <div key={index}>
            <p className="p-2 font-medium text-xs md:text-lg dark:text-white">
              {notice.title}
            </p>
            <div className="w-full h-60 sm:h-72 md:h-96 lg:h-[500px] xl:h-[600px] bg-black flex items-center justify-center rounded-2xl overflow-hidden">
              <Image
                src={notice?.image}
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
