"use client";
import React, { useEffect, useMemo, useState } from "react";

import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
import { useSelector } from "react-redux";
import { ChapterTable } from "./ChapterTable";
import ChapterInfoEditDialog from "./ChapterInfoEditDialog";
import {
  useDeleteCourseSubjectChapterMutation,
  useGetCourseSubjectChaptersQuery,
} from "@/redux/services/chapterAPi";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import CourseSelect from "@/components/form/CourseSelect";

export function ChapterList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [ChapterInfoModalOpen, setChapterInfoModalOpen] = useState(false);
  const [ChapterEditModalOpen, setChapterEditModalOpen] = useState(false);

  useEffect(() => {
    if (courses?.data?.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses.data[0].id);
    }
  }, [courses, selectedCourseId]);
  const { data, isError, isLoading, isFetching } =
    useGetCourseSubjectChaptersQuery(
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

  const ChapterData = data?.data?.data;
  const meta = data?.data?.meta;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
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
  const [deleteCourseSubjectChapter] = useDeleteCourseSubjectChapterMutation();

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
        const res = await deleteCourseSubjectChapter(Chapter.id).unwrap();
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

      <CourseSelect
        label="Select Course"
        courses={courses?.data}
        selectedCourseId={selectedCourseId}
        onChange={setSelectedCourseId}
      />

      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by chapter name ..."
        />
      </div>

      {(isLoading || isFetching) && (
        <div className="w-full flex justify-center py-8">
          <Loading />
        </div>
      )}

      {isError && !(isLoading || isFetching) && (
        <div className="text-center text-red-500 py-4">
          Failed to load Chapters.
        </div>
      )}

      {!(isLoading || isFetching) && !isError && (
        <>
          {!selectedCourseId || sortedChapter.length === 0 ? (
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
