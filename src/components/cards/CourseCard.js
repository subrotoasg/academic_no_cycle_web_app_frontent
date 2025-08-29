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

export default function CourseCard({ course }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const permalink = course?.Permalink;
  const user = useSelector(currentUser);

  const isEnrolled = course?.isEnrolled === true;
  const isAdmin = user?.role === "admin";

  const handleCardClick = () => {
    if (isEnrolled || isAdmin) {
      window.location.href = `/course/${course.id}`;
    } else if (permalink) {
      window.open(permalink, "_blank");
    }
  };
  return (
    <>
      {" "}
      <Card
        sx={{ maxWidth: 345, height: 380 }}
        className="transition-transform duration-400 hover:shadow-lg hover:scale-[1.01] rounded-4xl flex flex-col justify-between"
        onClick={handleCardClick}
      >
        <div style={{ position: "relative" }}>
          <CardMedia
            sx={{ height: 160, objectFit: "contain" }}
            image={course?.ProductImage}
            title={course?.productFullName || "Course Image"}
            className="object-contain"
          />
          {/* 
          <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              color: "#36f23c",
              padding: "2px 8px",
              borderRadius: 12,
              fontSize: 12,
              fontWeight: "bold",
              pointerEvents: "none",
              userSelect: "none",
              minWidth: 30,
              textAlign: "center",
            }}
            title="Enrolled Students"
          >
            {course?._count?.student ?? 0} Enrolled
          </div> */}
        </div>
        <CardContent className="flex-1 text-xl">
          <Tooltip title={course?.productFullName || ""} arrow>
            <Typography
              gutterBottom
              component="div"
              className="line-clamp-3 cursor-help"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                height: 70,
              }}
            >
              {course?.productFullName}
            </Typography>
          </Tooltip>

          <div
            style={{
              display: "flex",
              gap: "4px",
              justifyContent: "center",
              marginTop: 1,
              alignItems: "center",
            }}
          >
            <CourseSubCategoryPill subCategory={course?.SubCategory} />
            <CourseEnrolledPill count={course?._count?.student} />
          </div>
        </CardContent>

        <CardActions className="flex justify-center items-center mb-3">
          {isEnrolled || isAdmin ? (
            <Link
              href={`/course/${course.id}`}
              // className="bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded text-sm hover:rounded-full w-full text-center hover:font-bold"
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
              focus:ring-1 focus:ring-offset-2 focus:ring-gray-400
            "
              onClick={(e) => e.stopPropagation()}
            >
              View Course
            </Link>
          ) : (
            <>
              <a
                href={permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-indigo-800 to-indigo-500 hover:from-indigo-400 hover:to-indigo-700 hover:bg-blue-700 text-white px-2 py-2 rounded-lg   transition
                transform text-xs hover:rounded-full font-bold hover:scale-105
                hover:shadow-xl
                focus:outline-none
                focus:ring-1 focus:ring-offset-1 focus:ring-gray-400"
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
                className="
                access-now-btn
                text-white
                bg-gradient-to-r from-blue-800 to-blue-500
                hover:from-blue-500 hover:to-blue-800
                shadow-lg
                text-xs
                px-4 py-2
                rounded-lg
                font-bold
                transition
                transform
                hover:rounded-full
                hover:scale-105
                hover:shadow-xl
                focus:outline-none
                focus:ring-1 focus:ring-offset-1 focus:ring-gray-400
              "
              >
                Access Now
              </button>
            </>
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
          {" "}
          <CourseAccessForm setIsModalOpen={setIsModalOpen} />
        </div>
      </Modal>
    </>
  );
}
