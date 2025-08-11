"use client";
import React, { useEffect } from "react";
import FeaturedCard from "../cards/FeaturedCard";
import { useGetFeaturesByCourseIdQuery } from "@/redux/services/featuredApi";

import "aos/dist/aos.css";

const Featured = ({ courseId }) => {
  const { data: featureData, isLoading } = useGetFeaturesByCourseIdQuery({
    courseId,
  });

  if (!featureData || featureData?.data?.data?.length === 0) {
    return null;
  }

  const features = featureData?.data?.data;
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-blue-500 animate__animated animate__slideInDown">
          Featured Highlights
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 my-8 animate__animated animate__fadeIn animate__delay-1s">
          Discover our latest offers, exciting new features, and exclusive
          discounts
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2">
        {features.map((feature, index) => (
          <div key={feature.id} data-aos="fade-up" data-aos-delay={index * 250}>
            <FeaturedCard feature={feature} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
