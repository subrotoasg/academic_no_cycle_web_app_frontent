"use client";

import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { GiBrightExplosion } from "react-icons/gi";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="w-full overflow-hidden relative">
      <div className="relative h-[20rem] md:h-[40rem] w-[95vw] md:w-full max-w-screen-xl mx-auto overflow-hidden rounded-xl">
        <Image
          // src="https://i.postimg.cc/Nfz5TN4Q/Varsity-GST-Thumbnail.jpg"
          src="/img/varsity-gst-thumbnail.jpg"
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}