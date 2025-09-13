import BlurText from "@/blocks/TextAnimations/BlurText/BlurText";
import React from "react";

function HeaderTitle() {
  return (
    <div className="container mx-auto text-center pt-4 pb-2">
      <h1 className="flex  justify-center">
        <BlurText
          text={`HSC Academic Achievement Programme 2025`}
          delay={50}
          animateBy="words"
          direction="down"
          className="inline-block text-xl sm:text-2xl md:text-4xl font-bold text-center sm:p-3  md:p-4 text-blue-500 dark:text-blue-400 capitalize"
        />
      </h1>
    </div>
  );
}

export default HeaderTitle;
