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
        sx={{ maxWidth: 345, height: 350 }}
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

          {/* <div
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.9)",
              color: "#11dd18",
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
          <CourseSubCategoryPill subCategory={course?.SubCategory} />
        </CardContent>

        <CardActions className="flex justify-center items-center mb-3">
          {isEnrolled || isAdmin ? (
            <Link
              href={`/course/${course.id}`}
              className="bg-green-700 hover:bg-green-900 text-white px-4 py-2 rounded text-sm hover:rounded-full w-full text-center hover:font-bold"
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded text-xs hover:rounded-full hover:font-bold"
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
                className="access-now-btn border border-gray-400 hover:bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded hover:rounded-full hover:font-bold"
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
