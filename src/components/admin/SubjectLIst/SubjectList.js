"use client";
import React, { useEffect, useMemo, useState } from "react";

import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
import { useSelector } from "react-redux";

import { SubjectsTable } from "./SubjectTable";
import SubjectsImageEditDialog from "./SubjectInfoEditDialog";
import {
  useDeleteCourseSubjectMutation,
  useGetCourseSubjectQuery,
  useGetSubjectsByCourseIdQuery,
} from "@/redux/services/subjectsApi";
import { selectAllCourses } from "@/redux/Features/courseInfo";

export function SubjectList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [SubjectInfoModalOpen, setSubjectInfoModalOpen] = useState(false);
  const [SubjectEditModalOpen, setSubjectEditModalOpen] = useState(false);

  const { data, isError, isLoading } = useGetCourseSubjectQuery(
    {
      page,
      limit,
      searchTerm: searchQuery,
      courseId: selectedCourseId,
    },
    {
      skip: !selectedCourseId,
    }
  );
  console.log(data);

  const SubjectData = data?.data;
  // console.log(SubjectData);
  const meta = data?.meta;

  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
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
  const [deleteCourseSubject] = useDeleteCourseSubjectMutation();

  const handleSubjectDelete = async (Subject) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete the Subject titled"${Subject?.subject?.title}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteCourseSubject(Subject.id).unwrap();

        Swal.fire({
          title: "Deleted!",
          text: `"${Subject?.Subject?.SubjectName} has been successfully deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the Subject. Please try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">
        Subjects List
      </h1>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Browse, edit, or delete the uploaded Subjects
      </p>

      <div className="p-2 grid grid-cols-2">
        <label className="text-xs md:text-base w-full font-medium text-gray-700 dark:text-gray-300">
          Select Course
        </label>
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-white text-xs md:text-sm"
        >
          <option value="">-- Select Course --</option>
          {courses?.map((course) => (
            <option key={course.id} value={course.id}>
              {course.productName}
            </option>
          ))}
        </select>
      </div>
      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by title ..."
        />
      </div>
      {isLoading && (
        <div className="w-full flex justify-center py-8">
          <Loading />
        </div>
      )}

      {isError && !isLoading && (
        <div className="text-center text-red-500 py-4">
          Failed to load Subjects.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {!selectedCourseId || sortedSubject.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No Subjects Found
            </div>
          ) : (
            <>
              <SubjectsTable
                Subjects={sortedSubject}
                handleDelete={handleSubjectDelete}
                handleSubjectEditModal={handleSubjectEditModal}
                handleSubjectInfoModal={handleSubjectInfoModal}
              />
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                pageSize={limit}
                setPageSize={setLimit}
                setCurrentPage={setPage}
                totalItems={meta?.totalCount}
              />
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
