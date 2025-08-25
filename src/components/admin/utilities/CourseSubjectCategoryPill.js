import { Chip, Typography } from "@mui/material";
import CalculateIcon from "@mui/icons-material/Calculate";
import BoltIcon from "@mui/icons-material/Bolt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ScienceIcon from "@mui/icons-material/Science";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import FontDownloadIcon from "@mui/icons-material/FontDownload";
import ComputerIcon from "@mui/icons-material/Computer";
import CategoryIcon from "@mui/icons-material/Category";

const categoryStyles = {
  Maths: {
    label: "Math",
    icon: <CalculateIcon fontSize="small" />,
    bgColor: "#0b2a0c",
    textColor: "#fff",
  },
  Physics: {
    label: "Physics",
    icon: <BoltIcon fontSize="small" />,
    bgColor: "#46392c",
    textColor: "#fff",
  },
  Bangla: {
    label: "Bangla",
    icon: <MenuBookIcon fontSize="small" />,
    bgColor: "#8f692b",
    textColor: "#fff",
  },
  Chemistry: {
    label: "Chemistry",
    icon: <ScienceIcon fontSize="small" />,
    bgColor: "#2c4891",
    textColor: "#fff",
  },
  Biology: {
    label: "Biology",
    icon: <LocalFloristIcon fontSize="small" />,
    bgColor: "#1d4a1f",
    textColor: "#fff",
  },
  English: {
    label: "English",
    icon: <FontDownloadIcon fontSize="small" />,
    bgColor: "#6e2a8d",
    textColor: "#fff",
  },
  ICT: {
    label: "ICT",
    icon: <ComputerIcon fontSize="small" />,
    bgColor: "#455a64",
    textColor: "#fff",
  },
};

export default function CourseSubCategoryPill({ subCategory }) {
  const key = subCategory?.trim();

  const { label, icon, bgColor, textColor } = categoryStyles[key] || {
    label: subCategory || "N/A",
    icon: <CategoryIcon fontSize="small" />,
    bgColor: "#b6a1a1",
    textColor: "#000",
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
      <Chip
        icon={icon}
        label={label}
        size="small"
        variant="filled"
        sx={{
          bgcolor: bgColor,
          color: textColor,
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
          paddingLeft: 6,
          paddingRight: 6,
          display: "inline-flex",
          alignItems: "center",
          width: "auto",
          maxWidth: "100%",
          "& .MuiChip-icon": {
            color: textColor,
            fontSize: 18,
            marginLeft: -2,
            marginRight: 4,
          },
          "& .MuiChip-label": {
            paddingLeft: 0,
            paddingRight: 0,
            whiteSpace: "nowrap",
          },
        }}
      />
    </div>
  );
}
