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
import { useUpdateCourseSubjectMutation } from "@/redux/services/subjectsApi";

export default function SubjectsImageEditDialog({
  isOpen,
  onOpenChange,
  Subject,
}) {
  // console.log(Subject)
  const methods = useForm();
  const { handleSubmit } = methods;

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [updateCourseSubject] = useUpdateCourseSubjectMutation();

  useEffect(() => {
    if (Subject) {
      setImagePreview(
        Subject?.courseSubjectImage ||
          Subject?.subject?.subjectImage ||
          "/placeholder.jpg"
      );
      setSelectedFile(null);
    }
  }, [Subject]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async () => {
    if (!Subject?.id) {
      toast.error("Invalid Subject ID");
      return;
    }

    if (!selectedFile || !(selectedFile instanceof File)) {
      toast.error("Please upload a valid image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      await updateCourseSubject({ id: Subject.id, formData }).unwrap();
      Swal.fire({
        icon: "success",
        title: "Subject image updated successfully!",
        timer: 1500,
      });
      setSelectedFile(null);
      setImagePreview(null);
      onOpenChange(false);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update Subject image");
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
            Edit Subject Image
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 gap-4 p-4"
          >
            <div>
              <label
                htmlFor="Subject-image-upload"
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
                id="Subject-image-upload"
                name="Subject-image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full p-2 mt-2 border rounded-md"
              />
            </div>

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
