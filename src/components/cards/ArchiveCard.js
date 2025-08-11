// "use client";

// import { grantArchiveAccess } from "@/redux/Features/archiveAccess";
// import Image from "next/image";
// import Link from "next/link";
// import { useDispatch } from "react-redux";

// export default function ArchiveCourseCard({ archiveData }) {
//   const dispatch = useDispatch();
//   if (!archiveData?.data) return null;

//   const { id, ProductImage, productFullName } = archiveData.data;

//   return (
//     <div
//       data-aos="fade-up"
//       className="transition-transform transform hover:scale-105 cursor-pointer bg-gray-100 rounded-lg shadow-md overflow-hidden"
//       style={{ maxWidth: 320 }}
//     >
//       <Link
//         href={`/course/${id}`}
//         className="block"
//         onClick={() => dispatch(grantArchiveAccess(archiveData.data.id))}
//       >
//         {/* Image Section */}
//         <div className="relative h-44 w-full overflow-hidden rounded-t-lg bg-white">
//           <Image
//             src={ProductImage}
//             alt={productFullName || "Archived Course Image"}
//             className="object-fill w-full h-full"
//             loading="lazy"
//             height={200}
//             width={300}
//           />
//         </div>

//         {/* Content Section */}
//         <div className="p-4">
//           <h4
//             className="text-lg font-semibold mb-2 text-blue-700 line-clamp-2"
//             title={productFullName}
//           >
//             Archive: {productFullName}
//           </h4>
//         </div>
//       </Link>
//     </div>
//   );
// }

"use client";

import { grantArchiveAccess } from "@/redux/Features/archiveAccess";
import { useDispatch } from "react-redux";
import Link from "next/link";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

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
      data-aos="fade-up"
      className="rounded-3xl"
    >
      <Link
        href={`/course/${id}`}
        passHref
        onClick={() => dispatch(grantArchiveAccess(id))}
      >
        <CardActionArea component="div" sx={{ height: "100%" }}>
          {/* Image Section */}
          <CardMedia
            component="img"
            height="180"
            image={ProductImage}
            alt={productFullName || "Archived Course Image"}
            sx={{
              height: 160,
              objectFit: "cover",
              backgroundColor: "#f5f5f5",
            }}
          />

          {/* Title Section */}
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
