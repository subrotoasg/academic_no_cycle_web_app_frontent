"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Dropdown from "@/components/form/Dropdown";
import InputField from "@/components/form/InputField";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useSelector } from "react-redux";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import { useGetChaptersByCourseSubjectIdQuery } from "@/redux/services/chapterAPi";
import { useCreateLiveClassMutation } from "@/redux/services/liveClassApi";

export default function LiveClassForm() {
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

  const selectedCourseId = useWatch({ control, name: "courseId" });
  const selectedSubjectId = useWatch({ control, name: "subject" });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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

  const courses = useSelector(selectAllCourses);
  const courseOptions =
    courses?.data?.map((course) => ({
      label: course.productFullName,
      value: course.id,
    })) || [];

  const { data: subjects, isLoading: isSubjectLoading } =
    useGetSubjectsByCourseIdQuery(selectedCourseId, {
      skip: !selectedCourseId,
    });

  const { data: chapters, isLoading: isChapterLoading } =
    useGetChaptersByCourseSubjectIdQuery(selectedSubjectId, {
      skip: !selectedSubjectId,
    });

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
    { label: "Sharoare Hosan Emon", value: "Sharoare Hosan Emon" },
    { label: "Instructor (Tech Team)", value: "Instructor (Tech Team)" },
  ];

  useEffect(() => {
    setValue("subject", "");
    setValue("chapter", "");
  }, [selectedCourseId, setValue]);

  useEffect(() => {
    setValue("chapter", "");
  }, [selectedSubjectId, setValue]);

  const [createLiveClass, { isLoading }] = useCreateLiveClassMutation();

  const onSubmit = async (data) => {
    const formData = new FormData();

    const liveClassInfo = {
      courseSubjectChapterId: data.chapter,
      title: data.title,
      classNo: data.classNumber,
      description: data.description,
      instructor: data.instructor,
      startTime: data.startTime,
    };

    if (selectedFile) {
      formData.append("file", selectedFile);
    }
    formData.append("data", JSON.stringify(liveClassInfo));
    // toast.warning(
    //   "Live Class functionality is disabled for testing. Please wait for reactivation"
    // );
    try {
      const res = await createLiveClass(formData);
      // console.log(res);
      if (res?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Live Class Scheduled Successfully",
          timer: 1000,
        });
        resetForm();
      } else {
        toast.error(
          res?.error?.data?.message ||
            "Failed to schedule live class, please try again"
        );
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to schedule live class, please try again"
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
          // rules={{ required: "Class title is required" }}
          rules={{
            minLength: {
              required: "Class title is required",
              value: 3,
              message: "Title must be at least 3 characters long",
            },
          }}
        />
        <InputField
          label="Class Number"
          name="classNumber"
          type="number"
          placeholder="Enter the class number"
          rules={{
            required: "Class number is required.",
            min: { value: 1, message: "Class number must start from 1" },
          }}
          min={1}
        />
        <InputField
          label="Description"
          name="description"
          placeholder="Enter class description"
          textarea
          rules={{
            minLength: {
              required: "Class Description is required",
              value: 5,
              message: "Description must be at least 5 characters long",
            },
          }}
          // required
        />
        <Dropdown
          label="Instructor"
          name="instructor"
          options={instructorOptions}
          rules={{ required: "Instructor is required" }}
        />
        <InputField
          label="Start Time"
          name="startTime"
          type="datetime-local"
          rules={{ required: "Start time is required" }}
        />

        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
            Thumbnail (Optional)
          </label>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded-md h-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          />
          {imagePreview && (
            <div className="mt-3 w-28 md:w-32 h-20 md:h-24 relative border rounded-md overflow-hidden">
              <Image
                src={imagePreview}
                alt="Thumbnail Preview"
                fill
                className="object-fill"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-blue-400 text-sm md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting || isLoading
              ? "Scheduling..."
              : "Schedule Live Class"}
            <CalendarClock className="ms-2 h-4 md:h-5" />
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
