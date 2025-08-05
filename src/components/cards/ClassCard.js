// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import React from "react";
// import { FiArrowUpRight } from "react-icons/fi";

// function ClassCard({ content }) {
//   const {
//     id,
//     classTitle,
//     classNo,
//     thumbneil,
//     lectureSheet,
//     practiceSheet,
//     solutionSheet,
//   } = content || {};

//   return (
//     <Link
//       href={{
//         pathname: `/content/${id}`,
//         query: { title: classTitle },
//       }}
//       className="block group"
//     >
//       <div className="relative mx-auto w-64 md:w-72 h-60 max-w-md rounded-lg shadow-lg overflow-hidden bg-gray-900">
//         {/* Background Image */}
//         <Image
//           className="absolute w-full h-full object-covers transition-transform duration-500 ease-in-out group-hover:scale-110"
//           src={thumbneil}
//           alt={classTitle}
//           priority
//           width={400}
//           height={400}
//         />

//         <div className="absolute top-0 left-0 p-4">
//           <h3 className="text-white text-xl font-bold drop-shadow-lg">
//             Class {classNo}: {classTitle}
//           </h3>
//         </div>

//         <div
//           className="absolute inset-x-0 bottom-0 h-full p-6 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end
//                        translate-y-3/4 group-hover:translate-y-0 transition-transform duration-500 ease-in-out"
//         >
//           <div className="translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out delay-100">
//             {(lectureSheet || practiceSheet || solutionSheet) && (
//               <p className="text-sm text-gray-300 mb-3">Available materials:</p>
//             )}

//             <div className="flex flex-wrap gap-2 mb-4">
//               {lectureSheet && (
//                 <span className="px-2 py-1 text-xs font-semibold text-blue-100 bg-blue-600/70 rounded-full">
//                   Lecture
//                 </span>
//               )}
//               {practiceSheet && (
//                 <span className="px-2 py-1 text-xs font-semibold text-emerald-100 bg-emerald-600/70 rounded-full">
//                   Practice
//                 </span>
//               )}
//               {solutionSheet && (
//                 <span className="px-2 py-1 text-xs font-semibold text-purple-100 bg-purple-600/70 rounded-full">
//                   Solution
//                 </span>
//               )}
//             </div>

//             <div className="flex items-center text-white font-semibold group-hover:underline">
//               View Class
//               <FiArrowUpRight className="ml-1 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default ClassCard;

"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FiArrowUpRight } from "react-icons/fi";

function ClassCard({ content }) {
  const {
    id,
    classTitle,
    classNo,
    thumbneil,
    lectureSheet,
    practiceSheet,
    solutionSheet,
  } = content || {};

  return (
    <Link
      href={{
        pathname: `/content/${id}`,
        query: { title: classTitle },
      }}
      className="block w-60 md:w-72 max-w-xs mx-auto rounded-lg shadow-lg overflow-hidden bg-indigo-100 dark:bg-gray-900"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-40">
        <Image
          src={thumbneil || "/placeholder-image.png"}
          alt={classTitle}
          layout="fill"
          className="object-cover"
        />
      </div>
      {/* Class Title */}
      <div className="p-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Class {classNo}: {classTitle}
        </h3>
      </div>

      {/* Content Info */}
      <div className="p-2">
        {(lectureSheet || practiceSheet || solutionSheet) && (
          <p className="text-sm text-gray-500 dark:text-gray-300 mb-2">
            Available materials:
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {lectureSheet && (
            <span className="px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
              Lecture
            </span>
          )}
          {practiceSheet && (
            <span className="px-2 py-1 text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full">
              Practice
            </span>
          )}
          {solutionSheet && (
            <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
              Solution
            </span>
          )}
        </div>

        <div className="flex items-center text-blue-600 font-medium">
          View Class
          <FiArrowUpRight className="ml-1" />
        </div>
      </div>
    </Link>
  );
}

export default ClassCard;
