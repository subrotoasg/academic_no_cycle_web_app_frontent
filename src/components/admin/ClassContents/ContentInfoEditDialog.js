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
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useUpdateClassContentMutation } from "@/redux/services/contentsApi";
import { useGetSubjectsByCourseIdQuery } from "@/redux/services/subjectsApi";
import { useGetChaptersByCourseSubjectIdQuery } from "@/redux/services/chapterAPi";
import { selectAllCourses } from "@/redux/Features/courseInfo";

export default function ContentInfoEditDialog({
  isOpen,
  onOpenChange,
  selectedContent,
  refetchClassContents,
}) {
  // console.log(selectedContent);
  const types = [
    { label: "Free Youtube", value: "freeyt" },
    { label: "Premium Youtube", value: "premyt" },
    { label: "Bunny CDN", value: "bunny" },
  ];

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

  const methods = useForm();

  // set value
  const { reset, handleSubmit, control, setValue } = methods;

  const videoType = useWatch({ control, name: "type" });
  const videoId = useWatch({ control, name: "videoId" });
  const libraryId = useWatch({ control, name: "libraryId" });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [updateClassContent, { isLoading }] = useUpdateClassContentMutation();

  const selectedCourseId = useWatch({ control, name: "courseId" });
  const selectedSubjectId = useWatch({ control, name: "subject" });

  // Courses List
  const courses = useSelector(selectAllCourses);
  const courseOptions =
    courses?.data?.map((course) => ({
      label: course.productFullName,
      value: course.id,
    })) || [];

  // Subjects List
  const { data: subjects, isLoading: isSubjectLoading } =
    useGetSubjectsByCourseIdQuery(selectedCourseId, {
      skip: !selectedCourseId,
    });

  const subjectOptions = isSubjectLoading
    ? [{ label: "Loading subjects...", value: "" }]
    : subjects?.data?.length
    ? subjects.data.map((sub) => ({
        label: sub.subject.title,
        value: sub.id,
      }))
    : [{ label: "No subjects available", value: "" }];

  // Chapters List
  const { data: chapters, isLoading: isChapterLoading } =
    useGetChaptersByCourseSubjectIdQuery(selectedSubjectId, {
      skip: !selectedSubjectId,
    });

  const chapterOptions = isChapterLoading
    ? [{ label: "Loading chapters...", value: "" }]
    : chapters?.data?.length
    ? chapters.data.map((ch) => ({
        label: ch.chapter.chapterName,
        value: ch.id,
      }))
    : [{ label: "No chapters available", value: "" }];

  useEffect(() => {
    if (selectedContent) {
      reset({
        courseId:
          selectedContent?.courseSubjectChapter?.courseSubject?.course?.id ||
          "",
        subject: selectedContent?.courseSubjectChapter?.courseSubject?.id || "",
        chapter: selectedContent?.courseSubjectChapter?.id || "",
        type: selectedContent?.hostingType || "",
        title: selectedContent?.classTitle || "",
        classNumber: selectedContent?.classNo || "",
        description: selectedContent?.description || "",
        lectureSheetId: selectedContent?.lectureSheet || "",
        practiceSheetId: selectedContent?.practiceSheet || "",
        solutionSheetId: selectedContent?.solutionSheet || "",
        videoId: selectedContent?.videoUrl || "",
        libraryId: selectedContent?.libraryId || "",
        instructor: selectedContent?.instructor || "",
      });

      setThumbnailPreview(selectedContent?.thumbneil || null);
      setSelectedFile(null);
    }
  }, [selectedContent, reset]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
    }
  };

  const handleFormSubmit = async (data) => {
    const formData = new FormData();

    const contentInfo = {
      courseSubjectChapterId: data.chapter,
      hostingType: data.type,
      classTitle: data.title,
      classNo: data.classNumber,
      description: data.description,
      videoUrl: data.videoId,
      libraryId: data.libraryId,
      lectureSheet: data.lectureSheetId,
      practiceSheet: data.practiceSheetId,
      solutionSheet: data.solutionSheetId,
      instructor: data.instructor,
    };

    formData.append("data", JSON.stringify(contentInfo));
    if (selectedFile) {
      formData.append("files", selectedFile);
    }

    try {
      const res = await updateClassContent({
        id: selectedContent.id,
        formData,
      }).unwrap();

      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Class Content Successfully Updated",
          timer: 1500,
        });
        refetchClassContents();
        onOpenChange(false);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to Update Class Content");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Content Edit for{" "}
            {
              selectedContent?.courseSubjectChapter?.courseSubject?.subject
                ?.title
            }
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 rounded-lg"
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

            <Dropdown
              label="Video Hosting Type"
              name="type"
              options={types}
              rules={{ required: "Hosting type is required" }}
            />

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
                min: {
                  value: 1,
                  message: "Chapter number must be start from 1",
                },
              }}
              min={1}
            />

            <InputField
              label="Content Description"
              name="description"
              placeholder="Provide a content description"
              textarea
            />
            <Dropdown
              label="Instructor"
              name="instructor"
              options={instructorOptions}
              rules={{ required: "Instructor is required" }}
            />

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
            {videoType === "bunny" && (
              <InputField
                label="Library Id"
                name="libraryId"
                placeholder="Enter Bunny Library Id"
                rules={{ required: "Library Id is required for Bunny hosting" }}
              />
            )}
            {/* <div className="md:col-span-2 mt-2"> */}
            <InputField
              label="Youtube Video Id"
              name="videoId"
              type="text"
              placeholder="Enter the correct video Id"
            />
            {/* </div> */}

            <div className="md:col-span-2" id="video_thumb">
              {videoId &&
                (videoType === "freeyt" || videoType === "premyt") && (
                  <div className="w-full mt-2">
                    <iframe
                      width="100%"
                      height="auto"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg shadow-md"
                    ></iframe>
                  </div>
                )}
              {videoId && videoType === "bunny" && libraryId && (
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
              )}
            </div>

            {/* Thumbnail Upload */}
            <div className="md:col-span-2 mt-2">
              <label htmlFor="thumbnail" className="block text-sm font-medium">
                Thumbnail Image
              </label>

              <div className="mt-2 w-48 md:w-64 relative rounded-md overflow-hidden">
                <Image
                  src={thumbnailPreview || "/placeholder.jpg"}
                  alt="Thumbnail Preview"
                  width={300}
                  height={200}
                  className="w-24 h-16 rounded-md object-cover"
                />
              </div>

              <input
                id="thumbnail"
                name="thumbnail"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded-md h-10 dark:bg-gray-800 dark:text-white dark:border-gray-700 p-2 mt-1"
              />
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
