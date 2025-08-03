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
import InputField from "@/components/form/InputField";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useUpdateCycleMutation } from "@/redux/services/cycleCreateApi";

export default function CycleInfoEditDialog({
  isOpen,
  onOpenChange,
  cycle,
  refetchCycles,
}) {
  const methods = useForm({
    defaultValues: {
      title: "",
    },
  });

  const { reset, handleSubmit } = methods;
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [updateCycle, { isLoading }] = useUpdateCycleMutation();

  useEffect(() => {
    if (cycle) {
      reset({
        title: cycle?.title || "",
      });

      setImagePreview(cycle?.cycleImage || null);
      setSelectedFile(null);
    }
  }, [cycle, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await updateCycle({ id: cycle.id, formData }).unwrap(); // ✅ RTK query mutation call
      Swal.fire({
        icon: "success",
        title: "Cycle Info Successfully Updated",
        timer: 1500,
      });
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error?.data?.message || error.message || "Failed to Update Cycle Info"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Edit Cycle Info
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 gap-4 p-4"
          >
            <InputField
              label="Cycle Title"
              name="title"
              placeholder="Enter cycle title"
              rules={{
                required: "Title is required.",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters.",
                },
              }}
            />

            <div>
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium"
              >
                Upload Cycle Image
              </label>

              <div className="mt-2 w-48 md:w-64 relative border rounded-md overflow-hidden">
                <Image
                  src={imagePreview || "/placeholder.jpg"}
                  alt="Cycle Image Preview"
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

            <DialogFooter>
              <div className="flex flex-col-reverse md:flex-row justify-between gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-700 text-white"
                >
                  {isLoading ? "Updating..." : "Update"}
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
