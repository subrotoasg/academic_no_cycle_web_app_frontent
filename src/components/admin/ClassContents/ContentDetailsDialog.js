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
  const course =
    selectedContent?.cycleSubjectChapter?.cycleSubject?.cycle?.course?.title;
  const cycle =
    selectedContent?.cycleSubjectChapter?.cycleSubject?.cycle?.title;
  const subject =
    selectedContent?.cycleSubjectChapter?.cycleSubject?.subject?.title;
  const chapter = selectedContent?.cycleSubjectChapter?.chapter?.chapterName;

  const infoFields = [
    {
      label: "Course",
      value: course,
    },
    {
      label: "Cycle",
      value: cycle,
    },
    ,
    {
      label: "Subject",
      value: subject,
    },
    {
      label: "Chapter Title",
      value: chapter,
    },
    { label: "Class Title", value: selectedContent?.classTitle },
    { label: "Class No", value: selectedContent?.classNo },
    { label: "Class Description", value: selectedContent?.description },
    { label: "Hosting Type", value: selectedContent?.hostingType },
    { label: "Video Id/Url", value: selectedContent?.videoUrl },
  ];
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
