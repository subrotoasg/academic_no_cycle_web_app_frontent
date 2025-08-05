"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Image from "next/image";
import InputField from "@/components/form/InputField";
import Dropdown from "@/components/form/Dropdown";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useCreateNoticeRoutineMutation } from "@/redux/services/noticeRoutineApi";
import { useSelector } from "react-redux";
// import { selectCourse } from "@/redux/Features/courseInfo";

export default function NoticeForm() {
  const [createNoticeRoutine, { isLoading }] = useCreateNoticeRoutineMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // const course = useSelector(selectCourse);

  const types = [
    { label: "Routine", value: "Routine" },
    { label: "Notice", value: "Notice" },
  ];

  const defaultValues = {
    courseTitle: "",
    type: "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    routineUrl: "",
  };

  const methods = useForm({ defaultValues });

  const {
    handleSubmit,
    reset,
    watch,
    getValues,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const selectedType = watch("type");
  const startTimeValue =
    watch("startTime") || new Date().toISOString().slice(0, 16);

  // useEffect(() => {
  //   if (course?.title) {
  //     setValue("courseTitle", course.title);
  //   }
  // }, [course, setValue]);

  const allowedImageTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    reset(defaultValues);
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data) => {
    if (data.type !== "Routine" && !selectedFile) {
      toast.error("Please upload an image file");
      return;
    }

    if (selectedFile && !allowedImageTypes.includes(selectedFile.type)) {
      toast.error(
        "Invalid image file type. Please upload JPG, JPEG, PNG, or WEBP."
      );
      return;
    }

    const formData = new FormData();
    const NoticeInfo = {
      courseId: course.id,
      title: data.title,
      type: data.type,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      ...(data.type === "Routine" && { url: data.routineUrl }),
    };

    if (selectedFile && data.type !== "Routine") {
      formData.append("file", selectedFile);
    }

    formData.append("data", JSON.stringify(NoticeInfo));

    try {
      await createNoticeRoutine(formData).unwrap();
      Swal.fire({
        icon: "success",
        title: "Notice Successfully Created",
        timer: 1000,
      });
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || "Notice Creation Failed. Try Again!");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md"
      >
        <InputField
          label="Course Title"
          name="courseTitle"
          readOnly
          // value={course?.title || ""}
        />

        <Dropdown
          label="Type"
          name="type"
          options={types}
          rules={{ required: "Please select a type." }}
        />

        <InputField
          label="Title"
          name="title"
          placeholder="Notice Title"
          rules={{ required: "Title is required." }}
        />

        <InputField
          label="Description"
          name="description"
          placeholder="Detailed description"
          rules={{
            required: "Description is required.",
            minLength: {
              value: 4,
              message: "Description must be at least 4 characters long.",
            },
          }}
          textarea
        />

        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          min={new Date().toISOString().slice(0, 16)}
          rules={{
            required: "Start time is required.",
            validate: (value) => {
              const inputDate = new Date(value);
              const today = new Date();
              inputDate.setHours(0, 0, 0, 0);
              today.setHours(0, 0, 0, 0);
              return (
                inputDate >= today ||
                "Start date must be today or in the future."
              );
            },
          }}
        />

        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          min={startTimeValue}
          rules={{
            required: "End time is required.",
            validate: (value) => {
              const start = new Date(getValues("startTime"));
              const end = new Date(value);
              return end > start || "End time must be after start time.";
            },
          }}
        />

        {/* Show Routine URL only when type is Routine */}
        {selectedType === "Routine" && (
          <InputField
            label="Routine File URL"
            name="routineUrl"
            placeholder="https://example.com/routine.pdf"
            rules={{
              required: "Routine URL is required.",
            }}
          />
        )}

        {/* Show image upload if type is not Routine */}
        {selectedType !== "Routine" && (
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
              Upload Image
            </label>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              required
              className="w-full border rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
            />
            {imagePreview && (
              <div className="mt-3 w-32 h-32 relative border rounded-md overflow-hidden">
                <Image
                  src={imagePreview}
                  alt="Image Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-blue-400 text-sm md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSubmitting ? "Submitting..." : "Add Notice"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
