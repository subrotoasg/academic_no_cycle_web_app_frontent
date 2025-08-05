"use client";

import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "../ui/images-slider";
import Link from "next/link";
import { GiBrightExplosion } from "react-icons/gi";

export function HeroSection() {
  // const images = ["/buet.jpg", "/kuet.jpg", "/ruet.jpg", "/cuet.jpg"];
  const images = [
    "/img/ac1.webp",
    "/img/ac3.jpeg",
    "/img/ac4.webp",
    "/img/ac2.webp",
  ];

  return (
    <div className="w-full overflow-hidden relative">
      {" "}
      <ImagesSlider
        className="relative h-[20rem] md:h-[40rem] w-[95vw] md:w-full  max-w-screen-xl mx-auto overflow-hidden rounded-xl"
        images={images}
      >
        <motion.div
          style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          initial={{ opacity: 0, y: -80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-50 flex flex-col justify-center items-center bg-black/40 p-2 rounded-lg max-w-[90vw] text-center"
        >
          <motion.p className="font-bold  md:text-4xl lg:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 md:py-4 mb-2 break-words">
            Guiding Students Toward Success in University Admission Exams
          </motion.p>

          <button
            className="px-4 py-1 md:px-4 md:py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white rounded-full relative md:mt-4 
  hover:shadow-lg hover:bg-emerald-500/20 hover:border-emerald-500/30 transition duration-300 hover:scale-105 "
          >
            <Link
              target="_blank"
              href="https://aparsclassroom.com/shop/"
              className="font-medium flex justify-center items-center p-1 text-sm md:text-xl"
            >
              <GiBrightExplosion className="mr-2 md:mr-3 w-4 md:w-8 text-sm md:text-2xl text-red-500 " />
              Explore More{" "}
            </Link>
            <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
          </button>
        </motion.div>
      </ImagesSlider>
    </div>
  );
}
