"use client";

import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";
import { useRouter } from "next/navigation";
import { Tooltip } from "@mui/material";
import CourseSubCategoryPill from "../admin/utilities/CourseSubjectCategoryPill";
import CourseEnrolledPill from "../admin/utilities/CourseEnrolledPill";

export default function DashboardCourseCard({ course }) {
  const router = useRouter();
  const isEnrolled = course?.isEnrolled === true;
  const permalink = course?.Permalink;
  const courseTitle = course?.productFullName?.replace(/\s+/g, "-") || "course";
  const courseUrl = `/course/${course?.id}?title=${courseTitle}`;

  const handleCardClick = () => {
    if (isEnrolled) {
      router.push(courseUrl);
    } else if (permalink) {
      window.open(permalink, "_blank");
    }
  };

  return (
    <Card
      sx={{ maxWidth: 345, height: 380 }}
      className="relative transition-transform duration-400 hover:shadow-lg hover:scale-[1.01] rounded-4xl flex flex-col justify-between cursor-pointer mx-auto"
      onClick={handleCardClick}
    >
      <div style={{ position: "relative" }}>
        <CardMedia
          component="img"
          image={course?.ProductImage}
          title={course?.productFullName || "Course Image"}
          sx={{ objectFit: "fill", width: "100%", height: 180 }}
        />

        {!isEnrolled && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
            <LockIcon sx={{ fontSize: 40, color: "" }} />

            <span className="mt-2 text-sm font-semibold">Locked</span>
          </div>
        )}

        {/* <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(0,0,0,0.9)",
            color: "#30ed37",
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

      <CardActions className="flex justify-center items-center mb-2">
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="
  bg-gradient-to-r from-blue-600 to-indigo-500
  hover:from-blue-500 hover:to-indigo-700
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
          Enroll Now
        </a>
      </CardActions>
    </Card>
  );
}
