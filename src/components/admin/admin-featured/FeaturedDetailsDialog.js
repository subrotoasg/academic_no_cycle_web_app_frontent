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

export default function FeaturedDetailsDialog({
  selectedFeature,
  isOpen,
  onOpenChange,
}) {
  const infoFields = [
    { label: "Title", value: selectedFeature?.title },
    { label: "Type", value: selectedFeature?.type },
    { label: "Description", value: selectedFeature?.description },
    { label: "Coupon", value: selectedFeature?.coupne || "N/A" },
    { label: "Link", value: selectedFeature?.url },
    { label: "Image", value: selectedFeature?.image },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Featured Item Details
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
                    alt={selectedFeature?.title || "Image"}
                    className="max-h-48 rounded-md border"
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
