"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { Modal } from "antd";
import CourseAccessForm from "../form/CourseAccessForm";
import { useSelector } from "react-redux";
import { currentUser } from "@/redux/Features/authentication";
import CourseSubCategoryPill from "../admin/utilities/CourseSubjectCategoryPill";
import { Tooltip } from "@mui/material";
import CourseEnrolledPill from "../admin/utilities/CourseEnrolledPill";

export default function CycleCard(params) {
  const cycle = params?.cycle;
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const permalink = cycle?.course?.Permalink || "https://www.apars.shop/shop/";
  const user = useSelector(currentUser);
  const isEnrolled = cycle?.isEnrolled;
  const isAdmin = user?.role === "admin";

  const handleCardClick = () => {
    if (isEnrolled || isAdmin) {
      window.location.href =
        `/course/${cycle?.course?.id}/subject/${cycle?.id}` || "/";
    } else if (permalink) {
      window.open(permalink, "_blank");
    }
  };
  return (
    <>
      <Card
        sx={{ maxWidth: 345, height: 380 }}
        className="transition-all duration-300 ease-out hover:scale-[1.01] hover:shadow-xl hover:-translate-y-1 rounded-2xl flex flex-col justify-between cursor-pointer"
        onClick={handleCardClick}
      >
        <div style={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{ objectFit: "fill", width: "100%", height: 170 }}
            image={cycle?.cycleImage || "/img/aparsLogo.jpg"}
            title={cycle?.productFullName || "Course Image"}
          />
        </div>
        <CardContent className="flex-1 text-xl">
          <Tooltip title={cycle?.productFullName || ""} arrow>
            <Typography
              gutterBottom
              component="div"
              className="line-clamp-3 text-justify"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                textAlign: "justify",
                textJustify: "inter-word",
                hyphens: "auto",
                wordBreak: "break-word",
              }}
            >
              {cycle?.course?.productFullName}
            </Typography>
          </Tooltip>
          <Typography
            gutterBottom
            component="div"
            className="cursor-help text-center text-green-700 font-semibold"
          >
            {cycle?.title}
          </Typography>

          <div className="flex gap-1 justify-center items-center mt-2">
            <CourseSubCategoryPill subCategory={cycle?.course?.SubCategory} />
            <CourseEnrolledPill count={cycle?._count?.student} />
          </div>
        </CardContent>

        <CardActions className="flex justify-center items-center mb-3">
          {isEnrolled || isAdmin ? (
            <Link
              href={`/course/${cycle?.course?.id}/subject/${cycle?.id}`}
              className="
              bg-gradient-to-r from-green-900 to-green-700
              hover:from-green-700 hover:to-green-900
              text-white
              px-4 py-2
              rounded-lg
              w-full
              text-center
              text-sm
              font-semibold
              shadow-md
              transition
              transform
              hover:scale-105
              hover:rounded-full
              hover:shadow-xl
              hover:font-bold
              focus:outline-none
              cursor-pointer
              focus:ring-1 focus:ring-offset-2 focus:ring-gray-400
            "
              onClick={(e) => e.stopPropagation()}
            >
              View Course
            </Link>
          ) : (
            <div className="flex w-full gap-2 ">
              <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-1/2  bg-gradient-to-r from-indigo-800 to-indigo-500 hover:from-indigo-400 hover:to-indigo-700 hover:bg-blue-700 text-white px-2 py-2 rounded-lg   transition
                transform text-xs hover:rounded-full font-bold hover:scale-105
                hover:shadow-xl
                focus:outline-none
                cursor-pointer
                focus:ring-1 focus:ring-offset-1 focus:ring-gray-400 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                Enroll Now
              </a>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const isAuthenticated = !!user;
                  if (isAuthenticated) {
                    setIsModalOpen(true);
                  } else {
                    window.location.href = "/login";
                  }
                }}
                className="w-1/2
                text-white
                bg-gradient-to-r from-blue-800 to-blue-500
                hover:from-blue-500 hover:to-blue-800
                shadow-lg
                text-xs
                px-2 py-2
                rounded-lg
                font-bold
                transition
                transform
                cursor-pointer
                hover:rounded-full
                hover:scale-105
                hover:shadow-xl
                focus:outline-none
                focus:ring-1 focus:ring-offset-1 focus:ring-gray-400
                text-center
              "
              >
                Access Now
              </button>
            </div>
          )}
        </CardActions>
      </Card>
      {/* Modal for access code */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        destroyOnHidden
      >
        <div className="pt-5">
          <CourseAccessForm setIsModalOpen={setIsModalOpen} />
        </div>
      </Modal>
    </>
  );
}
