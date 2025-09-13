"use client";
import React from "react";
import Link from "next/link";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
} from "@mui/material";

const CourseSimpleCard = (params) => {
  const course = params?.course || {};
  const imageUrl = course?.ProductImage || "/placeholder-image.png";
  return (
    <Card
      sx={{
        maxWidth: 360,
        borderRadius: 4,
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
        <CardActionArea sx={{ height: "100%" }}>
          {/* Course Image */}
          <CardMedia
            component="img"
            image={imageUrl}
            height="300"
            alt={course?.productFullName}
            sx={{
              objectFit: "fill",
              width: "100%",
              height: 220,
              backgroundColor: "#f5f5f5",
            }}
          />

          {/* Content */}
          <CardContent>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{ fontWeight: 600, fontSize: 14, mb: 2 }}
            >
              {course?.productFullName}
            </Typography>

            {/* Category + SubCategory */}
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

            {/* Enrollment Status */}
            <Box
              sx={{
                display: "flex",
                // justifyContent: "center",
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
                {course._count?.student ?? 0} Students
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default CourseSimpleCard;
