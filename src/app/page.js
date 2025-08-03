"use client";
import Featured from "@/components/featured/Featured";
import LiveSection from "@/components/live/LiveSection";
import NoticeBoard from "@/components/notice/NoticeBoard";
import HeaderTitle from "@/components/HeaderTitle";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";
import CycleFeature from "@/components/cycle/CycleFeature";
import NewsletterForm from "@/components/NewsLetter";
import { HeroSection } from "@/components/cards/HeroSection";
import { StudentReviews } from "@/components/cards/StudentReview";

export default function Home() {
  const course = useSelector(selectCourse);

  return (
    <div className="py-14 md:py-20">
      <HeaderTitle courseName={course?.title} />

      <div data-aos="fade-up" className="overflow-hidden w-full p-1 relative">
        <HeroSection />
      </div>

      <div data-aos="fade-up">
        <LiveSection />
      </div>

      <div data-aos="fade-right" className="my-10 md:my-20">
        <NoticeBoard />
      </div>

      <div data-aos="zoom-in" className="my-10 md:my-20">
        <CycleFeature />
      </div>

      <div data-aos="fade-up">
        <Featured />
      </div>
      <div data-aos="fade-right">
        <StudentReviews />
      </div>
      {/* <div data-aos="fade-up"><NewsletterForm /></div> */}
    </div>
  );
}
