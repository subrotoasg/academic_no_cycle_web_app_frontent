import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const classContentApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Class Content
    createClassContent: builder.mutation({
      query: (formData) => ({
        url: "/class/add-content",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "classContent", id: "LIST" }],
    }),

    // Get Class Content By Class ID
    getClassContentByClassId: builder.query({
      query: (classId) => ({
        url: `/class/${classId}`,
        method: "GET",
      }),
      providesTags: (result, error, classId) => [
        { type: "classContent", id: classId },
      ],
    }),

    // Get All Class Contents By Course ID
    getAllClassContents: builder.query({
      query: (queryParams) => {
        const { courseId, ...params } = queryParams;

        const url = quearyUrlGenerator(
          `/class/all-info/${courseId}`,
          params
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
                type: "classContent",
                id: item.id,
              })),
              { type: "classContent", id: "LIST" },
            ]
          : [{ type: "classContent", id: "LIST" }],
    }),

    // Get Class Contents by SubjectChapter ID
    getClassContentsBySubjectChapterId: builder.query({
      query: (subjectChapterId) => ({
        url: `/class/all/videos/${subjectChapterId}`,
        method: "GET",
      }),
      providesTags: (result, error, subjectChapterId) => [
        { type: "classContent", id: subjectChapterId },
      ],
    }),

    // Update Class Content
    updateClassContent: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/class/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "classContent", id },
        { type: "classContent", id: "LIST" },
      ],
    }),

    // Delete Class Content
    deleteClassContent: builder.mutation({
      query: (id) => ({
        url: `/class/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "classContent", id },
        { type: "classContent", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateClassContentMutation,
  useGetClassContentByClassIdQuery,
  useGetAllClassContentsQuery,
  useGetClassContentsBySubjectChapterIdQuery,
  useUpdateClassContentMutation,
  useDeleteClassContentMutation,
} = classContentApiServices;

export default classContentApiServices;
