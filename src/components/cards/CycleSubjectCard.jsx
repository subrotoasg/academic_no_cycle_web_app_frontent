"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

function CycleSubjectCard({ subject }) {
  const imageUrl = subject?.subject?.subjectImage || "/img/aparsLogo.jpg";
  const courseId = subject?.cycle?.course?.id;
  return (
    <Link
      href={{
        pathname: `/course/${courseId}/cycle-chapter/${subject?.id}`,
        query: {
          title: subject?.subject?.title,
        },
      }}
      className="block rounded-xl overflow-hidden shadow-md hover:scale-102 bg-gray-600"
    >
      <div className="p-2">
        <h3 className="text-xl font-semibold text-white ">
          {subject?.subject?.title}
        </h3>
      </div>
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={subject?.subject?.title || "subject image"}
          layout="fill"
          loading="lazy"
          className="object-fit rounded-b-xl"
        />
      </div>
    </Link>
  );
}

export default CycleSubjectCard;
