import baseApi from "./baseApi";

const subjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //  Create Subject
    createSubject: builder.mutation({
      query: (formData) => ({
        url: "/subject",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "subject", id: "LIST" }],
    }),

    // Get All Subjects
    getSubjects: builder.query({
      query: () => ({
        url: "/subject",
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((subject) => ({
                type: "subject",
                id: subject.id,
              })),
              { type: "subject", id: "LIST" },
            ]
          : [{ type: "subject", id: "LIST" }],
    }),
    

    //  Get Subjects by Course ID
    getSubjectsByCourseId: builder.query({
      query: (courseId) => ({
        url: `/course-subject/subjects/${courseId}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((subject) => ({
                type: "subject",
                id: subject.id,
              })),
              { type: "subject", id: "LIST" },
            ]
          : [{ type: "subject", id: "LIST" }],
    }),

    // Delete Subject
    deleteSubject: builder.mutation({
      query: (id) => ({
        url: `/subject/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "subject", id: "LIST" }],
    }),

    // Update Subject
    updateSubject: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/subject/${id}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [{ type: "subject", id: "LIST" }],
    }),
  }),
});

export const {
  useCreateSubjectMutation,
  useGetSubjectsQuery,
  useGetSubjectsByCourseIdQuery,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
} = subjectApi;

export default subjectApi;
