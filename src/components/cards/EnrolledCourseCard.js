"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function EnrolledCourseCard({ courseInfo }) {
  // console.log(courseInfo);
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
      // sx={{ maxWidth: 345, height: 360, position: "relative" }}
      className="transition-transform duration-400 hover:shadow-lg hover:scale-[1.01] rounded-4xl flex flex-col justify-between cursor-pointer mx-auto"
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        sx={{ objectFit: "fill", width: "100%", height: 180 }}
        image={course?.ProductImage}
        title={course?.productFullName || "Course Image"}
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
          {course?.SubCategory || "N/A"}
        </Typography>
      </CardContent>
      <CardActions className="flex justify-center items-center pb-2">
        <button
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
                  hover:scale-103
                  hover:rounded-full
                  hover:shadow-xl
                  hover:font-bold
                  focus:outline-none
                  focus:ring-1 focus:ring-offset-2 focus:ring-gray-400
                  cursor-pointer
                "
          onClick={handleButtonClick}
        >
          View Course
        </button>
      </CardActions>
    </Card>
  );
}
