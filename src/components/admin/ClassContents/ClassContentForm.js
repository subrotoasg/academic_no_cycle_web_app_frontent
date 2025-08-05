"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Dropdown from "@/components/form/Dropdown";
import InputField from "@/components/form/InputField";
import { FileVideo2 } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useGetSubjectsQuery } from "@/redux/services/subjectsApi";
import { useGetChaptersBySubjectIdQuery } from "@/redux/services/chapterAPi";
import { useCreateClassContentMutation } from "@/redux/services/contentsApi";
import { selectAllCourses } from "@/redux/Features/courseInfo";

export default function ClassContentForm() {
  const types = [
    { label: "Free Teachimint", value: "Free" },
    { label: "Premium Teachimint", value: "Premium" },
    { label: "Free Youtube", value: "freeyt" },
    { label: "Premium Youtube", value: "premyt" },
  ];
  const defaultValues = {
    courseId: "",
  };
  const methods = useForm({ defaultValues });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
    control,
    setValue,
  } = methods;

  const videoType = useWatch({ control, name: "type" });
  const videoId = useWatch({ control, name: "videoId" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const selectedSubjectId = useWatch({ control, name: "subject" });
  const fileInputRef = useRef(null);

  const courses = useSelector(selectAllCourses);
  console.log(courses);
  const courseOptions =
    courses?.map((course) => ({
      label: course.productName,
      value: course.id,
    })) || [];
  const { data: subjects, isLoading: isSubjectLoading } = useGetSubjectsQuery();
  const { data: chapters, isLoading: isChapterLoading } =
    useGetChaptersBySubjectIdQuery(selectedSubjectId, {
      skip: !selectedSubjectId,
    });
  const [createClassContent, { isLoading }] = useCreateClassContentMutation();
  let subjectOptions;
  let chapterOptions = [];

  if (!isSubjectLoading) {
    const subjectData = subjects?.data;
    subjectOptions =
      subjectData?.map((subject) => ({
        label: subject.title,
        value: subject.id,
      })) || [];
  }

  if (!isChapterLoading && chapters?.data && Array.isArray(chapters.data)) {
    chapterOptions = chapters.data.map((ch) => ({
      label: ch.chapterName,
      value: ch.id,
    }));
  }

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
      toast.error("Please upload a thumbnail image.");
      return;
    }

    const formData = new FormData();
    const contentInfo = {
      courseId: data.courseId,
      subjectId: selectedSubjectId,
      chapterId: data.chapter,
      hostingType: data.type,
      classTitle: data.title,
      classNo: data.classNumber,
      description: data.description,
      videoUrl: data.videoId,
    };

    formData.append("file", selectedFile);
    formData.append("data", JSON.stringify(contentInfo));

    try {
      await createClassContent(formData).unwrap();

      Swal.fire({
        icon: "success",
        title: "Class Content Successfully Uploaded",
        timer: 1000,
      });
      resetForm();
    } catch (err) {
      toast.error(err?.data?.message || "Upload Failed. Please try again.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 p-2 md:p-3 rounded-lg"
      >
        <Dropdown
          label="Select Course"
          name="courseId"
          className="tiro-bangla-text"
          options={courseOptions}
          rules={{ required: "Course is required" }}
        />
        <Dropdown
          label="Video Hosting Type"
          name="type"
          options={types}
          rules={{ required: "Hosting type is required" }}
        />
        <Dropdown
          label="Select Subject"
          name="subject"
          className="tiro-bangla-text"
          options={subjectOptions}
          rules={{ required: "Subject is required" }}
        />
        {selectedSubjectId && (
          <Dropdown
            label="Select Chapter"
            name="chapter"
            className="tiro-bangla-text"
            options={
              chapterOptions.length > 0
                ? chapterOptions
                : [{ label: "No chapters added yet", value: "" }]
            }
            rules={{ required: "Chapter is required" }}
          />
        )}
        <InputField
          label="Class Title"
          name="title"
          placeholder="Enter class title"
          rules={{ required: "Class title is required" }}
        />
        <InputField
          label="Class Number"
          name="classNumber"
          type="number"
          placeholder="Enter the class number"
          rules={{
            required: "Class number is required.",
            min: { value: 1, message: "Chapter number must be start from 1" },
          }}
          min={1}
        />
        <InputField
          label="Content Description"
          name="description"
          placeholder="Provide a content description"
          rules={{
            required: "Description is required",
            minLength: {
              value: 3,
              message: "Description must be at least 3 characters long",
            },
          }}
          textarea
        />
        <InputField
          label="Video ID / Link"
          name="videoId"
          placeholder="Enter video Id or Url"
          rules={{ required: "Video ID or Link is required" }}
        />
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
            Video Thumbnail Image
          </label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full border rounded-md h-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          {imagePreview && (
            <div className="mt-3 w-24 h-24 relative border rounded-md overflow-hidden">
              <Image
                src={imagePreview}
                alt="Thumbnail Preview"
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>{" "}
        <div className="md:col-span-2" id="video_thumb">
          {videoId && (videoType === "freeyt" || videoType === "premyt") && (
            <div className="w-full mt-2">
              <iframe
                width="100%"
                height="auto"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-md  h-auto md:h-84"
              ></iframe>
            </div>
          )}
          {videoId && videoType === "vimeo" && (
            <div className="w-full mt-2">
              <iframe
                src={videoId}
                width="100%"
                title="Vimeo video player"
                height="450"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="rounded-lg shadow-md"
              ></iframe>
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isLoading || isSubmitting}
            className="w-full bg-blue-400 text-sm md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSubmitting
              ? "Uploading..."
              : "Upload a Class Content"}
            <FileVideo2 className="ms-2 h-4 md:h-5" />
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
