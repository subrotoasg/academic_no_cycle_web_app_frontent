"use client";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";

const CourseSimpleCard = (params) => {
  const course = params?.course || {};
  const imageUrl = course?.ProductImage || "/placeholder-image.png";
  return (
    <Card
      sx={{
        maxWidth: 345,
        height: 360,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        bgcolor: "background.paper",
        transition: "transform 0.3s, box-shadow 0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
      className="mx-auto"
    >
      <Link
        href={{
          pathname: `/course/${course?.id}`,
          query: { title: course?.productFullName },
        }}
        passHref
      >
        <div style={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{
              objectFit: "fill",
              width: "100%",
              height: 170,
              backgroundColor: "#f5f5f5",
            }}
            image={imageUrl}
            title={course?.productFullName || "Course Image"}
            alt={course?.productFullName}
          />
        </div>

        {/* Content */}
        <CardContent>
          <Tooltip title={course?.productFullName || ""} arrow>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              className="line-clamp-3 cursor-help"
              sx={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                height: 75,
                fontWeight: 500,
                fontSize: 16.5,
                mb: 1,
              }}
            >
              {course?.productFullName}
            </Typography>
          </Tooltip>

          {/* Category + SubCategory */}
          <div className="flex gap-1 items-center mt-3">
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Chip
                label={course?.Category}
                size="small"
                color="primary"
                variant="outlined"
              />
              {course?.SubCategory && (
                <Chip
                  label={course.SubCategory}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>
          </div>

          {/* Enrollment Status */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "success.main",
                fontWeight: 500,
              }}
            >
              Enrolled:
            </Typography>

            {/* Student Count */}
            <Typography variant="caption" color="text.secondary">
              {course?._count?.student ?? 0} Students
            </Typography>
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};

export default CourseSimpleCard;
