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

      <div data-aos="fade-up" className="overflow-hidden w-full p-1 ">
        <HeroSection />
      </div>

      <div className="my-14">
        <CourseFeature />
      </div>

      <div data-aos="fade-down">
        <StudentReviews />
      </div>
      {/* <div data-aos="fade-up" >
        <NewsletterForm />
      </div> */}
    </div>
  );
}
