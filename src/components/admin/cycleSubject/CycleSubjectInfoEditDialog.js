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
import { useEffect, useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useUpdateCycleSubjectMutation } from "@/redux/services/cycleSubjectApi";

export default function CycleSubjectInfoEditDialog({
  isOpen,
  onOpenChange,
  subject,
}) {
  const methods = useForm({
    defaultValues: {
      title: "",
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Use the mutation hook
  const [updateCycleSubject] = useUpdateCycleSubjectMutation();

  useEffect(() => {
    if (subject) {
      reset({
        title: subject?.title || "",
      });

      setImagePreview(
        subject.cycleSubjectImage || subject?.subject?.subjectImage
      );
      setSelectedFile(null);
    }
  }, [subject, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // Limit size to 5MB
        toast.error("Image size must be less than 5MB.");
        return;
      }

      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      setLoading(true);
      // Use the updateCycleSubject mutation hook
      await updateCycleSubject({ id: subject.id, formData }).unwrap();
      Swal.fire({
        icon: "success",
        title: "CycleSubject Info Successfully Updated",
        timer: 1500,
      });

      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || "Failed to Update CycleSubject Info");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Edit CycleSubject Info
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 gap-4 p-4"
          >
            <div>
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium"
              >
                Upload Subject Image
              </label>

              <div className="mt-2 w-48 md:w-64 relative border rounded-md overflow-hidden">
                <Image
                  src={imagePreview || "/placeholder.jpg"}
                  alt="Image Preview"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>

              <input
                id="image-upload"
                name="image"
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full p-2 mt-2 border rounded-md"
              />
            </div>

            {errors.title && (
              <p className="text-red-500 text-sm">Title is required.</p>
            )}

            <DialogFooter>
              <div className="flex flex-col-reverse md:flex-row justify-between gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-700 text-white"
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="bg-red-600 text-white"
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
