import Image from "next/image";
import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineEmail, MdPhone } from "react-icons/md";
import { TbWorldWww } from "react-icons/tb";
import Copyright from "./Copyright";
import { FaFacebookF } from "react-icons/fa";

const quickLinks = [
  { name: "Home", url: "/" },
  { name: "About Us", url: "https://aparsclassroom.com/about-us.html" },
  { name: "Privacy & Policy", url: "https://aparsclassroom.com/privacy" },
  // { name: "Report an Issue", url: "/report" },
  { name: "Terms & Conditions", url: "https://aparsclassroom.com/terms" },
];

const contactInfo = [
  {
    icon: <IoLocationOutline className="text-xl" />,
    text: "Dhaka, Bangladesh",
  },
  {
    icon: <MdPhone className="text-xl" />,
    text: "Help Line: +8809677005588",
    url: "tel:+8809677005588",
  },

  {
    icon: <FaFacebookF className="text-xl" />,
    text: "ACS Facebook Page",
    url: "https://www.facebook.com/Academy.of.Champion.Students",
  },
  {
    icon: <MdOutlineEmail className="text-xl" />,
    text: "tech@asgshop.ai",
    url: "mailto:tech@asgshop.ai",
  },
  {
    icon: <TbWorldWww className="text-xl" />,
    text: "www.aparsclassroom.com",
    url: "http://www.aparsclassroom.com",
  },
];

const Footer = () => {
  return (
    <footer className="w-full  text-white">
      <div className="p-10 flex justify-between gap-6 flex-col md:flex-row flex-wrap w-full backdrop-blur-sm bg-black/85">
        <div className="w-full sm:w-[30%] flex flex-col">
          <Image
            src="/logo.png"
            width={200}
            height={32}
            alt="Apars Classroom Logo"
          />
          <p className="mt-4 text-sm leading-relaxed">
            Apar&apos;s Classroom is committed to revolutionizing education
            through innovative learning solutions and expert guidance. Join us
            in building a brighter future for learners around the world.
          </p>
        </div>

        <div className="w-full sm:w-[25%]">
          <h3 className="text-[1.2rem]  font-semibold   mb-2">Quick Links</h3>
          <ul className="flex flex-col gap-3">
            {quickLinks.map((link, index) => (
              <li
                key={index}
                className="text-base  hover:text-[#1A73E8] cursor-pointer transition-all duration-300"
              >
                <a href={link.url}>{link.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full sm:w-[25%]">
          <h3 className="text-[1.2rem] font-semibold   mb-2">Contact Us</h3>
          <div className="flex flex-col gap-3   dark:text-slate-300">
            {contactInfo?.map((contact, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-base hover:text-[#1A73E8] transition-all duration-300 cursor-pointer"
              >
                <span>{contact.icon}</span>
                {contact.url ? (
                  <a
                    href={contact.url}
                    className="break-all hover:text-[#1A73E8]"
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
