"use client";

import React from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Dropdown from "@/components/form/Dropdown";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { toast } from "sonner";
import { Select } from "antd";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";

import { useCreateCycleSubjectMutation } from "@/redux/services/cycleSubjectApi";
import { useGetCyclesByCourseIdQuery } from "@/redux/services/cycleCreateApi";
import { useGetSubjectsQuery } from "@/redux/services/subjectApi";

export default function CycleSubjectForm() {
  const course = useSelector(selectCourse);
  const courseId = course?.id;
  //  Load cycles by courseId
  const {
    data: cycleData,
    isLoading,
    isError,
    refetch,
  } = useGetCyclesByCourseIdQuery(courseId);
  const cycles = cycleData?.data || [];

  // Load all subjects
  const {
    data: subjectData,
    isLoading: isSubjectLoading,
    isError: isSubjectError,
  } = useGetSubjectsQuery();
  const subjects = subjectData?.data || [];

  //  Create Cycle-Subject
  const [createCycleSubject, { isLoading: isCreating }] =
    useCreateCycleSubjectMutation();

  const methods = useForm({
    defaultValues: {
      cycleId: "",
      subjectIds: [],
    },
  });

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = methods;

  const onSubmit = async (data) => {
    const payload = {
      cycleId: data.cycleId,
      subjectId: data.subjectIds,
    };

    try {
      await createCycleSubject(payload).unwrap();
      Swal.fire({
        icon: "success",
        title: "Subjects Added to Cycle Successfully!",
        timer: 1500,
      });
      reset();
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to add subjects to cycle. Try again!"
      );
    }
  };

  const cycleOptions = cycles.map((cycle) => ({
    label: cycle.title,
    value: cycle.id,
  }));

  const subjectOptions = subjects.map((subject) => ({
    label: subject.title,
    value: subject.id,
  }));

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 gap-4 p-6 max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md"
      >
        <Dropdown
          label="Select Cycle"
          name="cycleId"
          options={cycleOptions}
          placeholder="Choose a cycle"
          rules={{ required: "Cycle selection is required." }}
        />

        <div>
          <label className="block mb-1 font-medium">Select Subjects</label>
          <Controller
            name="subjectIds"
            control={control}
            rules={{ required: "At least one subject is required" }}
            render={({ field }) => (
              <Select
                mode="multiple"
                allowClear
                placeholder="Please select subjects"
                style={{ width: "100%" }}
                {...field}
                options={subjectOptions}
              />
            )}
          />
          {errors.subjectIds && (
            <p className="text-red-500 text-sm">{errors.subjectIds.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isCreating}
          className="w-full bg-blue-400 text-xs md:text-base text-white py-2 px-4 rounded-sm hover:rounded-3xl hover:bg-blue-700 transition flex justify-center items-center dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? "Adding..." : "Add Subject"}
        </Button>
      </form>
    </FormProvider>
  );
}
