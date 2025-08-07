"use client";

import React from "react";
import Image from "next/image";
import thumImg from "../../../public/img/varsitycover.jpg";

export function HeroSection() {
  return (
    <div className="w-full overflow-hidden relative">
      <div className="relative h-[20rem] md:h-[40rem] w-[95vw] md:w-full max-w-screen-xl mx-auto overflow-hidden rounded-xl">
        <Image
          src={thumImg}
          alt="Hero Image"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}
