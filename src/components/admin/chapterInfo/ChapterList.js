"use client";
import React, { useEffect, useMemo, useState } from "react";

import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
import { useSelector } from "react-redux";
import { selectCourse } from "@/redux/Features/courseInfo";

import { ChapterTable } from "./ChapterTable";
import {
  useDeleteCycleSubjectChapterMutation,
  useGetCycleSubjectChaptersQuery,
} from "@/redux/services/chapterAPi";
import ChapterInfoEditDialog from "./ChapterInfoEditDialog";

export function ChapterList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const [selectedChapter, setSelectedChapter] = useState(null);
  const [ChapterEditModalOpen, setChapterEditModalOpen] = useState(false);

  const course = useSelector(selectCourse);
  const courseId = course?.id;
  const { data, isError, isLoading } = useGetCycleSubjectChaptersQuery({
    page,
    limit,
    searchTerm: searchQuery,
    courseId,
  });

  const ChapterData = data?.data?.data;
  const meta = data?.data?.meta;

  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  const sortedChapter = useMemo(() => {
    return ChapterData;
  }, [ChapterData]);
  const handleChapterEditModal = (Chapter) => {
    setSelectedChapter(Chapter);

    setChapterEditModalOpen(true);
  };
  const [deleteCycleSubjectChapter] = useDeleteCycleSubjectChapterMutation();

  const handleChapterDelete = async (Chapter) => {
    console.log("Chapter", Chapter);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete the Chapter titled "${Chapter?.chapter?.chapterName}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteCycleSubjectChapter(Chapter.id).unwrap();

        Swal.fire({
          title: "Deleted!",
          text: `"${Chapter?.chapter?.chapterName} has been successfully deleted.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "An error occurred while deleting the Chapter. Please try again.",
          icon: "error",
        });
      }
    }
  };

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        Failed to load Chapter listings.
      </div>
    );

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h2 className="text-xl md:text-3xl font-bold text-center text-gray-800 dark:text-white pt-5">
        {" "}
        Chapter List {course?.title}
      </h2>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        Manage the uploaded Chapter
      </p>

      <div className="p-2">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search by title ..."
        />
      </div>

      {sortedChapter.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No Chapter Found</div>
      ) : (
        <>
          <ChapterTable
            Chapters={sortedChapter}
            handleDelete={handleChapterDelete}
            handlechapterEditModal={handleChapterEditModal}
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

      <ChapterInfoEditDialog
        chapter={selectedChapter}
        isOpen={ChapterEditModalOpen}
        onOpenChange={setChapterEditModalOpen}
      />
    </div>
  );
}
