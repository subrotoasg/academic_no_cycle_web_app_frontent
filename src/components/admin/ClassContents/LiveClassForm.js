"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Dropdown from "@/components/form/Dropdown";
import InputField from "@/components/form/InputField";
import { CalendarClock } from "lucide-react";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import { useGetChaptersByCourseSubjectIdQuery } from "@/redux/services/chapterAPi";
import { useAddLiveClassMutation } from "@/redux/services/contentsApi";

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
    { label: "Rahik", value: "Rahik" },
    { label: "Omor", value: "Omor" },
  ];

  useEffect(() => {
    setValue("subject", "");
    setValue("chapter", "");
  }, [selectedCourseId, setValue]);

  useEffect(() => {
    setValue("chapter", "");
  }, [selectedSubjectId, setValue]);

  const [addLiveClass, { isLoading }] = useAddLiveClassMutation();

  const onSubmit = async (data) => {
    const liveClassInfo = {
      courseSubjectChapterId: data.chapter,
      title: data.title,
      //   classNo: data.classNumber,
      description: data.description,
      instructor: data.instructor,
      startTime: data.startTime,
    };

    try {
      const res = await addLiveClass(liveClassInfo).unwrap();
      //   console.log(res);
      if (res?.data.success) {
        Swal.fire({
          icon: "success",
          title: "Live Class Scheduled Successfully",
          timer: 1000,
        });
        reset(defaultValues);
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
          rules={{ required: "Class title is required" }}
        />
        {/* <InputField
          label="Class Number"
          name="classNumber"
          type="number"
          placeholder="Enter the class number"
          rules={{
            required: "Class number is required.",
            min: { value: 1, message: "Class number must start from 1" },
          }}
          min={1}
        /> */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter class description"
          textarea
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
          <button
            type="submit"
            disabled={isSubmitting /* || isLoading */}
            className="w-full bg-blue-400 text-sm md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Scheduling..." : "Schedule Live Class"}
            <CalendarClock className="ms-2 h-4 md:h-5" />
          </button>
        </div>
      </form>
    </FormProvider>
  );
}
