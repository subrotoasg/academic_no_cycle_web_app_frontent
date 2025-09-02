"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

const SubjectCard = ({ courseSubject }) => {
  const imageUrl =
    courseSubject?.courseSubjectImage ||
    courseSubject?.subject?.subjectImage ||
    "/placeholder-image.png";

  const title = courseSubject?.subject?.title;
  const courseId = courseSubject?.course?.id;
  return (
    <Card
      sx={{
        maxWidth: 345,
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
      className="rounded-3xl"
    >
      <Link
        href={{
          pathname: `/course/${courseId}/subject/${courseSubject?.id}`,
          query: { title },
        }}
        passHref
      >
        <CardActionArea component="div" sx={{ height: "100%" }}>
          <CardMedia
            component="img"
            image={imageUrl}
            alt={title}
            sx={{
              objectFit: "fill",
              width: "100%",
              height: 160,
              backgroundColor: "#f5f5f5",
            }}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
};

export default SubjectCard;
