"use client";
import Featured from "@/components/featured/Featured";
import LiveSection from "@/components/live/LiveSection";
import NoticeBoard from "@/components/notice/NoticeBoard";
import HeaderTitle from "@/components/HeaderTitle";
import { HeroSection } from "@/components/cards/HeroSection";
import NewsletterForm from "@/components/NewsLetter";
import { StudentReviews } from "@/components/cards/StudentReview";
import CourseFeature from "@/components/course/CourseFeature";
import SubjectFeature from "@/components/subject/SubjectFeature";

export default function Home() {
  return (
    <div className="py-14 md:py-20">
      <HeaderTitle  />

      <div data-aos="fade-up" className="overflow-hidden w-full p-1 relative">
         <HeroSection /> 
      </div>
      <div>{/* <LiveSection /> */}</div>
   
      <div className="my-10 md:my-20">
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
