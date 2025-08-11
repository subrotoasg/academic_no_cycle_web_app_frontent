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
      sx={{ maxWidth: 345, height: 350 }}
      className="relative transition-transform duration-400 hover:shadow-lg hover:scale-[1.01] rounded-4xl flex flex-col justify-between cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Course Image and Enrolled Count */}
      <div style={{ position: "relative" }}>
        <CardMedia
          sx={{ height: 160, objectFit: "contain" }}
          image={course?.ProductImage}
          title={course?.productFullName || "Course Image"}
          className="object-contain"
        />

        {/* Locked overlay */}
        {!isEnrolled && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white rounded-4xl">
            <LockIcon sx={{ fontSize: 40, color: "" }} />

            <span className="mt-2 text-sm font-semibold">Locked</span>
          </div>
        )}

        <div
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
        </div>
      </div>

      {/* Course Info */}
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

      {/* Actions */}
      <CardActions className="flex justify-center items-center mb-3">
        {isEnrolled ? (
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm hover:rounded-full w-full text-center hover:font-bold"
            onClick={(e) => {
              e.stopPropagation();
              router.push(courseUrl);
            }}
          >
            View Course
          </button>
        ) : (
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded text-sm hover:rounded-full w-full text-center hover:font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            Enroll Now
          </a>
        )}
      </CardActions>
    </Card>
  );
}
