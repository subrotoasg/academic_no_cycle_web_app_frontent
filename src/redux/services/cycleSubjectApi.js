import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const cycleSubjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //Create Cycle Subject
    createCycleSubject: builder.mutation({
      query: (formData) => ({
        url: "/cycle-subject",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "cycleSubject", id: "LIST" }],
    }),

    //  Get All Cycle Subjects By Course Id
    getAllCycleSubjectsByCourseId: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator(
          `/cycle-subject/all/${queryParams.courseId}`,
          queryParams
        );
        return {
          url,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.data.map((subject) => ({
                type: "cycleSubject",
                id: subject.id,
              })),
              { type: "cycleSubject", id: "LIST" },
            ]
          : [{ type: "cycleSubject", id: "LIST" }],
    }),

    //  Get cycle Subjects By CourseId

    getSubjectsByCycleId: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator(
          `/cycle-subject/subjects/${queryParams.cycleId}`,
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
              ...result.data.data.map((subject) => ({
                type: "cycleSubject",
                id: subject.id,
              })),
              { type: "cycleSubject", id: "LIST" },
            ]
          : [{ type: "cycleSubject", id: "LIST" }],
    }),

    // Update Cycle Subject
    updateCycleSubject: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/cycle-subject/${id}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "cycleSubject", id: "LIST" }],
    }),

    //  Delete Cycle Subject
    deleteCycleSubject: builder.mutation({
      query: (id) => ({
        url: `/cycle-subject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "cycleSubject", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateCycleSubjectMutation,
  useGetAllCycleSubjectsByCourseIdQuery,
  useGetSubjectsByCycleIdQuery,
  useUpdateCycleSubjectMutation,
  useDeleteCycleSubjectMutation,
} = cycleSubjectApi;

export default cycleSubjectApi;
