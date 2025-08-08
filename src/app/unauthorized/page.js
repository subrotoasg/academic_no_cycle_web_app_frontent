import Link from "next/link";
import React from "react";

function componentName() {
  return (
    <div>
      <div className="container mx-auto pt-28">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
          <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You dont have access to this course. Please purchase the course to
            view its content.
          </p>
          <Link
            href="https://aparsclassroom.com/shop/"
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            target="_blank"
          >
            Visit Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

export default componentName;
