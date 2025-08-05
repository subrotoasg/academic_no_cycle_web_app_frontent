"use client";
import React from "react";

function Copyright() {
  return (
    <footer className="w-full grid grid-cols-1 md:grid-cols-2   pt-6  border-t border-gray-200">
      <p className=" text-center  md:text-left">
        Copyright © 2018–{new Date().getFullYear()} Apars Classroom. All Rights
        Reserved.
      </p>
      <p className="text-sm text-center  md:text-right">
        {" "}
        Developed by
        <a
          href="https://aparsclassroom.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#578EEB] hover:underline ps-1"
        >
          Apar&apos;s Classroom
        </a>
      </p>
    </footer>
  );
}

export default Copyright;
