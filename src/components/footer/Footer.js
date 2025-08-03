import Image from "next/image";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import Copyright from "./Copyright";

const quickLinks = [
  { name: "Home", url: "/" },
  { name: "About Us", url: "https://aparsclassroom.com/about-us.html" },
  { name: "Privacy & Policy", url: "https://aparsclassroom.com/privacy" },
  { name: "Report an Issue", url: "/report" },
  { name: "Terms & Conditions", url: "https://aparsclassroom.com/terms" },
];

const contactInfo = [
  {
    icon: <IoLocationOutline className="text-xl" />,
    text: "Dhaka, Bangladesh",
  },
  {
    icon: <MdOutlineEmail className="text-xl" />,
    text: "admin@aparsclassroom.com",
    url: "mailto:admin@aparsclassroom.com",
  },
  {
    icon: <TbWorldWww className="text-xl" />,
    text: "www.aparsclassroom.com",
    url: "http://www.aparsclassroom.com",
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-800 ">
      <div className="p-5 container px-5 sm:px-9 mx-auto flex justify-between gap-6 flex-col md:flex-row flex-wrap w-full ">
        <div className="w-full sm:w-[30%]">
          <Image
            src="/logo.png"
            width={200}
            height={32}
            alt="Apars Classroom Logo"
          />
          <p className="mt-4 text-sm dark:text-slate-500 text-[#333333] cursor-pointer transition-all duration-300 ease-in-out">
            Apar&apos;s Classroom is committed to revolutionizing education
            through innovative learning solutions and expert guidance. Join us
            in building a brighter future for learners around the world.
          </p>
        </div>

        <div className="w-full sm:w-[25%]">
          <h3 className="text-[1.2rem] dark:text-[#abc2d3] font-semibold text-[#424242] mb-2">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-3">
            {quickLinks.map((link, index) => (
              <li
                key={index}
                className="text-base dark:text-slate-500 text-[#333333] hover:text-[#1A73E8] dark:hover:text-[#1A73E8] cursor-pointer transition-all duration-300 ease-in-out"
              >
                <a href={link.url}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full sm:w-[25%]">
          <h3 className="text-[1.2rem] dark:text-[#abc2d3] font-semibold text-[#424242] mb-2">
            Contact Us
          </h3>
          <div className="flex flex-col gap-3 text-[#424242] dark:text-slate-400">
            {contactInfo.map((contact, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-base text-[#333333] dark:text-slate-500 hover:text-[#1A73E8] transition-all duration-300 ease-in-out cursor-pointer"
              >
                <span className="flex-shrink-0">{contact.icon}</span>
                {contact.url ? (
                  <a
                    href={contact.url}
                    className="hover:text-[#1A73E8] transition-all duration-300 ease-in-out break-all"
                  >
                    {contact.text}
                  </a>
                ) : (
                  <span className="break-all">{contact.text}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <Copyright />
      </div>
    </footer>
  );
};

export default Footer;
