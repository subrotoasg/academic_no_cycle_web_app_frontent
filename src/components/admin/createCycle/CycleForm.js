"use client";

import React, { useRef, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import InputField from "@/components/form/InputField";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useCreateCycleMutation } from "@/redux/services/cycleCreateApi";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";

export default function CycleForm() {
  const methods = useForm({
    defaultValues: {
      title: "",
    },
  });

  const { handleSubmit, reset } = methods;
  const course = useSelector(selectCourse);

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [createCycle, { isLoading }] = useCreateCycleMutation();

  const resetForm = () => {
    reset();
    setSelectedFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    const dataInfo = {
      courseId: course?.id,
      productId: "132",
      title: data.title,
    };
    formData.append("file", selectedFile);
    formData.append("data", JSON.stringify(dataInfo));

    try {
      const response = await createCycle(formData).unwrap();
      Swal.fire({
        icon: "success",
        title: "Cycle Successfully Created",
        timer: 1500,
      });
      resetForm();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Cycle Creation Failed!");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md"
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
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
            Upload Cycle Image
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
                alt="Cycle Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-400 text-xs md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating..." : "Create Cycle"}
        </button>
      </form>
    </FormProvider>
  );
}
