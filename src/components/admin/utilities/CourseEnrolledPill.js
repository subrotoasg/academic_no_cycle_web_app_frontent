import { Chip } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";

export default function CourseEnrolledPill({ count }) {
  return (
    // <div
    //   style={{
    //     display: "flex",
    //     justifyContent: "center",
    //     margin: "2px 0",
    //   }}
    // >

    <Chip
      icon={<PeopleIcon />}
      label={`${count ?? 0} Enrolled`}
      size="small"
      variant="filled"
      sx={{
        bgcolor: "#2d2d2d",
        color: "#36f23c",
        fontWeight: 600,
        textTransform: "capitalize",
        height: 22,
        fontSize: 11,
        borderRadius: 16,
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        },
        // paddingLeft: 2,
        // paddingRight: 2,
        px: 1,
        display: "inline-flex",
        alignItems: "center",
        width: "auto",
        maxWidth: "100%",
        "& .MuiChip-icon, & .MuiChip-iconSmall": {
          color: "#fff",
          fontSize: 12,
          // marginLeft: 1,
          marginRight: 1,
        },
        "& .MuiChip-label": {
          paddingLeft: 0,
          paddingRight: 0,
          whiteSpace: "nowrap",
        },
      }}
    />
    // </div>
  );
}
