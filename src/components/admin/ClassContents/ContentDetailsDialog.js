"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ContentDetailsDialog({
  selectedContent,
  isOpen,
  onOpenChange,
}) {
  const infoFields = [
    {
      label: "Course",
      value:
        selectedContent?.courseSubjectChapter?.courseSubject?.course
          ?.productName,
    },
    {
      label: "Subject",
      value:
        selectedContent?.courseSubjectChapter?.courseSubject?.subject?.title,
    },
    {
      label: "Chapter Title",
      value: selectedContent?.courseSubjectChapter?.chapter?.chapterName,
    },
    { label: "Class Title", value: selectedContent?.classTitle },
    { label: "Class Description", value: selectedContent?.description },
    { label: "Class No", value: selectedContent?.classNo },
    { label: "Hosting Type", value: selectedContent?.hostingType },
    { label: "Video Id/Url", value: selectedContent?.videoUrl },
    {
      label: "Content Uploaded",
      value: selectedContent?.createdAt
        ? new Date(selectedContent.createdAt).toLocaleString()
        : "N/A",
    },
  ];

  console.log(selectedContent);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Detailed Class Content Information
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
          {infoFields.map((field, idx) => (
            <div key={idx}>
              <strong>{field.label}: </strong> {field.value ?? "N/A"}
            </div>
          ))}

          {/* <div>
            <strong>Attendance Count: </strong>
            <button
              onClick={(e) => {
                e.currentTarget.innerText = "60";
              }}
              className="text-white border rounded-lg p-1 bg-blue-800"
            >
              View Report
            </button>
          </div> */}
        </div>
        <DialogFooter>
          <Button
            className="bg-red-600 text-white"
            variant="danger"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
