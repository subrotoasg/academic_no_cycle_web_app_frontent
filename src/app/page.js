"use client";

import HeaderTitle from "@/components/HeaderTitle";
import { HeroSection } from "@/components/cards/HeroSection";
import NewsletterForm from "@/components/NewsLetter";
import { StudentReviews } from "@/components/cards/StudentReview";
import CourseFeature from "@/components/course/CourseFeature";

export default function Home() {
  return (
    <div className="py-14 md:py-20">
      <HeaderTitle />
      <div className="mb-14 mt-5">
        <CourseFeature />
      </div>
    </div>
  );
}
