import { tagTypesValue } from "../tagTypes";
import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const subjectApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Subjects
    getSubjects: builder.query({
      query: () => ({
        url: "/subject",
        method: "GET",
      }),
      providesTags: [tagTypesValue.SUBJECT],
    }),

    // Get Subject by Cycle ID
    // getSubjectsByCycleId: builder.query({
    //   query: (cycleId) => ({
    //     url: `/cycle-subject/subjects/${cycleId}`,
    //     method: "GET",
    //   }),
    //   providesTags: [tagTypesValue.SUBJECT],
    // }),

    // Get Subjects by Course ID
    getSubjectsByCourseId: builder.query({
      query: (courseId) => ({
        url: `/course-subject/subjects/${courseId}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.SUBJECT],
    }),
    // Get Subjects by Course ID with Pagination
    getCourseSubject: builder.query({
      query: (queryParams) => {
        const { courseId, ...params } = queryParams;
        const url = quearyUrlGenerator(
          `/course-subject/subjects/${courseId}`,
          params
        );
        return {
          url,
          method: "GET",
        };
      },
      providesTags: [tagTypesValue.SUBJECT],
    }),

    // Update Course Subject Image
    updateCourseSubject: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/course-subject/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [tagTypesValue.SUBJECT],
    }),

    // Delete Course Subject by Subject ID
    deleteCourseSubject: builder.mutation({
      query: (subjectId) => ({
        url: `/course-subject/${subjectId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypesValue.SUBJECT],
    }),
  }),
});

export const {
  useGetSubjectsQuery,
  // useGetSubjectsByCycleIdQuery,
  useGetSubjectsByCourseIdQuery,
  useGetCourseSubjectQuery,
  useUpdateCourseSubjectMutation,
  useDeleteCourseSubjectMutation,
} = subjectApiServices;
subjectApiServices;

export default subjectApiServices;
