"use client";

import React, { useState, useMemo, useEffect } from "react";
import PaginationControls from "../utilities/PaginationControls";
import CycleSubjectInfoEditDialog from "./CycleSubjectInfoEditDialog";
import CycleSubjectTable from "./CycleSubjectTable";
import SearchBar from "../utilities/SearchBar";
import Loading from "../utilities/Loading";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";
import { useGetAllCycleSubjectsByCourseIdQuery } from "@/redux/services/cycleSubjectApi";

export default function CycleSubjectsLists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [selectedCycleSubject, setSelectedCycleSubject] = useState(null);
  const [cycleSubjectEditModalOpen, setCycleSubjectEditModalOpen] =
    useState(false);

  const course = useSelector(selectCourse);
  const courseId = course?.id;

  const { data, isLoading, isError } = useGetAllCycleSubjectsByCourseIdQuery({
    page,
    limit,
    searchTerm: searchQuery,
    courseId,
  });

  const cycleSubjectsData = data?.data?.data;
  const meta = data?.data?.meta;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  const sortedContents = useMemo(() => {
    return cycleSubjectsData;
  }, [cycleSubjectsData]);

  const handleCycleSubjectEditModal = (subject) => {
    setSelectedCycleSubject(subject);
    setCycleSubjectEditModalOpen(true);
  };

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to load cycle subjects.
      </div>
    );
  }

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        Existing Cycle Subjects for {course?.title}
      </h2>

      <p className="text-xs md:text-sm text-muted-foreground text-center mb-4">
        Manage and organize subjects for each cycle seamlessly
      </p>

      {/* Search Bar */}
      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search Cycle ..."
        />
      </div>

      {sortedContents.length === 0 ? (
        <div className="text-center text-gray-500 py-4">
          No Cycle Subjects Found
        </div>
      ) : (
        <>
          <CycleSubjectTable
            cycleSubjects={sortedContents}
            handleCycleSubjectEditModal={handleCycleSubjectEditModal}
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

      {/* Cycle Subject Edit Modal */}
      <CycleSubjectInfoEditDialog
        subject={selectedCycleSubject}
        isOpen={cycleSubjectEditModalOpen}
        onOpenChange={setCycleSubjectEditModalOpen}
      />
    </div>
  );
}
