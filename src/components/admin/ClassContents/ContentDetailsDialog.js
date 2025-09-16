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
  // console.log(selectedContent);
  const infoFields = [
    {
      label: "Course",
      value:
        selectedContent?.cycleSubjectChapter?.cycleSubject?.cycle?.course
          ?.productName || "N/A",
    },
    {
      label: "Cycle",
      value:
        selectedContent?.cycleSubjectChapter?.cycleSubject?.cycle?.title ||
        "N/A",
    },
    {
      label: "Subject",
      value:
        selectedContent?.cycleSubjectChapter?.cycleSubject?.title ||
        selectedContent?.cycleSubjectChapter?.cycleSubject?.subject?.title ||
        "N/A",
    },
    {
      label: "Chapter Title",
      value:
        selectedContent?.cycleSubjectChapter?.title ||
        selectedContent?.cycleSubjectChapter?.chapter?.chapterName ||
        "N/A",
    },
    { label: "Class Title", value: selectedContent?.classTitle },
    { label: "Class Description", value: selectedContent?.description },
    { label: "Instructor", value: selectedContent?.instructor },
    { label: "Class No", value: selectedContent?.classNo },
    { label: "Hosting Type", value: selectedContent?.hostingType },
    { label: "Video Id/Url", value: selectedContent?.videoUrl },
    { label: "Library Id (bunny)", value: selectedContent?.libraryId },
    {
      label: "Content Uploaded",
      value: selectedContent?.createdAt
        ? new Date(selectedContent?.createdAt).toLocaleString()
        : "N/A",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl text-center">
            Detailed Class Content Information
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base">
          {/* Render all other info except sheet fields */}
          {infoFields.map((field, idx) => (
            <div key={idx}>
              <strong>{field.label}: </strong> {field.value ?? "N/A"}
            </div>
          ))}

          {/* Group sheets into one full-width row */}
          <div className="sm:col-span-2 flex flex-wrap gap-6">
            <div>
              <strong>Lecture Sheet: </strong>
              {selectedContent?.lectureSheet
                ? selectedContent?.lectureSheet
                : "N/A"}
            </div>
            <div>
              <strong>Practice Sheet: </strong>
              {selectedContent?.practiceSheet
                ? selectedContent?.practiceSheet
                : "N/A"}
            </div>
            <div>
              <strong>Solution Sheet: </strong>
              {selectedContent?.solutionSheet
                ? selectedContent?.solutionSheet
                : "N/A"}
            </div>
          </div>
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
