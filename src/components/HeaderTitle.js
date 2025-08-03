import React from "react";
import SplitText from "./blocks/TextAnimations/SplitText/SplitText";

function HeaderTitle({ courseName }) {
  return (
    <div className="container mx-auto text-center py-4">
      <SplitText
        text={`${
          courseName ? `${courseName} Web App` : "Apar's ClassRoom Web App"
        }`}
        className="inline-block text-2xl md:text-4xl font-bold text-center sm:p-3  md:p-4 text-blue-500 dark:text-blue-400 capitalize"
        delay={150}
        animationFrom={{ opacity: 0, transform: "translate3d(0,50px,0)" }}
        animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
        easing="easeOutCubic"
        threshold={0.2}
        rootMargin="-50px"
      />
    </div>
  );
}

export default HeaderTitle;
