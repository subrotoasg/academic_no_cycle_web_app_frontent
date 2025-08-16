"use client";

import React, { useEffect, useMemo, useState } from "react";
import FeaturedDetailsDialog from "./FeaturedDetailsDialog";
import SearchBar from "../utilities/SearchBar";
import PaginationControls from "../utilities/PaginationControls";
import { FeaturedTable } from "./FeaturedTable";
import FeaturedInfoEditDialog from "./FeaturedInfoEditDialog";
import Swal from "sweetalert2";
import Loading from "../utilities/Loading";
import { useSelector } from "react-redux";
import {
  useDeleteFeaturedMutation,
  useGetFeaturesByCourseIdQuery,
} from "@/redux/services/featuredApi";
import { selectAllCourses } from "@/redux/Features/courseInfo";
import CourseSelect from "@/components/form/CourseSelect";

export function FeaturedList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const courses = useSelector(selectAllCourses);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureInfoModalOpen, setFeatureInfoModalOpen] = useState(false);
  const [featureEditModalOpen, setFeatureEditModalOpen] = useState(false);

  useEffect(() => {
    if (courses?.data?.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses.data[0].id);
    }
  }, [courses, selectedCourseId]);

  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch: refetchFeatures,
  } = useGetFeaturesByCourseIdQuery(
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
  const [deleteFeatured] = useDeleteFeaturedMutation();

  const featuresData = data?.data?.data;

  const meta = data?.data?.meta;
  const totalPages = meta?.totalCount ? Math.ceil(meta.totalCount / limit) : 1;
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);
  useEffect(() => {
    setSearchQuery("");
    setPage(1);
  }, [selectedCourseId]);

  const sortedFeatures = useMemo(() => {
    return featuresData;
  }, [featuresData]);

  const handleFeatureEditModal = (feature) => {
    setSelectedFeature(feature);
    setFeatureEditModalOpen(true);
  };

  const handleFeatureInfoModal = (feature) => {
    setSelectedFeature(feature);
    setFeatureInfoModalOpen(true);
  };

  const handleFeatureDelete = async (feature) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You're about to delete "${feature?.title}". This action is irreversible.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteFeatured(feature.id).unwrap();
        if (res?.success) {
          Swal.fire({
            title: "Deleted!",
            text: `"${feature?.title}" was deleted successfully.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
          refetchFeatures();
        }
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete Feature");
      }
    }
  };

  return (
    <div className="w-full p-2 md:p-4 bg-white dark:bg-gray-900 shadow-xl rounded-xl space-y-3 mt-3">
      <h1 className="text-xl md:text-3xl font-semibold text-center mb-6">
        Course Features List
      </h1>

      <p className="text-xs md:text-sm text-muted-foreground text-center mt-2">
        View, edit, or delete featured content, discounts, and offers.
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
          placeholder="Search by Feature Title..."
        />
      </div>
      {(isLoading || isFetching) && (
        <div className="w-full flex justify-center py-8">
          <Loading />
        </div>
      )}

      {isError && !(isLoading || isFetching) && (
        <div className="text-center text-red-500 py-4">
          Failed to load Features.
        </div>
      )}

      {!(isLoading || isFetching) && !isError && (
        <>
          {!selectedCourseId || sortedFeatures.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              No Features Found
            </div>
          ) : (
            <>
              <FeaturedTable
                features={sortedFeatures}
                handleDelete={handleFeatureDelete}
                handleFeatureEditModal={handleFeatureEditModal}
                handleFeatureInfoModal={handleFeatureInfoModal}
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

      <FeaturedDetailsDialog
        selectedFeature={selectedFeature}
        isOpen={featureInfoModalOpen}
        onOpenChange={setFeatureInfoModalOpen}
      />

      <FeaturedInfoEditDialog
        featured={selectedFeature}
        isOpen={featureEditModalOpen}
        onOpenChange={setFeatureEditModalOpen}
        refetchFeatures={refetchFeatures}
      />
    </div>
  );
}
