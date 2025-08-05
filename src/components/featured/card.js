"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const FeaturedCard = ({ feature }) => {
  const { id, title, description, imageUrl, link } = feature || {};

  return (
    <Link href={link || "#"} className="block rounded-lg shadow-md bg-white dark:bg-gray-800 overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      <div className="relative h-48 md:h-56">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{description}</p>
      </div>
    </Link>
  );
};

export default FeaturedCard;