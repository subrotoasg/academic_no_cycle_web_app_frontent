import React from "react";

const NewsletterForm = () => {
  return (
    <section className="w-4/5 rounded-xl mx-auto py-10 text-center md:text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-[50px] lg:gap-[20px] ">
        
        {/* Left Section - Heading and Description */}
        <div className="w-full "  >
          <h1 className="text-[2rem] dark:text-[#abc2d3] sm:text-[3rem] font-[500] capitalize text-text leading-[50px]">
            Stay Ahead in Learning!
          </h1>
          <p className="md:w-2/3  dark:text-slate-400 mt-3">
            Subscribe to our newsletter for the latest updates on courses, educational insights, and exclusive offers from Apars Classroom.
          </p>
        </div>

        {/* Right Section - Input Form */}
        <div className="w-full " >
          <form className="md:mt-12 relative">
            <input type="email" name="email" 
              placeholder="Enter your email address"
              className="w-full py-4 pl-4 dark:bg-transparent dark:placeholder:text-slate-500 dark:text-[#abc2d3] pr-[120px] outline-none focus:ring-0 border rounded-full border-[#578EEB]"
            />
            <button className="px-4 md:px-8 py-1 md:py-3 absolute top-0 right-0 h-full rounded-full rounded-tl-[0px] hover:bg-[#4A7ACB] bg-[#578EEB] text-white">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterForm;
