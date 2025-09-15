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
import { useUpdateCycleSubjectChapterMutation } from "@/redux/services/cycleChapterApi";

export default function ChapterImageEditDialog({
  isOpen,
  onOpenChange,
  chapter,
}) {
  // console.log(chapter);
  const methods = useForm();
  const { handleSubmit } = methods;

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [updateCycleSubjectChapter] = useUpdateCycleSubjectChapterMutation();

  useEffect(() => {
    if (chapter) {
      setImagePreview(
        chapter?.cycleSubjectChapterImage ||
          chapter?.chapter?.chapterImage ||
          null
      );
      setSelectedFile(null);
    }
  }, [chapter]);

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
    if (!chapter?.id) {
      toast.error("Invalid chapter ID");
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
      const res = await updateCycleSubjectChapter({
        id: chapter.id,
        formData,
      }).unwrap();

      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Chapter info updated successfully",
          timer: 1500,
        });
        setSelectedFile(null);
        setImagePreview(null);
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update chapter info");
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
            Edit Chapter Image
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 gap-4 p-4"
          >
            <div>
              <label
                htmlFor="chapter-image-upload"
                className="block text-sm font-medium"
              >
                Upload Chapter Image
              </label>

              <div className="mt-2 w-48 md:w-64 h-32 md:h-40 relative border rounded-md overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={300}
                  height={200}
                  className="w-full h-full rounded-md object-fill"
                />
              </div>

              <input
                id="chapter-image-upload"
                name="chapter-image"
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
                  className="bg-green-600 text-white hover:bg-green-800"
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="bg-red-600 text-white hover:bg-red-800"
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
