import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function CourseCard({ course }) {
  return (
    <Link
      href={{
        pathname: `/cycles/${course?.id}`,
        query: { title: course?.productFullName },
      }}
    >
      <Card
        sx={{ maxWidth: 345, height: 350 }}
        className="transition-transform duration-400 hover:shadow-lg hover:scale-[1.05] rounded-4xl flex flex-col justify-between"
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
          <Typography
            variant="body2"
            color="text.secondary"
            className="truncate"
          >
            Category: {course?.Category || "N/A"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            className="truncate"
          >
            Subcategory: {course?.SubCategory || "N/A"}
          </Typography>
        </CardContent>
        <CardActions className="flex justify-center items-center pb-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded text-xs hover:rounded-full">
            Enroll Now
          </button>
          <button className="border border-gray-400 hover:bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded ml-2 hover:rounded-full">
            Access Now
          </button>
        </CardActions>
      </Card>
    </Link>
  );
}
