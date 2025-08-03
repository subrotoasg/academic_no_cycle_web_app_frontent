import Link from "next/link";
import React from "react";

function NotFound() {
  return (
   <main className="h-screen w-full flex flex-col justify-center items-center  dark:bg-black">
	<h1 className="text-9xl font-extrabold text-red-600 tracking-widest">404</h1>
	<div className="bg-blue-400 px-2 text-sm rounded rotate-12 absolute">
		Page Not Found
	</div>
	<button className="mt-5">
  <Link href="/">
      <div
        className="relative inline-block text-sm font-medium text-blue-400 group active:text-blue-500 focus:outline-none focus:ring"
      >
        <span
          className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-blue-400 group-hover:translate-y-0 group-hover:translate-x-0"
        ></span>

        <span className="relative block px-8 py-3 bg-[#1A2238] border border-current">
         Go Home
        </span>
      </div>
      </Link>
    </button>
</main>
  );
}

export default NotFound;
