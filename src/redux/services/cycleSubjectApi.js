import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";
import { tagTypesValue } from "../tagTypes";

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

    // Get Subject by Cycle ID
    getSubjectsByCycleId: builder.query({
      query: (cycleId) => ({
        url: `/cycle-subject/subjects/${cycleId}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.CYCLE_SUBJECT],
    }),

    //  Get cycle Subjects By CourseId
    getCycleSubjectsByCycleId: builder.query({
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
      query: (subjectId) => ({
        url: `/cycle-subject/${subjectId}`,
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
  useGetCycleSubjectsByCycleIdQuery,
  useUpdateCycleSubjectMutation,
  useDeleteCycleSubjectMutation,
} = cycleSubjectApi;

export default cycleSubjectApi;
