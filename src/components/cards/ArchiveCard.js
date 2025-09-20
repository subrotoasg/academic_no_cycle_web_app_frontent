"use client";

import { grantArchiveAccess } from "@/redux/Features/archiveAccess";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import archiveImg from "../../../public/img/arch.jpg";

export default function ArchiveCourseCard({ archiveData }) {
  const dispatch = useDispatch();
  if (!archiveData?.data) return null;

  const { id, ProductImage, productFullName } = archiveData.data;

  return (
    <Card
      sx={{
        maxWidth: 345,
        transition: "transform 0.3s",
        "&:hover": { transform: "scale(1.01)" },
      }}
      className="rounded-3xl mx-auto"
    >
      <Link
        href={`/course/${id}`}
        passHref
        onClick={() => dispatch(grantArchiveAccess(id))}
      >
        <CardActionArea component="div" sx={{ height: "100%" }}>
          <CardMedia
            component="img"
            image={archiveImg?.src}
            alt={productFullName || "Archived Course Image"}
            sx={{
              objectFit: "fill",
              width: "100%",
              height: 185,
              backgroundColor: "#f5f5f5",
            }}
          />

          <CardContent>
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              title={productFullName}
            >
              Archive
            </Typography>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  );
}
