"use client";

import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import liveImage from "../../../public/liveClass.jpg";

const classInfo = {
  title: "Physics Vector-2",
  teacherName: "Numeri Sattar Apar",
};

const startTime = new Date(2025, 5, 18, 14, 30, 0);
const LiveSection = () => {
  const { title, teacherName } = classInfo;

  const [isLive, setIsLive] = useState(() => new Date() >= startTime);

  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const formatNumber = (number) => number.toString().padStart(2, "0");

  useEffect(() => {
    if (isLive) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const difference = Math.max(0, startTime.getTime() - now.getTime());

      if (difference > 0) {
        setRemainingTime({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setIsLive(true);
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="container mx-auto pt-15">
      <div className="text-xl md:text-3xl font-semibold text-blue-500 text-center">
        <p>
          🚀 {title} by {teacherName}
        </p>
      </div>

      {!isLive && (
        <div className="flex justify-center mt-4">
          <div className="grid grid-cols-4 gap-4 md:gap-8 p-4 max-w-sm">
            {/* Days */}
            <div className="text-center">
              <div className="text-[2.2rem] leading-[38px] font-bold text-[#17b4d3]">
                {formatNumber(remainingTime.days)}
              </div>
              <div className="text-[0.7rem] uppercase text-gray-500">Days</div>
            </div>
            {/* Hours */}
            <div className="text-center">
              <div className="text-[2.2rem] leading-[38px] font-bold text-[#17b4d3]">
                {formatNumber(remainingTime.hours)}
              </div>
              <div className="text-[0.7rem] uppercase text-gray-500">Hours</div>
            </div>
            {/* Minutes */}
            <div className="text-center">
              <div className="text-[2.2rem] leading-[38px] font-bold text-[#17b4d3]">
                {formatNumber(remainingTime.minutes)}
              </div>
              <div className="text-[0.7rem] uppercase text-gray-500">
                Minutes
              </div>
            </div>
            {/* Seconds */}
            <div className="text-center">
              <div className="text-[2.2rem] leading-[38px] font-bold text-[#17b4d3]">
                {formatNumber(remainingTime.seconds)}
              </div>
              <div className="text-[0.7rem] uppercase text-gray-500">
                Seconds
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center py-3 md:py-5">
        <div className="relative w-11/12 md:w-1/2 h-auto">
          {isLive ? (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-bold animate-pulse">
              🔴 Live Now
            </div>
          ) : (
            <div className="absolute top-2 left-2 bg-blue-800 text-white px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-bold">
              📅 Scheduled
            </div>
          )}

          <Image
            src={liveImage}
            alt="Class Thumbnail"
            layout="responsive"
            width={1000}
            height={600}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default LiveSection;
