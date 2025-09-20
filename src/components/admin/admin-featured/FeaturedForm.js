"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Image from "next/image";
import InputField from "@/components/form/InputField";
import Dropdown from "@/components/form/Dropdown";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useCreateFeaturedMutation } from "@/redux/services/featuredApi";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { useGetAllCourseCycleBasedOnCourseIdQuery } from "@/redux/services/cycleApi";

function FeaturedForm() {
  const [createFeatured, { isLoading }] = useCreateFeaturedMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const defaultValues = {
    courseId: "",
    title: "",
    type: "",
    description: "",
    coupon: "",
  };
  const methods = useForm({ defaultValues });
  const {
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
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

  const types = [
    { label: "Discount", value: "Discount" },
    { label: "Offer", value: "Offer" },
    { label: "Coupon", value: "Coupon" },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const selectedType = watch("type");

  useEffect(() => {
    if (selectedType !== "Coupon") {
      setValue("coupon", "");
    }
  }, [selectedType, setValue]);

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
    const featuredInfo = {
      ...(data.cycleId
        ? { cycleId: data.cycleId }
        : { courseId: data.courseId }),
      title: data.title,
      type: data.type,
      description: data.description,
      coupne: data.coupon,
      url: "https://apars.shop/shop",
    };

    formData.append("file", selectedFile);
    formData.append("data", JSON.stringify(featuredInfo));

    try {
      const res = await createFeatured(formData).unwrap();
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "New Feature Successfully Created",
          timer: 1000,
        });
        resetForm();
      }
    } catch (err) {
      toast.error(err?.data?.message || "Featured creation failed. Try again!");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-md"
      >
        <Dropdown
          label="Select Course"
          name="courseId"
          className="tiro-bangla-text"
          options={courseOptions}
          rules={{ required: "Course is required" }}
        />
        {selectedCourseId && (
          <Dropdown
            label="Select Cycle (Only for cycle wise feature)"
            name="cycleId"
            options={cycleOptions}
          />
        )}
        <InputField
          label="Feature Title"
          name="title"
          placeholder="Enter title"
          rules={{
            required: "Title is required",
            minLength: {
              value: 3,
              message: "Title must be at least 3 characters long",
            },
          }}
        />
        <Dropdown
          label="Feature Type"
          name="type"
          options={types}
          rules={{ required: "Please select a feature type." }}
        />{" "}
        <InputField
          label="Description"
          name="description"
          placeholder="Feature description "
          textarea
          rules={{
            required: "Description is required",
            minLength: {
              value: 5,
              message: "Description must be at least 5 characters long",
            },
          }}
        />
        {selectedType === "Coupon" && (
          <InputField
            label="Coupon Code"
            name="coupon"
            placeholder="Coupon code"
            rules={{ required: "Coupon code is required for Coupon type." }}
          />
        )}
        {/* File Upload with Preview */}
        <div className="md:col-span-2">
          <Label className="mb-1 block">File Upload</Label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full border  rounded-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          {imagePreview && (
            <div className="mt-3 w-32 h-24 md:w-44 md:h-32 relative border rounded-md overflow-hidden">
              <Image
                src={imagePreview}
                alt="Image Preview"
                fill
                className="object-fill h-full w-full"
              />
            </div>
          )}
        </div>
        {/* Submit Button */}
        <div className="md:col-span-2">
          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-blue-400 text-sm md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSubmitting ? "Creating ..." : "Create New Feature"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export default FeaturedForm;
