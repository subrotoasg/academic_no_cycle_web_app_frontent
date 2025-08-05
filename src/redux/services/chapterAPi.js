import { tagTypesValue } from "../tagTypes";
import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const chapterApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Chapters by Subject ID
    getChaptersBySubjectId: builder.query({
      query: (subjectId) => ({
        url: `/chapter/all/chapters/${subjectId}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.CHAPTER],
    }),

    // Get Chapters by CourseSubject ID
    getChaptersByCourseSubjectId: builder.query({
      query: (courseSubjectId) => ({
        url: `/course/subject/chapter/course-subject/${courseSubjectId}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.CHAPTER],
    }),
    // Get Course Subject Chapters by Course ID
    getCourseSubjectChapters: builder.query({
      query: (queryParams) => {
        const { courseId, ...params } = queryParams;
        const url = quearyUrlGenerator(
          `/course/subject/chapter/all/${courseId}`,
          params
        );
        return {
          url,
          method: "GET",
        };
      },
      providesTags: [tagTypesValue.CHAPTER],
    }),

    // Update Course Subject Chapter by Subject ID
    updateCourseSubjectChapter: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/course/subject/chapter/${id}`,
        method: "PATCH",
        body: formData,
        formData: true, 
      }),
      invalidatesTags: [tagTypesValue.CHAPTER],
    }),
    

    // Delete Course Subject Chapter by Chapter ID
    deleteCourseSubjectChapter: builder.mutation({
      query: (chapterId) => ({
        url: `/course/subject/chapter/${chapterId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypesValue.CHAPTER],
    }),

  }),
});

export const {
  useGetChaptersBySubjectIdQuery,
  useGetChaptersByCourseSubjectIdQuery,
  useGetCourseSubjectChaptersQuery,
  useUpdateCourseSubjectChapterMutation,
  useDeleteCourseSubjectChapterMutation,

} = chapterApiServices;

export default chapterApiServices;
