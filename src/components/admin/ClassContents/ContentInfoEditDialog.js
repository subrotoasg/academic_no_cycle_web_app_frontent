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
import { useUpdateClassContentMutation } from "@/redux/services/contentsApi";

export default function ContentInfoEditDialog({
  isOpen,
  onOpenChange,
  selectedContent,
  refetchClassContents,
}) {
  // const STORAGE_ZONE_BASE = "https://fai-cg.b-cdn.net";
  const STORAGE_ZONE_BASE = "https://iframe.mediadelivery.net/play";
  const types = [
    // { label: "Free Teachimint", value: "Free" },
    // { label: "Premium Teachimint", value: "Premium" },
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

  const { reset, handleSubmit, control } = methods;

  const videoType = useWatch({ control, name: "type" });
  const videoId = useWatch({ control, name: "videoId" });
  const libraryId = useWatch({ control, name: "libraryId" });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [updateClassContent, { isLoading }] = useUpdateClassContentMutation();

  useEffect(() => {
    if (selectedContent) {
      reset({
        courseTitle:
          selectedContent?.courseSubjectChapter?.courseSubject?.course
            ?.productName || "",
        type: selectedContent?.hostingType || "",
        subject:
          selectedContent?.courseSubjectChapter?.courseSubject?.subject
            ?.title || "",
        chapter:
          selectedContent?.courseSubjectChapter?.chapter?.chapterName || "",
        title: selectedContent?.classTitle || "",
        classNumber: selectedContent?.classNo || "",
        description: selectedContent?.description || "",
        lectureSheetId: selectedContent?.lectureSheet || "",
        practiceSheetId: selectedContent?.practiceSheet || "",
        solutionSheetId: selectedContent?.solutionSheet || "",
        videoId: selectedContent?.videoUrl || "",
        libraryId: selectedContent?.libraryId || "",
        instructor: selectedContent?.instructor || "",
        // startTime: selectedContent?.startTime,
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
      // startTime: data.startTime,
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
  const getBunnyVideoUrl = (videoId, libraryId) => {
    // if (!videoId || !libraryId) return "";
    return `${STORAGE_ZONE_BASE}/${libraryId}/${videoId}`;
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
            <InputField label="Course Title" name="courseTitle" readOnly />

            <InputField label="Subject Title" name="subject" readOnly />

            <InputField label="Chapter Name" name="chapter" readOnly />

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
              {/* {videoId && videoType === "vimeo" && (
                <div className="w-full mt-2">
                  <iframe
                    src={videoId}
                    title="Vimeo video player"
                    width="100%"
                    height="450"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg shadow-md"
                  ></iframe>
                </div>
              )} */}
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

            {/* Buttons */}
            <DialogFooter className="md:col-span-2 flex justify-between pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-600 text-white hover:bg-green-800"
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>

              <Button
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
