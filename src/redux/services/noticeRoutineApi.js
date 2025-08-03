import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const noticeRoutineApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Notice or Routine
    createNoticeRoutine: builder.mutation({
      query: (formData) => ({
        url: "/course/notice",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "noticeRoutine", id: "LIST" }],
    }),

    // Get Notices or Routines by Course ID
    getNoticeRoutinesByCourseId: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator(
          `/course/notice/all/${queryParams.courseId}`,
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
                type: "noticeRoutine",
                id: item.id,
              })),
              { type: "noticeRoutine", id: "LIST" },
            ]
          : [{ type: "noticeRoutine", id: "LIST" }],
    }),

    // Update Notice or Routine
    updateNoticeRoutine: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/course/notice/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "noticeRoutine", id },
        { type: "noticeRoutine", id: "LIST" },
      ],
    }),

    // Delete Notice or Routine
    deleteNoticeRoutine: builder.mutation({
      query: (id) => ({
        url: `/course/notice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "noticeRoutine", id },
        { type: "noticeRoutine", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateNoticeRoutineMutation,
  useGetNoticeRoutinesByCourseIdQuery,
  useUpdateNoticeRoutineMutation,
  useDeleteNoticeRoutineMutation,
} = noticeRoutineApiServices;

export default noticeRoutineApiServices;
