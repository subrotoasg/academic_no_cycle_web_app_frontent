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
        query: { title: course?.title },
      }}
    >
      <Card
        sx={{ maxWidth: 345 }}
        className="transition-transform duration-400 hover:shadow-lg hover:scale-[1.1] rounded-4xl"
      >
        <CardMedia
          sx={{ height: 140 }}
          image={course?.cycleImage}
          title="course image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {course?.title}
          </Typography>
        </CardContent>
        <CardActions className="flex justify-center items-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded text-xs hover:rounded-full">
            Enroll Now
          </button>
          <button className="border border-gray-400 hover:bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded ml-2 hover:rounded-full">
            Access Now
          </button>{" "}
        </CardActions>
      </Card>
    </Link>
  );
}
