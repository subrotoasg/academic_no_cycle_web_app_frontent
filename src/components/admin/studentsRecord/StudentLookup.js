"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Dropdown from "@/components/form/Dropdown";
import InputField from "@/components/form/InputField";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Search, Pencil } from "lucide-react";
import {
  useGetStudentByAccessCodeQuery,
  useGetStudentByEmailOrPhoneQuery,
  useUpdateStudentMutation,
} from "@/redux/services/studentApi";
import { toast } from "sonner";
import Image from "next/image";
import Swal from "sweetalert2";

//  Student Info Edit
function StudentEditDialog({ student, onClose, onUpdated }) {
  const methods = useForm({
    defaultValues: {
      email: student?.email || "",
      phone: student?.phone || "",
    },
  });
  const { handleSubmit, register, reset } = methods;
  const [updateStudent, { isLoading }] = useUpdateStudentMutation();

  const onSubmit = async (formData) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to update student "${student?.name}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    });

    if (result.isConfirmed) {
      try {
        const trimmedEmail = formData.email.trim();
        const trimmedPhone = formData.phone.trim();
        const res = await updateStudent({
          id: student?.id,
          email: trimmedEmail,
          phone: trimmedPhone,
        }).unwrap();

        if (res?.success) {
          Swal.fire({
            title: "Updated!",
            text: `"${student?.name}" was updated successfully.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          onUpdated((prev) => ({
            ...prev,
            email: formData.email,
            phone: formData.phone,
          }));

          reset();
          onClose();
          // window.location.reload();
        }
      } catch (error) {
        // console.log(error);
        toast.error(error.data.message || "Student Info Updation failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md relative">
        {/* Cross button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">
          Edit Student Info
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Email"
            name="email"
            {...register("email")}
            placeholder="Enter email"
          />
          <InputField
            label="Phone"
            name="phone"
            {...register("phone")}
            placeholder="Enter phone"
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              onClick={onClose}
              className="bg-red-600 text-white hover:bg-red-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white hover:bg-green-800"
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StudentLookup() {
  const methods = useForm({
    defaultValues: { criteria: "accessCode", value: "" },
  });
  const { handleSubmit, reset } = methods;

  const [searchParams, setSearchParams] = useState({
    value: "",
    criteria: "accessCode",
  });
  const [displayStudent, setDisplayStudent] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    data: studentByEmail,
    isFetching: isFetchingEmail,
    error: errorEmail,
    isSuccess: isSuccessEmail,
    isError: isErrorEmail,
  } = useGetStudentByEmailOrPhoneQuery(
    searchParams.criteria === "emailPhone" ? searchParams.value : "",
    {
      skip:
        searchParams.criteria !== "emailPhone" || !searchParams.value.trim(),
    }
  );

  const {
    data: studentByCode,
    isFetching: isFetchingCode,
    error: errorCode,
    isSuccess: isSuccessCode,
    isError: isErrorCode,
  } = useGetStudentByAccessCodeQuery(
    searchParams.criteria === "accessCode" ? searchParams.value : "",
    {
      skip:
        searchParams.criteria !== "accessCode" || !searchParams.value.trim(),
    }
  );

  const isFetching = isFetchingEmail || isFetchingCode;

  // Handle search results
  useEffect(() => {
    if (searchParams.criteria === "accessCode") {
      if (
        isSuccessCode &&
        (studentByCode?.data?.student || studentByCode?.data?.invoice)
      ) {
        setDisplayStudent({
          ...studentByCode.data.student,
          enrollments: studentByCode.data.enrollments || [],
          invoice: studentByCode.data?.invoice || null,
        });
        setHasSearched(true);
      } else if (isErrorCode) {
        setDisplayStudent(null);
        setHasSearched(true);
      }
    } else if (searchParams.criteria === "emailPhone") {
      if (
        isSuccessEmail &&
        (studentByEmail?.data?.student || studentByEmail?.data?.invoice)
      ) {
        setDisplayStudent({
          ...studentByEmail.data.student,
          enrollments: studentByEmail.data.enrollments || [],
          invoice: studentByEmail.data?.invoice || null,
        });
        setHasSearched(true);
      } else if (isErrorEmail) {
        setDisplayStudent(null);
        setHasSearched(true);
      }
    }
  }, [
    studentByCode,
    studentByEmail,
    isSuccessCode,
    isSuccessEmail,
    isErrorCode,
    isErrorEmail,
    searchParams,
  ]);

  // Handle API errors
  useEffect(() => {
    if (errorEmail || errorCode) {
      toast.error("Failed to load student info.");
    }
  }, [errorEmail, errorCode]);

  // Form submission handler
  const onSubmit = useCallback((formData) => {
    const trimmedValue = formData.value.trim();

    if (!trimmedValue) {
      toast.error("Please enter a search value");
      return;
    }

    setDisplayStudent(null);
    setHasSearched(true);

    setSearchParams({
      value: trimmedValue,
      criteria: formData.criteria,
    });
  }, []);

  const handleClearResults = useCallback(() => {
    setDisplayStudent(null);
    setHasSearched(false);
    setSearchParams({
      value: "",
      criteria: "accessCode",
    });
    reset({ criteria: "accessCode", value: "" });
  }, [reset]);
  const hasStudentData = (student) => {
    if (!student) return false;
    const { name, email, phone, address, status, enrollments, invoice } =
      student;
    return (
      name ||
      email ||
      phone ||
      address ||
      status ||
      (enrollments && enrollments.length > 0) ||
      invoice
    );
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-lg rounded-2xl space-y-2">
      <h1 className="text-xl md:text-3xl font-bold text-center">
        Student Lookup
      </h1>
      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Search student records by Access Code or Email/Phone
      </p>

      <div className="pt-6">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 gap-4 max-w-xl p-4 mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md"
          >
            <Dropdown
              label="Search Criteria"
              name="criteria"
              options={[
                { label: "Access Code", value: "accessCode" },
                { label: "Email / Phone", value: "emailPhone" },
              ]}
              rules={{ required: "Please select a criteria" }}
            />

            <InputField
              label="Enter Value"
              name="value"
              placeholder="Enter code, email, or phone"
              rules={{ required: "This field is required" }}
            />

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isFetching}
                className="flex-1 bg-blue-400 text-sm md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFetching ? "Searching..." : "Search"}
                <Search className="ml-2 h-5 w-5" />
              </Button>

              {(hasSearched || displayStudent) && (
                <Button
                  type="button"
                  onClick={handleClearResults}
                  variant="outline"
                  disabled={isFetching}
                >
                  Clear
                </Button>
              )}
            </div>
          </form>
        </FormProvider>

        {/* Result Section */}
        {hasSearched ? (
          <div className="mt-6 max-w-xl mx-auto">
            {isFetching ? (
              <div className="flex justify-center items-center space-x-2 text-blue-500">
                <Loader2 className="animate-spin h-6 w-6" />
                <span>Loading student info...</span>
              </div>
            ) : hasStudentData(displayStudent) ? (
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <CardTitle className="text-base md:text-2xl text-center flex-1">
                    Student Info
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsEditOpen(true)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {displayStudent?.name && (
                    <p>
                      <strong>Name:</strong> {displayStudent?.name}
                    </p>
                  )}
                  {displayStudent?.email && (
                    <p>
                      <strong>Email:</strong> {displayStudent?.email}
                    </p>
                  )}
                  {displayStudent?.phone && (
                    <p>
                      <strong>Phone:</strong> {displayStudent?.phone}
                    </p>
                  )}
                  {displayStudent?.address && (
                    <p>
                      <strong>Address:</strong> {displayStudent?.address}
                    </p>
                  )}
                  {displayStudent?.status && (
                    <p>
                      <strong>Status:</strong> {displayStudent?.status}
                    </p>
                  )}
                  {displayStudent?.profilePhoto && (
                    <div className="flex items-center gap-2">
                      <strong>Profile Photo:</strong>
                      <Image
                        src={displayStudent?.profilePhoto}
                        alt={displayStudent?.name || "Student"}
                        className="w-16 h-16 object-cover rounded-full"
                        height={64}
                        width={64}
                      />
                    </div>
                  )}

                  {/* Courses */}
                  {displayStudent?.enrollments?.length > 0 && (
                    <div>
                      <strong>Course Lists:</strong>
                      <ol className="ml-4 list-decimal space-y-1">
                        {displayStudent?.enrollments.map((c, index) => (
                          <li
                            key={`${c?.accessCode}-${index}`}
                            className="break-words"
                          >
                            <div className="pt-2">
                              <span>
                                <strong>Product Name:</strong>{" "}
                                {c?.course?.productName || "N/A"}
                              </span>
                              <br />
                              <span>
                                <strong>Access Code:</strong>{" "}
                                {c?.accessCode || "N/A"}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {/* Invoice */}
                  {displayStudent?.invoice && (
                    <p>
                      <strong>Invoice:</strong>{" "}
                      <a
                        href={displayStudent?.invoice}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        View Invoice
                      </a>
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <p className="text-center text-sm text-red-500 mt-4">
                No student found with the given criteria.
              </p>
            )}
          </div>
        ) : null}
      </div>

      {isEditOpen && (
        <StudentEditDialog
          student={displayStudent}
          onClose={() => setIsEditOpen(false)}
          onUpdated={(updater) =>
            setDisplayStudent((prev) =>
              typeof updater === "function" ? updater(prev) : updater
            )
          }
        />
      )}
    </div>
  );
}
