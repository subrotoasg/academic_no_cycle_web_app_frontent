import {
  pathUrlGenerator,
  quearyUrlGenerator,
} from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const cycleClassContentApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Cycle Class Content
    createCycleClassContent: builder.mutation({
      query: (formData) => ({
        url: "/cycle/class/content/add-content",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "cycleClassContent", id: "LIST" }],
    }),

    // Get All Cycle Class Contents by Course ID
    getAllCycleClassContents: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator(
          `/cycle/class/content/all/${queryParams.courseId}`,
          queryParams
        );
        return {
          url,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((item) => ({
                type: "cycleClassContent",
                id: item.id,
              })),
              { type: "cycleClassContent", id: "LIST" },
            ]
          : [{ type: "cycleClassContent", id: "LIST" }],
    }),

    // Get Class Contents by Chapter ID
    getCycleClassContentByChapterId: builder.query({
      query: (chapterId) => ({
        url: `/cycle/class/content/classes/${chapterId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((item) => ({
                type: "cycleClassContent",
                id: item.id,
              })),
              { type: "cycleClassContent", id: "LIST" },
            ]
          : [{ type: "cycleClassContent", id: "LIST" }],
    }),

    // Get Cycle Class Content by Class ID
    getCycleClassContentByClassId: builder.query({
      query: (classId) => ({
        url: `/cycle/class/content/${classId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((item) => ({
                type: "cycleClassContent",
                id: item.id,
              })),
              { type: "cycleClassContent", id: "LIST" },
            ]
          : [{ type: "cycleClassContent", id: "LIST" }],
    }),

    // Update Cycle Class Content
    updateCycleClassContent: builder.mutation({
      query: ({ classId, formData }) => ({
        url: `/cycle/class/content/${classId}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { classId }) => [
        { type: "cycleClassContent", id: classId },
        { type: "cycleClassContent", id: "LIST" },
      ],
    }),

    // Delete Cycle Class Content
    deleteCycleClassContent: builder.mutation({
      query: (classId) => ({
        url: `/cycle/class/content/${classId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, classId) => [
        { type: "cycleClassContent", id: classId },
        { type: "cycleClassContent", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateCycleClassContentMutation,
  useGetAllCycleClassContentsQuery,
  useGetCycleClassContentByChapterIdQuery,
  useGetCycleClassContentByClassIdQuery,
  useUpdateCycleClassContentMutation,
  useDeleteCycleClassContentMutation,
} = cycleClassContentApiServices;

export default cycleClassContentApiServices;
