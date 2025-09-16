"use client";
import React, { useEffect, useMemo, useState } from "react";

import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
import { ChapterTable } from "./ChapterTable";
import ChapterInfoEditDialog from "./ChapterInfoEditDialog";
import CourseSelect from "@/components/form/CourseSelect";
import LoadingData from "@/components/common/LoadingData";
import { useGetAllCourseQuery } from "@/redux/services/courseApi";
import { useGetAllCourseCycleBasedOnCourseIdQuery } from "@/redux/services/cycleApi";
import {
  useDeleteCycleSubjectChapterMutation,
  useGetAllChaptersByCycleIdQuery,
} from "@/redux/services/cycleChapterApi";
import CycleSelect from "@/components/form/CycleSelect";

export function ChapterList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedCycleId, setSelectedCycleId] = useState("");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [ChapterInfoModalOpen, setChapterInfoModalOpen] = useState(false);
  const [ChapterEditModalOpen, setChapterEditModalOpen] = useState(false);
  const { data: courseData } = useGetAllCourseQuery({ limit: 1000 });
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
    { courseId: selectedCourseId, limit: 100 },
    { skip: !selectedCourseId }
  );
  useEffect(() => {
    if (cycleData?.data?.length > 0 && !selectedCycleId) {
      setSelectedCycleId(cycleData?.data[0]?.id);
    }
  }, [cycleData, selectedCycleId]);

  const { data, isError, isLoading, isFetching } =
    useGetAllChaptersByCycleIdQuery(
      {
        page,
        limit,
        searchTerm: searchQuery,
        cycleId: selectedCycleId,
      },
      {
        skip: !selectedCycleId,
      }
    );
  // console.log(data);

  const ChapterData = data?.data?.data;
  const meta = data?.data?.meta;
  const totalPages = meta?.totalCount ? Math.ceil(meta?.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setSearchQuery("");
    setPage(1);
  }, [selectedCourseId]);
  const sortedChapter = useMemo(() => {
    return ChapterData;
  }, [ChapterData]);
  const handleChapterEditModal = (Chapter) => {
    setSelectedChapter(Chapter);
    setChapterEditModalOpen(true);
  };
  const handleChapterInfoModal = (Chapter) => {
    setSelectedChapter(Chapter);
    setChapterInfoModalOpen(true);
  };
  const [deleteCycleSubjectChapter] = useDeleteCycleSubjectChapterMutation();

  const handleChapterDelete = async (Chapter) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete the Chapter titled "${
        Chapter?.title || Chapter?.chapter?.chapterName
      }". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteCycleSubjectChapter(Chapter?.id).unwrap();
        // console.log(res);
        if (res?.success) {
          Swal.fire({
            title: "Deleted!",
            text: `${
              Chapter?.title || Chapter?.chapter?.chapterName
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
            "An error occurred while deleting the Chapter. Please try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">
        Course Chapter List
      </h1>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Browse, edit, or delete the uploaded Chapter
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
      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by chapter name ..."
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="w-full flex justify-center py-8">
          <LoadingData />
        </div>
      )}

      {isError && !(isLoading || isFetching) && (
        <div className="text-center text-red-500 py-4">
          Failed to load Chapters.
        </div>
      )}

      {!(isLoading || isFetching) && !isError && (
        <>
          {!selectedCycleId || sortedChapter?.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No Chapters Found
            </div>
          ) : (
            <>
              <ChapterTable
                Chapters={sortedChapter}
                handleDelete={handleChapterDelete}
                handlechapterEditModal={handleChapterEditModal}
                handleChapterInfoModal={handleChapterInfoModal}
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

      <ChapterInfoEditDialog
        chapter={selectedChapter}
        isOpen={ChapterEditModalOpen}
        onOpenChange={setChapterEditModalOpen}
      />
    </div>
  );
}
