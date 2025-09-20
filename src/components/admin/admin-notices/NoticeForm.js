"use client";

import React, { useRef, useState, useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Image from "next/image";
import InputField from "@/components/form/InputField";
import Dropdown from "@/components/form/Dropdown";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useCreateNoticeRoutineMutation } from "@/redux/services/noticeRoutineApi";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { useGetAllCourseCycleBasedOnCourseIdQuery } from "@/redux/services/cycleApi";

export default function NoticeForm() {
  const [createNoticeRoutine, { isLoading }] = useCreateNoticeRoutineMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const defaultValues = {
    courseId: "",
    cycleId: "",
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
    control,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const selectedCourseId = useWatch({ control, name: "courseId" });

  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
  } = useGetAllCourseQuery({ limit: 1000 });

  const courseOptions = isCourseLoading
    ? [{ label: "Loading courses...", value: "" }]
    : isCourseError
    ? [{ label: "Failed to load courses", value: "" }]
    : courseData?.data?.data?.length
    ? courseData?.data?.data.map((course) => ({
        label: `${course?.productFullName} (${course?.productName})`,
        value: course?.id,
      }))
    : [{ label: "No courses available", value: "" }];

  // Cycles
  const {
    data: cycleData,
    isLoading: isCycleLoading,
    isError: isCycleError,
  } = useGetAllCourseCycleBasedOnCourseIdQuery(
    { courseId: selectedCourseId, limit: 100 },
    { skip: !selectedCourseId }
  );

  const cycleOptions = isCycleLoading
    ? [{ label: "Loading cycles...", value: "" }]
    : isCycleError
    ? [{ label: "Failed to load cycles", value: "" }]
    : cycleData?.data?.length
    ? cycleData?.data?.map((cycle) => ({
        label: `${cycle?.title} (${cycle?.course?.productName})`,
        value: cycle?.id,
      }))
    : [{ label: "No cycles available", value: "" }];

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
    if (!selectedFile) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    const NoticeInfo = {
      ...(data.cycleId
        ? { cycleId: data.cycleId }
        : { courseId: data.courseId }),
      title: data.title,
      type: data.type,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      // ...(data.type === "Routine" && { url: data.routineUrl }),
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
          title: "Notice Successfully Added",
          timer: 1000,
        });

        resetForm();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Notice Creation Failed. Try Again!");
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
          rules={{ required: "Course is required." }}
        />

        {selectedCourseId && (
          <Dropdown
            label="Select Cycle (Only for cycle wise routine)"
            name="cycleId"
            options={cycleOptions}
          />
        )}
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
          placeholder="Title"
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
              value: 5,
              message: "Description must be at least 5 characters",
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
            <div className="mt-3 w-44 md:w-64 md:h-40 h-28 relative border rounded-md overflow-hidden">
              <Image
                src={imagePreview}
                alt="Image Preview"
                fill
                className="h-full w-full object-fill"
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
