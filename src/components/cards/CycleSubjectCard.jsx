"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Card from "@mui/material/Card";
import { CardActionArea, CardContent, Typography } from "@mui/material";

function CycleSubjectCard({ subject }) {
  const imageUrl =
    subject?.cycleSubjectImage ||
    subject?.subject?.subjectImage ||
    "/img/aparsLogo.jpg";
  const title = subject?.subject?.title;
  const courseId = subject?.cycle?.course?.id;
  return (
    <Card
      sx={{
        maxWidth: 345,
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
      className="rounded-3xl mx-auto"
    >
      <Link
        href={{
          pathname: `/course/${courseId}/cycle-chapter/${subject?.id}`,
          query: {
            title,
          },
        }}
        passHref
      >
        <CardActionArea component="div" sx={{ height: "100%" }}>
          <div className="relative w-full h-[185px] bg-gray-100">
            <Image
              src={imageUrl}
              alt={title || "Subject image"}
              fill
              className="object-fill"
            />
          </div>
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {title}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}

export default CycleSubjectCard;
