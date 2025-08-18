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
import { useForm, FormProvider } from "react-hook-form";
import InputField from "@/components/form/InputField";
import Dropdown from "@/components/form/Dropdown";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { useUpdateFeaturedMutation } from "@/redux/services/featuredApi";

export default function FeaturedInfoEditDialog({
  isOpen,
  onOpenChange,
  featured,
  refetchFeatures,
}) {
  const methods = useForm({
    defaultValues: {
      title: "",
      type: "",
      description: "",
      discount: "",
      coupne: "",
      // link: "",
    },
  });
  const [updateFeatured, { isLoading }] = useUpdateFeaturedMutation();
  const { reset, handleSubmit, watch } = methods;
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (featured) {
      reset({
        title: featured.title || "",
        type: featured.type || "",
        description: featured.description || "",
        coupne: featured.coupne || "",
        // link: featured.url || "",
      });

      setImagePreview(featured.image || null);
      setSelectedFile(featured.image || null);
    }
  }, [featured, reset]);

  const selectedType = watch("type");

  useEffect(() => {
    if (selectedType !== "Coupon") {
      methods.setValue("coupne", "");
    }
  }, [selectedType, methods]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleFormSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("Please upload an image file");
      return;
    }

    const formData = new FormData();
    const FeaturedInfo = {
      title: data.title,
      type: data.type,
      description: data.description,
      coupne: data.coupne,
    };

    formData.append("file", selectedFile);
    formData.append("data", JSON.stringify(FeaturedInfo));

    try {
      const res = await updateFeatured({ id: featured.id, formData }).unwrap();
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Featured Info Successfully Updated!",
          timer: 1500,
        });
        onOpenChange(false);
        await refetchFeatures();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update Featured");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            Edit Featured Item
          </DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2"
          >
            <InputField
              label="Feature Title"
              name="title"
              placeholder="Enter the title"
              rules={{ required: "Title is required." }}
            />

            <Dropdown
              label="Feature Type"
              name="type"
              options={[
                { label: "Discount", value: "Discount" },
                { label: "Offer", value: "Offer" },
                { label: "Coupon", value: "Coupon" },
              ]}
              rules={{ required: "Type is required." }}
            />

            <InputField
              label="Description"
              name="description"
              placeholder="Enter a short description"
              textarea
            />

            {selectedType === "Coupon" && (
              <InputField
                label="Coupon Code"
                name="coupne"
                placeholder="Coupon code"
                rules={{ required: "Coupon code is required for Coupon type." }}
              />
            )}
            {/* <div className="md:col-span-2 ">
              <InputField
                label="External Link"
                name="link"
                type="url"
                placeholder="https://example.com"
              />
            </div> */}

            {/* Image Upload */}
            <div className="md:col-span-2 mt-1">
              <label
                htmlFor="image-upload"
                className="block text-sm font-medium"
              >
                Upload Image
              </label>
              <div className="mt-2 w-48 md:w-64 relative border rounded-md overflow-hidden">
                <Image
                  src={imagePreview || "/placeholder.jpg"}
                  alt="Image Preview"
                  width={300}
                  height={200}
                  className="w-full h-auto rounded-md object-cover"
                />
              </div>

              <input
                id="image-upload"
                name="image"
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="w-full p-2 mt-2 border rounded-md"
              />
            </div>

            <DialogFooter className="md:col-span-2 flex justify-between pt-4">
              <Button
                type="submit"
                variant="primary"
                className="bg-green-600 text-white hover:bg-green-800"
                disabled={isLoading}
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
