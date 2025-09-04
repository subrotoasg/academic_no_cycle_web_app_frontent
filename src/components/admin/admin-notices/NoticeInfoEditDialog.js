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
import Dropdown from "@/components/form/Dropdown";
import Swal from "sweetalert2";
import { useUpdateNoticeRoutineMutation } from "@/redux/services/noticeRoutineApi";
import { toast } from "sonner";

export default function NoticeInfoEditDialog({
  refetchNotices,
  isOpen,
  onOpenChange,
  notice,
}) {
  const methods = useForm({
    defaultValues: {
      course: "",
      type: "",
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      // url: "",
    },
  });

  const [updateNoticeRoutine, { isLoading }] = useUpdateNoticeRoutineMutation();
  const { reset, handleSubmit, getValues, setError, watch } = methods;
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // const selectedType = watch("type");
  const formatLocalDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000; // in ms
    const localISOTime = new Date(date - tzOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  useEffect(() => {
    if (notice) {
      reset({
        course: notice.course?.productName || "",
        type: notice.type || "",
        title: notice.title || "",
        description: notice.description || "",
        startTime: formatLocalDateTime(notice.startTime),
        endTime: formatLocalDateTime(notice.endTime),
        // url: notice.url || "",
      });

      setImagePreview(notice.image || null);
      setSelectedFile(notice.image || null);
    }
  }, [notice, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleFormSubmit = async (data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);

    if (data.startTime && data.endTime && start > end) {
      setError("endTime", {
        type: "manual",
        message: "End date must be after start date.",
      });
      return;
    }

    const NoticeInfo = {
      title: data.title,
      type: data.type,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
    };

    // if (data.type === "Routine") {
    //   NoticeInfo.url = data.url;
    // }

    const formData = new FormData();

    if (selectedFile && selectedFile instanceof File) {
      formData.append("file", selectedFile);
    }

    formData.append("data", JSON.stringify(NoticeInfo));

    try {
      const res = await updateNoticeRoutine({
        id: notice.id,
        formData,
      }).unwrap();
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Notice updated successfully!",
          timer: 1000,
        });
        onOpenChange(false);
        await refetchNotices();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update Notice");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Edit Notice
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4"
          >
            <InputField label="Course Title" name="course" readOnly />

            <Dropdown
              label="Select Type"
              name="type"
              options={[
                { label: "Routine", value: "Routine" },
                { label: "Notice", value: "Notice" },
              ]}
              rules={{ required: "Type is required." }}
            />

            <InputField
              label="Notice Title"
              name="title"
              placeholder="Enter the title"
              rules={{
                required: "Title is required.",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              }}
            />

            <InputField
              label="Description"
              name="description"
              placeholder="Provide a short description"
              textarea
              rules={{
                required: "Description is required.",
                minLength: {
                  value: 5,
                  message: "Description must be at least 5 characters",
                },
              }}
            />

            <InputField
              label="Start Time"
              name="startTime"
              type="datetime-local"
              rules={{ required: "Start time is required." }}
            />

            <InputField
              label="End Date"
              name="endTime"
              type="datetime-local"
              rules={{
                required: "End time is required.",
                validate: (value) => {
                  const start = new Date(getValues("startTime"));
                  const end = new Date(value);
                  return end > start || "End time must be after start time.";
                },
              }}
            />

            {/* {selectedType === "Routine" && (
              <InputField
                label="Routine URL"
                name="url"
                placeholder="Enter routine URL"
                rules={{
                  required: "URL is required for Routine.",
                  pattern: {
                    value:
                      /^(https?:\/\/(?:www\.)?[\w\-]+(\.[\w\-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+)$/,
                    message: "Enter a valid URL.",
                  },
                }}
              />
            )} */}

            <div className="md:col-span-2 mt-2">
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium"
              >
                Upload Image
              </label>
              <div className="mt-2 w-48 md:w-64 h-28 md:h-40 relative rounded-md overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  width={300}
                  height={200}
                  className="w-full h-full rounded-md object-fill"
                />
              </div>
              <input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full p-2 mt-2 border rounded-md"
              />
            </div>

            <DialogFooter className="md:col-span-2 flex justify-between pt-4">
              <Button
                type="submit"
                variant="primary"
                className="bg-green-600 text-white hover:bg-green-800"
                disabled={isLoading}
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
              <Button
                type="button"
                variant="warning"
                onClick={() => onOpenChange(false)}
                className="bg-red-600 text-white hover:bg-red-800"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
