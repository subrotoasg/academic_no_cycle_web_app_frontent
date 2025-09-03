import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/autoplay";
import VideoCard from "../videoCard/videoCard";

const VideoCarousel = ({ videos, title, setSelectedClass }) => {
  const carouselId = title?.toLowerCase().replace(/[\sঃ]/g, "-");
  const swiperRef = useRef(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiperInstance = swiperRef.current.swiper;

      if (prevBtnRef.current) {
        prevBtnRef.current.classList.toggle(
          "swiper-button-disabled",
          swiperInstance.isBeginning
        );
      }
      if (nextBtnRef.current) {
        nextBtnRef.current.classList.toggle(
          "swiper-button-disabled",
          swiperInstance.isEnd
        );
      }
    }
  }, [videos]);
  return (
    <div className="my-8 px-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            {title}
          </h2>
          {videos?.length > 0 && (
            <div className="flex space-x-3">
              <button
                className={`${carouselId}-prev rounded-full p-2 cursor-pointer bg-white dark:bg-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Previous slide"
              >
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                className={`${carouselId}-next rounded-full p-2 cursor-pointer bg-white dark:bg-gray-700 shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Next slide"
              >
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {videos?.length > 0 ? (
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 22,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
            }}
            navigation={{
              prevEl: `.${carouselId}-prev`,
              nextEl: `.${carouselId}-next`,
              disabledClass: "swiper-button-disabled",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            className="pb-12"
            onReachBeginning={() => {
              document
                .querySelector(`.${carouselId}-prev`)
                ?.classList.add("swiper-button-disabled");
            }}
            onReachEnd={() => {
              document
                .querySelector(`.${carouselId}-next`)
                ?.classList.add("swiper-button-disabled");
            }}
            onSlideChange={(swiper) => {
              const prevBtn = document.querySelector(`.${carouselId}-prev`);
              const nextBtn = document.querySelector(`.${carouselId}-next`);

              if (swiper.isBeginning) {
                prevBtn?.classList.add("swiper-button-disabled");
              } else {
                prevBtn?.classList.remove("swiper-button-disabled");
              }

              if (swiper.isEnd) {
                nextBtn?.classList.add("swiper-button-disabled");
              } else {
                nextBtn?.classList.remove("swiper-button-disabled");
              }
            }}
          >
            {videos?.map((video) => (
              <SwiperSlide key={`${video?.id}`}>
                <VideoCard video={video} setSelectedClass={setSelectedClass} />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              কোনো ক্লাস পাওয়া যায়নি
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCarousel;
