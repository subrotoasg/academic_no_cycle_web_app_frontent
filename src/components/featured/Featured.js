"use client";
import React, { useEffect } from "react";
import FeaturedCard from "../cards/FeaturedCard";
import {
  useGetFeaturesByCourseIdQuery,
  useGetFeaturesByCycleIdQuery,
} from "@/redux/services/featuredApi";

import "aos/dist/aos.css";
import LoadingData from "../common/LoadingData";

const Featured = ({ id, type = "course" }) => {
  const { data: courseFeatures, isLoading: isCourseFeatureLoading } =
    useGetFeaturesByCourseIdQuery(
      { courseId: id },
      { skip: type !== "course" }
    );

  const { data: cycleFeatures, isLoading: isCycleFeatureLoading } =
    useGetFeaturesByCycleIdQuery({ courseId: id }, { skip: type !== "cycle" });

  const featureData = type === "course" ? courseFeatures : cycleFeatures;
  const isLoading =
    type === "course" ? isCourseFeatureLoading : isCycleFeatureLoading;

  if (isLoading) {
    return <LoadingData />;
  }
  if (!featureData || featureData?.data?.data?.length === 0) {
    return null;
  }

  const features = featureData?.data?.data;
  return (
    <div className="container mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-3xl font-bold text-indigo-500">
          Featured Highlights
        </h2>
        <p className="text-xs md:text-lg text-gray-600 dark:text-gray-300 my-4 max-w-xl mx-auto">
          Stay ahead with our latest features, exclusive learning packages,
          limited-time discounts, and special coupon codes
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5 p-2">
        {features?.map((feature, index) => (
          <div key={feature.id}>
            <FeaturedCard feature={feature} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Featured;
