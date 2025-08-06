"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import Loading from "../utilities/Loading";
import ContentTable from "./ContentTable";
import ContentDetailsDialog from "./ContentDetailsDialog";
import ContentInfoEditDialog from "./ContentInfoEditDialog";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import {
  useDeleteClassContentMutation,
  useGetAllClassContentsQuery,
} from "@/redux/services/contentsApi";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import CourseSelect from "@/components/form/CourseSelect";

const ContentList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);
  const [selectedContent, setSelectedContent] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (courses?.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  const {
    data,
    isLoading,
    isError,
    refetch: refetchClassContents,
  } = useGetAllClassContentsQuery(
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

  const [deleteClassContent] = useDeleteClassContentMutation();

  const classContentsData = data?.data?.data;
  // console.log(classContentsData);
  const meta = data?.data?.meta;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const sortedContents = useMemo(() => {
    return classContentsData;
  }, [classContentsData]);

  const handleContentEditModal = (content) => {
    setSelectedContent(content);
    setIsEditModalOpen(true);
  };

  const handleContentInfoModal = (content) => {
    setSelectedContent(content);
    setIsInfoModalOpen(true);
  };

  const handleRedirect = (content) => {
    const query = new URLSearchParams({ title: content.classTitle }).toString();
    const url = `/content/${content.id}?${query}`;
    window.open(url, "_blank");
  };
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return sortedContents;
    return [...sortedContents].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [sortedContents, sortConfig]);

  const handleContentDelete = async (content) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete "${content?.classTitle}" from class contents. This action is irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteClassContent(content.id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: `"${content?.classTitle}" was deleted successfully.`,
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        refetchClassContents();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Something went wrong while deleting. Please try again.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="w-full p-2 lg:p-6 bg-white dark:bg-gray-900 shadow-lg rounded-2xl space-y-4 mt-3">
      <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white text-center">
        Course Contents
      </h2>
      <p className="text-xs md:text-sm text-muted-foreground text-center">
        View and manage all recorded course videos available
      </p>
      <CourseSelect
        label="Select Course"
        courses={courses}
        selectedCourseId={selectedCourseId}
        onChange={setSelectedCourseId}
      />

      {isLoading && (
        <div className="w-full flex justify-center py-8">
          <Loading />
        </div>
      )}

      {isError && !isLoading && (
        <div className="text-center text-red-500 py-4">
          Failed to load contents.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {!selectedCourseId || sortedData?.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No Class Content Found
            </div>
          ) : (
            <>
              <div className="p-2">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  placeholder="Search by class title..."
                />
              </div>
              <ContentTable
                contentData={sortedData}
                handleContentDelete={handleContentDelete}
                handleContentEditModal={handleContentEditModal}
                handleContentInfoModal={handleContentInfoModal}
                handleRedirect={handleRedirect}
                handleSort={handleSort}
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
      <ContentDetailsDialog
        selectedContent={selectedContent}
        isOpen={isInfoModalOpen}
        onOpenChange={setIsInfoModalOpen}
      />

      <ContentInfoEditDialog
        selectedContent={selectedContent}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        refetchClassContents={refetchClassContents}
      />
    </div>
  );
};

export default ContentList;
