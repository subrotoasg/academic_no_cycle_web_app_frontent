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
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import {
  useGetChaptersByCourseSubjectIdQuery,
  useGetChaptersBySubjectIdQuery,
} from "@/redux/services/chapterAPi";
import { useCreateClassContentMutation } from "@/redux/services/contentsApi";
import { selectAllCourses } from "@/redux/Features/courseInfo";

export default function ClassContentForm() {
  // const STORAGE_ZONE_BASE = "https://fai-cg.b-cdn.net";
  const STORAGE_ZONE_BASE = "https://iframe.mediadelivery.net/play";
  const types = [
    // { label: "Free Teachimint", value: "Free" },
    // { label: "Premium Teachimint", value: "Premium" },
    { label: "Free Youtube", value: "freeyt" },
    { label: "Premium Youtube", value: "premyt" },
    { label: "Bunny CDN", value: "bunny" },
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
  const libraryId = useWatch({ control, name: "libraryId" });
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const selectedCourseId = useWatch({ control, name: "courseId" });
  const selectedSubjectId = useWatch({ control, name: "subject" });
  const fileInputRef = useRef(null);

  const courses = useSelector(selectAllCourses);
  const courseOptions =
    courses?.data?.map((course) => ({
      label: course.productFullName,
      value: course.id,
    })) || [];

  const {
    data: subjects,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
  } = useGetSubjectsByCourseIdQuery(selectedCourseId, {
    skip: !selectedCourseId,
  });
  // console.log("sub", subjects);
  const { data: chapters, isLoading: isChapterLoading } =
    useGetChaptersByCourseSubjectIdQuery(selectedSubjectId, {
      skip: !selectedSubjectId,
    });
  // const { data: chapters, isLoading: isChapterLoading } =
  //   useGetChaptersBySubjectIdQuery(selectedSubjectId, {
  //     skip: !selectedSubjectId,
  //   });
  // console.log("chapter", chapters);
  const [createClassContent, { isLoading }] = useCreateClassContentMutation();

  const subjectOptions = isSubjectLoading
    ? [{ label: "Loading subjects...", value: "" }]
    : subjects?.data?.length
    ? subjects.data.map((sub) => ({
        label: sub.subject.title,
        value: sub.id,
      }))
    : [{ label: "No subjects available", value: "" }];

  const chapterOptions = isChapterLoading
    ? [{ label: "Loading chapters...", value: "" }]
    : chapters?.data?.length
    ? chapters.data.map((ch) => ({
        label: ch.chapter.chapterName,
        value: ch.id,
      }))
    : [{ label: "No chapters added yet", value: "" }];

  const instructorOptions = [
    { label: "Md Numeri Sattar Apar", value: "Md Numeri Sattar Apar" },
    { label: "Nazmus Sakib", value: "Nazmus Sakib" },
    { label: "Hemel", value: "Hemel" },
    { label: "Kazi Rakibul Hasan", value: "Kazi Rakibul Hasan" },
    { label: "Sanjoy Chakraborty", value: "Sanjoy Chakraborty" },
    { label: "M Mashrur Hussain", value: "M Mashrur Hussain" },
    { label: "Mottasin Pahlovi", value: "Mottasin Pahlovi" },
    { label: "Baki Billah", value: "Baki Billah" },
    { label: "Hasnat Abdullah", value: "Hasnat Abdullah" },
    { label: "Abhi Datta Tushar", value: "Abhi Datta Tushar" },
    { label: "Dr. Fahad Ibna Mahafuz", value: "Dr. Fahad Ibna Mahafuz" },
    { label: "Dr. Tofael Ahmed", value: "Dr. Tofael Ahmed" },
    { label: "Dr. Rizvi Touhid", value: "Dr. Rizvi Touhid" },
    { label: "Shampod Bhowmick", value: "Shampod Bhowmick" },
    { label: "Hasnat Shuvro", value: "Hasnat Shuvro" },
    { label: "Omar Faruk", value: "Omar Faruk" },
    { label: "Apurbo Opu", value: "Apurbo Opu" },
    { label: "Rahik", value: "Rahik" },
    { label: "Omor", value: "Omor" },
  ];

  // console.log(subjectOptions);
  // console.log(chapterOptions);
  useEffect(() => {
    setValue("subject", "");
    setValue("chapter", "");
  }, [selectedCourseId, setValue]);

  useEffect(() => {
    setValue("chapter", "");
  }, [selectedSubjectId, setValue]);

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
    // if (!selectedFile) {
    //   toast.error("Please upload a thumbnail image.");
    //   return;
    // }

    const formData = new FormData();
    const contentInfo = {
      courseSubjectChapterId: data.chapter,
      hostingType: data.type,
      classTitle: data.title,
      classNo: data.classNumber,
      description: data.description,
      videoUrl: data.videoId,
      lectureSheet: data.lectureSheetId,
      practiceSheet: data.practiceSheetId,
      solutionSheet: data.solutionSheetId,
      instructor: data.instructor,
      // startTime: data.startTime,
      libraryId: videoType === "bunny" ? data.libraryId : undefined,
    };

    formData.append("file", selectedFile);
    formData.append("data", JSON.stringify(contentInfo));

    try {
      const res = await createClassContent(formData);

      if (res?.data.success === true) {
        Swal.fire({
          icon: "success",
          title: "Class Content Successfully Uploaded",
          timer: 1000,
        });
        resetForm();
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Content Upload Failed, please Try again"
      );
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
          options={courseOptions}
          rules={{ required: "Course is required" }}
        />
        <Dropdown
          label="Video Hosting Type"
          name="type"
          options={types}
          rules={{ required: "Hosting type is required" }}
        />
        {selectedCourseId && (
          <Dropdown
            label="Select Subject"
            name="subject"
            options={subjectOptions}
            rules={{ required: "Subject is required" }}
          />
        )}
        {selectedSubjectId && (
          <Dropdown
            label="Select Chapter"
            name="chapter"
            options={chapterOptions}
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
          // rules={{
          //   minLength: {
          //     value: 3,
          //     message: "Description must be at least 3 characters long",
          //   },
          // }}
          textarea
        />{" "}
        <Dropdown
          label="Instructor"
          name="instructor"
          options={instructorOptions}
          rules={{ required: "Instructor is required" }}
        />
        {/* <InputField label="Start Time" name="startTime" type="datetime-local" /> */}
        <InputField
          label="Lecture Sheet ID"
          name="lectureSheetId"
          type="text"
          placeholder="Enter Lecture Sheet ID"
        />
        <InputField
          label="Practice Sheet ID"
          name="practiceSheetId"
          type="text"
          placeholder="Enter Practice Sheet ID"
        />
        <InputField
          label="Solution Sheet ID"
          name="solutionSheetId"
          type="text"
          placeholder="Enter Solution Sheet ID"
        />
        <InputField
          label="Video ID / Link"
          name="videoId"
          placeholder="Enter video Id or Url"
          rules={{ required: "Video ID or Link is required" }}
        />
        {/* Library ID only when Bunny is selected */}
        {videoType === "bunny" && (
          <InputField
            label="Library Id"
            name="libraryId"
            placeholder="Enter Bunny Library Id"
            rules={{ required: "Library Id is required for Bunny hosting" }}
          />
        )}
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
            Video Thumbnail Image
          </label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
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

          {videoId && videoType === "bunny" && libraryId && (
            // <div className="w-full mt-2">
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <iframe
                src={`https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?autoplay=true&loop=false&muted=false&preload=true&responsive=true`}
                loading="lazy"
                style={{
                  border: 0,
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  width: "100%",
                }}
                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;"
                allowFullScreen
              />
            </div>
            // </div>
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
