import BlurText from "@/blocks/TextAnimations/BlurText/BlurText";
import React from "react";

function HeaderTitle({ courseName }) {
  return (
    <div className="container mx-auto text-center py-4">
      <h1 className="flex  justify-center">
        <BlurText
          text={`Your Future Starts Here, ${courseName || "Apar's ClassRoom"}`}
          delay={150}
          animateBy="words"
          direction="down"
          className="inline-block text-2xl md:text-4xl font-bold text-center sm:p-3  md:p-4 text-blue-500 dark:text-blue-400 capitalize"
        />
      </h1>
    </div>
  );
}

export default HeaderTitle;
