"use client";
import React, { useEffect, useMemo, useState } from "react";

import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
import { SubjectsTable } from "./SubjectTable";
import SubjectsImageEditDialog from "./SubjectInfoEditDialog";
import CourseSelect from "@/components/form/CourseSelect";
import LoadingData from "@/components/common/LoadingData";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { useGetAllCourseCycleBasedOnCourseIdQuery } from "@/redux/services/cycleApi";
import CycleSelect from "@/components/form/CycleSelect";
import {
  useDeleteCycleSubjectMutation,
  useGetCycleSubjectsByCycleIdQuery,
} from "@/redux/services/cycleSubjectApi";

export function SubjectList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [SubjectInfoModalOpen, setSubjectInfoModalOpen] = useState(false);
  const [SubjectEditModalOpen, setSubjectEditModalOpen] = useState(false);
  const { data: courseData } = useGetAllCourseQuery({ limit: 1000 });
  // console.log(courseData?.data?.data);
  const courses = courseData?.data;

  useEffect(() => {
    if (courses?.data?.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses?.data[0]?.id);
    }
  }, [courses, selectedCourseId]);
  const {
    data: cycleData,
    isLoading: cycleLoading,
    isError: cycleError,
  } = useGetAllCourseCycleBasedOnCourseIdQuery(
    { courseId: selectedCourseId, limit },
    { skip: !selectedCourseId }
  );
  // console.log(cycleData);

  useEffect(() => {
    if (cycleData?.data?.length > 0 && !selectedCycleId) {
      setSelectedCycleId(cycleData?.data[0]?.id);
    }
  }, [cycleData, selectedCycleId]);
  const { data, isError, isLoading, isFetching } =
    useGetCycleSubjectsByCycleIdQuery(
      {
        limit,
        cycleId: selectedCycleId,
      },
      {
        skip: !selectedCycleId,
      }
    );
  // console.log(data);
  const SubjectData = data?.data;
  const meta = data?.data?.meta;

  const totalPages = meta?.totalCount ? Math.ceil(meta?.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery("");
    setPage(1);
  }, [selectedCourseId]);
  const sortedSubject = useMemo(() => {
    return SubjectData;
  }, [SubjectData]);
  const handleSubjectEditModal = (Subject) => {
    setSelectedSubject(Subject);
    setSubjectEditModalOpen(true);
  };
  const handleSubjectInfoModal = (Subject) => {
    setSelectedSubject(Subject);
    setSubjectInfoModalOpen(true);
  };
  const [deleteCycleSubject] = useDeleteCycleSubjectMutation();

  const handleSubjectDelete = async (Subject) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete the Subject titled "${
        Subject?.title || Subject?.subject?.title
      }". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteCycleSubject(Subject?.id).unwrap();
        if (res?.success) {
          Swal.fire({
            title: "Deleted!",
            text: `${
              Subject?.title || Subject?.subject?.title
            } has been successfully deleted.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text:
            error?.data?.message ||
            "An error occurred while deleting the Subject. Please try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">
        Course Subjects List
      </h1>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Uploaded Subjects Management
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CourseSelect
          label="Select Course"
          courses={courses?.data}
          selectedCourseId={selectedCourseId}
          onChange={setSelectedCourseId}
        />
        <CycleSelect
          label="Select Cycle"
          cycles={cycleData?.data}
          selectedCycleId={selectedCycleId}
          onChange={setSelectedCycleId}
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="w-full flex justify-center py-8">
          <LoadingData />
        </div>
      )}

      {isError && !(isLoading || isFetching) && (
        <div className="text-center text-red-500 py-4">
          Failed to load Subjects.
        </div>
      )}

      {!(isLoading || isFetching) && !isError && (
        <>
          {!selectedCycleId || sortedSubject?.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No Subjects Found
            </div>
          ) : (
            <>
              {/* <div className="p-2">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search by title ..."
                />
              </div> */}
              <SubjectsTable
                Subjects={sortedSubject}
                handleDelete={handleSubjectDelete}
                handleSubjectEditModal={handleSubjectEditModal}
                handleSubjectInfoModal={handleSubjectInfoModal}
              />
              {/* <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                pageSize={limit}
                setPageSize={setLimit}
                setCurrentPage={setPage}
                totalItems={meta?.totalCount}
              /> */}
            </>
          )}
        </>
      )}

      <SubjectsImageEditDialog
        Subject={selectedSubject}
        isOpen={SubjectEditModalOpen}
        onOpenChange={setSubjectEditModalOpen}
      />
    </div>
  );
}
