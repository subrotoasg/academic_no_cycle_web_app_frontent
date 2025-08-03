import { useEffect, useState, useRef } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useUpdateCycleClassContentMutation } from "@/redux/services/cycleClassContentApi";
import Image from "next/image";
import InputField from "@/components/form/InputField";
import Dropdown from "@/components/form/Dropdown";
import Swal from "sweetalert2";

const ContentInfoEditDialog = ({
  selectedContent,
  isOpen,
  onOpenChange,
  refetchClassContents,
}) => {
  const types = [
    { label: "Free Teachimint", value: "Free" },
    { label: "Premium Teachimint", value: "Premium" },
    { label: "Free Youtube", value: "freeyt" },
    { label: "Premium Youtube", value: "premyt" },
  ];
  const methods = useForm();
  const { handleSubmit, reset, control } = methods;

  const videoType = useWatch({ control, name: "type" });
  const videoId = useWatch({ control, name: "videoId" });
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const [updateCycleClassContent, { isLoading }] =
    useUpdateCycleClassContentMutation();

  useEffect(() => {
    if (selectedContent) {
      reset({
        courseTitle:
          selectedContent?.cycleSubjectChapter?.cycleSubject?.cycle?.course
            ?.title || "",
        type: selectedContent?.hostingType || "",
        subject:
          selectedContent?.cycleSubjectChapter?.cycleSubject?.subject?.title ||
          "",
        chapter:
          selectedContent?.cycleSubjectChapter?.chapter?.chapterName || "",
        title: selectedContent?.classTitle || "",
        classNumber: selectedContent?.classNo || "",
        description: selectedContent?.description || "",
        lectureSheetId: selectedContent?.lectureSheet || "",
        practiceSheetId: selectedContent?.practiceSheet || "",
        solutionSheetId: selectedContent?.solutionSheet || "",
        videoId: selectedContent?.videoUrl || "",
        cycle:
          selectedContent?.cycleSubjectChapter?.cycleSubject?.cycle?.title ||
          "",
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

  const onSubmit = async (data) => {
    const formData = new FormData();

    const contentInfo = {
      hostingType: data.type,
      classTitle: data.title,
      classNo: data.classNumber,
      description: data.description,
      videoUrl: data.videoId,
      lectureSheet: data.lectureSheetId,
      practiceSheet: data.practiceSheetId,
      solutionSheet: data.solutionSheetId,
    };

    formData.append("data", JSON.stringify(contentInfo));
    if (selectedFile) {
      formData.append("files", selectedFile);
    }

    try {
      await updateCycleClassContent({
        classId: selectedContent.id,
        formData,
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Class Content Successfully Updated",
        timer: 1500,
      });
      refetchClassContents();
      onOpenChange(false);
    } catch (error) {
      toast.error(error.message || "Failed to Update Class Content");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="md:w-1/2 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Content Edit for{" "}
            {selectedContent?.cycleSubjectChapter?.cycleSubject?.subject
              ?.title || ""}
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 rounded-lg"
          >
            <InputField label="Course Title" name="courseTitle" readOnly />
            <InputField label="Cycle Title" name="cycle" readOnly />
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
                  message: "Chapter number must start from 1",
                },
              }}
              min={1}
            />

            <InputField
              label="Content Description"
              name="description"
              placeholder="Provide a content description"
              rules={{ required: "Description is required" }}
              textarea
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

            <div className="md:col-span-2 mt-2">
              <InputField
                label="Youtube Video Id"
                name="videoId"
                type="text"
                placeholder="Enter the correct video Id"
              />
            </div>

            {/* Video Preview */}
            <div className="md:col-span-2" id="video_thumb">
              {videoId &&
                (videoType === "freeyt" || videoType === "premyt") && (
                  <div className="w-full mt-2">
                    <iframe
                      width="100%"
                      height="auto"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="Youtube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg shadow-md"
                    ></iframe>
                  </div>
                )}
              {videoId && videoType === "vimeo" && (
                <div className="w-full mt-2">
                  <iframe
                    src={videoId}
                    title="Youtube video player"
                    width="100%"
                    height="450"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg shadow-md"
                  ></iframe>
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
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="w-full border rounded-md h-10 dark:bg-gray-800 dark:text-white dark:border-gray-700 p-2 mt-1"
              />
            </div>

            {/* Buttons */}
            <DialogFooter className="md:col-span-2 flex justify-between pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-green-700 text-white"
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>

              <Button
                variant="warning"
                onClick={() => onOpenChange(false)}
                className="bg-red-600 text-white"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default ContentInfoEditDialog;
