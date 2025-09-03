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
import { useForm, FormProvider, useWatch } from "react-hook-form";
import Dropdown from "@/components/form/Dropdown";
import InputField from "@/components/form/InputField";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import { useGetChaptersByCourseSubjectIdQuery } from "@/redux/services/chapterAPi";
import { useUpdateLiveClassMutation } from "@/redux/services/liveClassApi";

export default function LiveClassEditDialog({
  isOpen,
  onOpenChange,
  selectedLiveClass,
  refetchLiveClasses,
}) {
  // console.log(selectedLiveClass);
  const defaultValues = {
    courseId: "",
    subject: "",
    chapter: "",
    title: "",
    description: "",
    instructor: "",
    startTime: "",
  };

  const methods = useForm({ defaultValues });
  const { reset, handleSubmit, control, setValue } = methods;

  const selectedCourseId = useWatch({ control, name: "courseId" });
  const selectedSubjectId = useWatch({ control, name: "subject" });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

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

  const [updateLiveClass, { isLoading }] = useUpdateLiveClassMutation();

  // Function to convert UTC time to local datetime string for input
  const utcToLocalDateTime = (utcString) => {
    if (!utcString) return "";

    const date = new Date(utcString);
    if (isNaN(date.getTime())) return "";

    // Format to YYYY-MM-DDTHH:MM for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    if (selectedLiveClass) {
      reset({
        title: selectedLiveClass.title,
        classNumber: selectedLiveClass.classNo,
        description: selectedLiveClass.description,
        instructor: selectedLiveClass.instructor,
        startTime: utcToLocalDateTime(selectedLiveClass.startTime),
      });
      setImagePreview(selectedLiveClass.thumbnail || null);
      setSelectedFile(null);
    }
  }, [selectedLiveClass, reset]);

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

  const onSubmit = async (data) => {
    const formData = new FormData();
    const liveClassInfo = {
      courseSubjectChapterId: data.chapter,
      title: data.title,
      description: data.description,
      instructor: data.instructor,
      startTime: data.startTime,
    };

    formData.append("data", JSON.stringify(liveClassInfo));
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      const res = await updateLiveClass({
        id: selectedLiveClass.id,
        formData,
      }).unwrap();
      // console.log(res);
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Live Class Updated Successfully",
          timer: 1000,
        });
        refetchLiveClasses();
        onOpenChange(false);
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to update live class, please try again"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild />
      <DialogContent className="w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Edit Live Class: {selectedLiveClass?.title}
          </DialogTitle>
        </DialogHeader>

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
                  message: "Description must be at least 3 characters long",
                },
              }}
            />

            <InputField
              label="Description"
              name="description"
              placeholder="Enter class description"
              textarea
              rules={{
                minLength: {
                  required: "Class title is required",
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
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded-md h-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
              />
              {imagePreview && (
                <div className="mt-3 w-24 md:w-32 h-20 md:h-24 relative border rounded-md overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Thumbnail Preview"
                    fill
                    className="object-fill"
                  />
                </div>
              )}
            </div>

            <DialogFooter className="md:col-span-2 flex justify-between pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 text-white hover:bg-green-800"
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
