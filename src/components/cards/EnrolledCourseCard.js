"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

export default function EnrolledCourseCard({ courseInfo }) {
  const router = useRouter();
  const { courseId, course } = courseInfo;

  const courseTitle = course?.productFullName?.replace(/\s+/g, "-") || "course";

  const queryParams = new URLSearchParams({
    title: courseTitle,
  }).toString();

  const courseUrl = `/course/${courseId}?${queryParams}`;

  const handleCardClick = () => {
    router.push(courseUrl);
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    router.push(courseUrl);
  };

  return (
    <Card
      sx={{ maxWidth: 345, height: 300 }}
      className="transition-transform duration-400 hover:shadow-lg hover:scale-[1.01] rounded-4xl flex flex-col justify-between cursor-pointer"
      onClick={handleCardClick}
    >
      <CardMedia
        sx={{ height: 160, objectFit: "contain" }}
        image={course?.ProductImage}
        title={course?.productFullName || "Course Image"}
        className="object-contain"
      />
      <CardContent className="flex-1">
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          className="line-clamp-2"
        >
          {course?.productFullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" className="truncate">
          Subject: {course?.SubCategory || "N/A"}
        </Typography>
      </CardContent>
      <CardActions className="flex justify-center items-center pb-2">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs rounded hover:rounded-full"
          onClick={handleButtonClick}
        >
          Start Class
        </button>
      </CardActions>
    </Card>
  );
}
