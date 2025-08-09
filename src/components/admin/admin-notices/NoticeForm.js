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
import { selectAllCourses } from "@/redux/Features/courseInfo";

export default function NoticeForm() {
  const [createNoticeRoutine, { isLoading }] = useCreateNoticeRoutineMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const courses = useSelector(selectAllCourses);
  const courseOptions =
    courses?.data?.map((course) => ({
      label: course.productFullName,
      value: course.id,
    })) || [];

  const defaultValues = {
    courseId: "",
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

  const startTimeValue =
    watch("startTime") || new Date().toISOString().slice(0, 16);
  const typeValue = watch("type");

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
    if ((data.type === "Notice" || data.type === "Routine") && !selectedFile) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    const NoticeInfo = {
      courseId: data.courseId,
      title: data.title,
      type: data.type,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      ...(data.type === "Routine" && { url: data.routineUrl }),
    };

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    formData.append("data", JSON.stringify(NoticeInfo));

    try {
      const res = await createNoticeRoutine(formData).unwrap();
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Notice Successfully Created",
          timer: 1000,
        });
        setIsModalOpen(false);
        resetForm();
      }
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
        {/* Course Dropdown */}
        <Dropdown
          label="Select Course"
          name="courseId"
          options={courseOptions}
          rules={{ required: "Course selection is required." }}
        />

        {/* Type Dropdown */}
        <Dropdown
          label="Type"
          name="type"
          options={[
            { label: "Routine", value: "Routine" },
            { label: "Notice", value: "Notice" },
          ]}
          rules={{ required: "Please select a type." }}
        />

        <InputField
          label="Title"
          name="title"
          placeholder="Notice Title"
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
          placeholder="Detailed description"
          rules={{
            required: "Description is required.",
            minLength: {
              value: 3,
              message: "Description must be at least 3 characters",
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
            validate: (value) =>
              new Date(value) >= new Date() ||
              "Start time must be in the future.",
          }}
        />

        <InputField
          label="End Time"
          name="endTime"
          type="datetime-local"
          min={startTimeValue}
          rules={{
            required: "End time is required.",
            validate: (value) =>
              new Date(value) > new Date(getValues("startTime")) ||
              "End time must be after start time.",
          }}
        />

        {/* Conditional Input */}

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
            Upload Image
          </label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
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

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-blue-400 text-xs md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSubmitting ? "Submitting..." : "Add Notice"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
