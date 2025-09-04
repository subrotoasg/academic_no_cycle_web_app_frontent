"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { useUploadingLiveClassQuery } from "@/redux/services/liveClassApi";
import Image from "next/image";

const UploadingCard = (params) => {
  const { title, description, thumbnail, classNo } = params || {};
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group transition-transform">
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={thumbnail || "/gif/uploading.gif"}
          alt={title}
          className="object-fill"
          fill
        />

        {/* Overlay for uploading */}
        {thumbnail ? (
          <>
            <div className="absolute inset-0 bg-black/60 dark:bg-black/40 flex flex-col items-center justify-center space-y-3">
              <p className="text-white font-semibold text-lg tracking-wide animate-bounce">
                Uploading...
              </p>
            </div>{" "}
          </>
        ) : null}
      </div>

      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 line-clamp-1">
          Class {classNo} : {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
};

const UploadingClass = ({ subjectChapterId }) => {
  const { data: uploadedClassDatas, isLoading } = useUploadingLiveClassQuery(
    { subjectChapterId },
    { skip: !subjectChapterId }
  );

  const uploadingClassDatas = uploadedClassDatas?.data || [];

  return (
    <>
      {uploadingClassDatas?.length > 0 ? (
        <div className="p-4">
          <h3 className="md:text-2xl font-semibold my-7 text-indigo-500">
            Uploading Class
          </h3>
          {/* Responsive Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {uploadingClassDatas?.map((cls) => (
              <UploadingCard
                key={cls?.id}
                title={cls?.title}
                description={cls?.description}
                thumbnail={cls?.thumbnail}
                classNo={cls?.vimeo}
              />
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default UploadingClass;
