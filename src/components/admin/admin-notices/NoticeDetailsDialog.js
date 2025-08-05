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
import Image from "next/image";
import React from "react";

export default function NoticeDetailsDialog({
  selectedNotice,
  isOpen,
  onOpenChange,
}) {
  const infoFields = [
    { label: "Batch", value: selectedNotice?.course?.title },
    { label: "Type", value: selectedNotice?.type },
    { label: "Notice Title", value: selectedNotice?.title },
    { label: "Description", value: selectedNotice?.description },
    {
      label: "Create Time",
      value: new Date(selectedNotice?.startTime).toLocaleString(),
    },
    {
      label: "End Time",
      value: new Date(selectedNotice?.endTime).toLocaleString(),
    },
    { label: "Image", value: selectedNotice?.image },
  ];
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Detailed Notice Information
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-base">
          {infoFields.map((field, idx) => (
            <div key={idx}>
              {field.label === "Image" && field.value ? (
                <div className="mt-2">
                  <strong>{field.label}: </strong>
                  <Image
                    src={field.value}
                    alt={selectedNotice?.title || "Image"}
                    className=" rounded-md border"
                    width={200}
                    height={200}
                  />
                </div>
              ) : (
                <div>
                  <strong>{field.label}: </strong> {field.value ?? "N/A"}
                </div>
              )}
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
