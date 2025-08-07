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

export default function CourseCard({ course }) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const permalink = course?.Permalink;
  const user = useSelector(currentUser);
  const handleCardClick = () => {
    if (permalink) {
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
          <a
            href={permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-2 rounded text-xs hover:rounded-full"
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
            className="access-now-btn border border-gray-400 hover:bg-gray-100 text-gray-700 text-xs px-4 py-2 rounded hover:rounded-full"
          >
            Access Now
          </button>
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
