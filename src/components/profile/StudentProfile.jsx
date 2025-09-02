"use client";
import React, { useEffect, useRef, useState } from "react";
import { Pencil, Save, X, Download, ChevronDown } from "lucide-react";
import { jsPDF } from "jspdf";
import {
  useGetMeQuery,
  useUpdateUserStudentMutation,
} from "@/redux/services/userInfoApi";
import { toast } from "sonner";
import Image from "next/image";
import { store } from "@/redux/store";
import { serverUrl } from "../../../config/config";

const EditableField = ({
  label,
  field,
  value,
  editingField,
  setEditingField,
  onSave,
  type = "text",
  options = [],
  readOnly = false,
}) => {
  const [tempValue, setTempValue] = useState(value || "");

  const handleSave = () => {
    onSave(field, tempValue);
    setEditingField(null);
  };

  const handleCancel = () => {
    setTempValue(value || "");
    setEditingField(null);
  };

  return (
    <div
      className="flex flex-col border rounded-lg p-3 shadow-sm hover:shadow-md transition w-full
                    bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
    >
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </span>
      {editingField === field ? (
        <div className="flex items-center gap-2">
          {type === "select" ? (
            <div className="relative flex-1">
              <select
                className="w-full border rounded px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600 appearance-none"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                autoFocus
              >
                <option value={""}>Select Option</option>
                {options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none"
              />
            </div>
          ) : (
            <input
              type={type}
              className="border rounded px-2 py-1 text-sm flex-1 bg-gray-50 dark:bg-gray-700 dark:text-white border-gray-300 dark:border-gray-600"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              autoFocus
              readOnly={readOnly}
            />
          )}
          <button onClick={handleSave} className="p-1 text-green-600">
            <Save size={16} />
          </button>
          <button onClick={handleCancel} className="p-1 text-red-500">
            <X size={16} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-800 dark:text-gray-200">
            {value || "-"}
          </span>
          {readOnly ? null : (
            <button
              onClick={() => setEditingField(field)}
              className="p-1 text-gray-500 hover:text-blue-500 dark:hover:text-blue-400"
            >
              <Pencil size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const StudentProfile = ({ onUpdate }) => {
  const [updateProfile] = useUpdateUserStudentMutation();
  const { data, isLoading, refetch } = useGetMeQuery();
  const student = data?.data || {};
  const [formData, setFormData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isLoading && student) {
      setFormData(student);
    }
  }, [isLoading, student]);

  const validateName = (value) => {
    if (!value || value.trim().length === 0) {
      toast.error("Please provide your name.");
      return false;
    }

    const length = value.trim().length;

    if (length < 3 || length > 40) {
      toast.error("Name length must be 3 to 40 characters long");
      return false;
    }

    return true; // valid
  };
  //Update and save
  const handleSave = async (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (onUpdate) onUpdate({ [field]: value });

    if (field === "name") {
      const isValid = validateName(value);
      if (!isValid) return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append(field, value);

    try {
      const res = await updateProfile(formDataToSend).unwrap();
      if (res?.success) {
        toast.success(res.message);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Sorry! try again");
    }
  };

  //Profile change
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      // 5MB limit
      toast.error("Image size should be less than 15MB");
      return;
    }

    setIsUploading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("file", file);

    try {
      const res = await updateProfile(formDataToSend).unwrap();
      if (res?.success) {
        toast.success("Profile photo updated successfully");
        refetch();
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to upload photo");
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Options for dropdowns
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    // { value: "Other", label: "Other" },
  ];

  const bloodGroupOptions = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" },
  ];

  const religionOptions = [
    { value: "Islam", label: "Islam" },
    { value: "Hinduism", label: "Hinduism" },
    { value: "Christianity", label: "Christianity" },
    { value: "Buddhism", label: "Buddhism" },
    { value: "Other", label: "Other" },
  ];

  const classOptions = [
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];

  const shiftOptions = [
    { value: "Morning", label: "Morning" },
    { value: "Day", label: "Day" },
  ];

  const sectionOptions = [
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
  ];

  const groupOptions = [
    { value: "Science", label: "Science" },
    { value: "Commerce", label: "Commerce" },
    { value: "Arts", label: "Arts" },
  ];

  const paperOptions = [
    { value: "BIO", label: "Biology" },
    { value: "H.MATH", label: "Higher Math" },
    { value: "ICT", label: "ICT" },
    { value: "PHYSICS", label: "Physics" },
    { value: "CHEMISTRY", label: "Chemistry" },
  ];

  const professionTypeOptions = [
    { value: "Govt.", label: "Government" },
    { value: "Private", label: "Private" },
    { value: "Business", label: "Business" },
    { value: "Others", label: "Others" },
  ];

  const yesNoOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const boardOptions = [
    { value: "Dhaka", label: "Dhaka" },
    { value: "Rajshahi", label: "Rajshahi" },
    { value: "Comilla", label: "Comilla" },
    { value: "Jessore", label: "Jessore" },
    { value: "Chittagong", label: "Chittagong" },
    { value: "Barisal", label: "Barisal" },
    { value: "Sylhet", label: "Sylhet" },
    { value: "Dinajpur", label: "Dinajpur" },
    { value: "Mymensingh", label: "Mymensingh" },
  ];

  const divisionOptions = [
    { value: "Dhaka", label: "Dhaka" },
    { value: "Chittagong", label: "Chittagong" },
    { value: "Rajshahi", label: "Rajshahi" },
    { value: "Khulna", label: "Khulna" },
    { value: "Barisal", label: "Barisal" },
    { value: "Sylhet", label: "Sylhet" },
    { value: "Rangpur", label: "Rangpur" },
    { value: "Mymensingh", label: "Mymensingh" },
  ];

  const renderSection = (title, fields) => (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields?.map(
          ({ label, field, type = "text", options = [], readOnly }) => (
            <EditableField
              key={field}
              label={label}
              field={field}
              value={formData[field]}
              editingField={editingField}
              setEditingField={setEditingField}
              onSave={handleSave}
              type={type}
              options={options}
              readOnly={readOnly}
            />
          )
        )}
      </div>
    </section>
  );

  const renderArrayField = (title, field, values) => (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 border-b pb-2 mb-4">
        {title}
      </h2>
      <div className="flex flex-wrap gap-2">
        {values?.map((v, idx) => (
          <span
            key={idx}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            {v}
          </span>
        ))}
      </div>
    </section>
  );

  const downloadProfile = async () => {
    const state = store.getState();
    const token = state?.auth?.token;
    try {
      const res = await fetch(`${serverUrl}/student/profile/download`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
          "x-access-token": token,
        },
      });
      if (!res.ok) {
        toast.error("Sorry!, Something went wrong");
      }

      // Convert to Blob
      const blob = await res.blob();

      // Create URL for the blob
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "student-profile.pdf";
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg mt-20 relative">
      <button
        onClick={downloadProfile}
        className="absolute top-6 right-6 flex items-center cursor-pointer gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Download size={16} /> Download Profile
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative w-28 h-28 group">
          {/* Profile Image */}
          <Image
            src={formData?.profilePhoto || "/img/avater.png"}
            alt="Student Photo"
            width={112}
            height={112}
            className="w-28 h-28 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700 shadow-sm"
          />

          {/* Overlay */}
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
            <button
              onClick={triggerFileInput}
              disabled={isUploading}
              className="flex items-center gap-1 text-white text-sm font-medium bg-blue-600 px-3 py-1 rounded-full shadow-md hover:bg-blue-700 transition"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-xs cursor-pointer">Change</span>
              )}
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formData?.name || "Unnamed"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 font-bold text-sm">
            {formData?.presentDivision
              ? `${formData?.presentDivision}, Bangladesh`
              : "ACS"}
          </p>
        </div>
      </div>

      {/* Sections */}
      {renderSection("Login Information", [
        { label: "Email", readOnly: true, field: "email", type: "email" },
        { label: "Mobile", readOnly: true, field: "phone", type: "tel" },
        { label: "Emergency Contact", field: "emergencyContact", type: "tel" },
      ])}

      {renderSection("Personal Information", [
        { label: "Name", field: "name" },
        { label: "Date of Birth", field: "dob", type: "date" },
        {
          label: "Religion",
          field: "religion",
          type: "select",
          options: religionOptions,
        },
        {
          label: "Gender",
          field: "gender",
          type: "select",
          options: genderOptions,
        },
        {
          label: "Blood Group",
          field: "bloodGroup",
          type: "select",
          options: bloodGroupOptions,
        },
        {
          label: "Group",
          field: "group",
          type: "text",
          value: "Science",
          readOnly: true,
          // options: groupOptions,
        },
      ])}
      {renderSection("College Information", [
        { label: "College Name", field: "collegeName" },
        { label: "College Address", field: "collegeAddress" },
        { label: "College Session", field: "collegeSession" },
        {
          label: "University Chance",
          field: "universityChance",
          type: "select",
          options: yesNoOptions,
        },
      ])}
      {/* Conditionally render University Information */}
      {formData.universityChance === "Yes" || formData.universityChance === true
        ? renderSection("University Information", [
            { label: "University Name", field: "universityName" },
            { label: "University Subject", field: "universitySubject" },
            { label: "University Session", field: "universitySession" },
            { label: "University Position", field: "universityPosition" },
            { label: "University Roll No", field: "universityRollNo" },
          ])
        : null}

      {renderSection("Father's Information", [
        { label: "Father's Name", field: "fatherName" },
        { label: "NID", field: "fatherNid" },
        { label: "Profession", field: "fatherProfession" },
        {
          label: "Profession Type",
          field: "fatherProfessionType",
          type: "select",
          options: professionTypeOptions,
        },
        { label: "Yearly Income", field: "fatherIncome", type: "text" },
      ])}

      {renderSection("Mother's Information", [
        { label: "Mother's Name", field: "motherName" },
        { label: "NID", field: "motherNid" },
        { label: "Profession", field: "motherProfession" },
        {
          label: "Profession Type",
          field: "motherProfessionType",
          type: "select",
          options: professionTypeOptions,
        },
        { label: "Yearly Income", field: "motherIncome", type: "text" },
      ])}

      {renderSection("Additional Information", [
        { label: "Previous School Name", field: "previousSchool" },
        {
          label: "Disability",
          field: "disability",
          type: "select",
          options: yesNoOptions,
        },
        { label: "Guardian Mobile", field: "guardianMobile", type: "tel" },
      ])}

      {renderSection("Present Address", [
        {
          label: "Division",
          field: "presentDivision",
          type: "select",
          options: divisionOptions,
        },
        { label: "District", field: "presentDistrict" },
        { label: "Upazila", field: "presentUpazila" },
        { label: "Union", field: "presentUnion" },
        { label: "Post Office", field: "presentPostOffice" },
        { label: "Village", field: "presentVillage" },
        { label: "House", field: "presentHouse" },
      ])}

      {renderSection("Permanent Address", [
        {
          label: "Division",
          field: "permanentDivision",
          type: "select",
          options: divisionOptions,
        },
        { label: "District", field: "permanentDistrict" },
        { label: "Upazila", field: "permanentUpazila" },
        { label: "Union", field: "permanentUnion" },
        { label: "Post Office", field: "permanentPostOffice" },
        { label: "Village", field: "permanentVillage" },
        { label: "House", field: "permanentHouse" },
      ])}

      {/* Academic */}
      {renderSection("JSC Information", [
        { label: "Roll No", field: "jscRoll" },
        { label: "Reg No", field: "jscReg" },
        {
          label: "Board",
          field: "jscBoard",
          type: "select",
          options: boardOptions,
        },
        { label: "GPA", field: "jscGpa" },
        { label: "Year", field: "jscYear" },
      ])}

      {renderSection("SSC Information", [
        { label: "Roll No", field: "sscRoll" },
        { label: "Reg No", field: "sscReg" },
        {
          label: "Board",
          field: "sscBoard",
          type: "select",
          options: boardOptions,
        },
        { label: "GPA", field: "sscGpa" },
        { label: "Year", field: "sscYear" },
      ])}

      {renderSection("HSC Information", [
        { label: "Roll No", field: "hscRoll" },
        { label: "Reg No", field: "hscReg" },
        {
          label: "Board",
          field: "hscBoard",
          type: "select",
          options: boardOptions,
        },
        { label: "GPA", field: "hscGpa" },
        { label: "Year", field: "hscYear" },
      ])}
    </div>
  );
};

export default StudentProfile;
