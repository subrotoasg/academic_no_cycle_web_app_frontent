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

    // Get Chapters by CycleSubject ID
    getChaptersByCycleSubjectId: builder.query({
      query: (cycleSubjectId) => ({
        url: `/cycle/subject/chapter/chapters/${cycleSubjectId}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.CHAPTER],
    }),

    // Get Cycle Subject Chapters by Course ID
    getCycleSubjectChapters: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator(
          `/cycle/subject/chapter/all/${queryParams.courseId}`,
          queryParams
        );
        return {
          url,
          method: "GET",
        };
      },
      providesTags: [tagTypesValue.CHAPTER],
    }),

    // Update Cycle Subject Chapter by Subject ID
    updateCycleSubjectChapter: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/cycle/subject/chapter/${id}`,
        method: "PATCH",
        body: formData,
        formData: true,
      }),
      invalidatesTags: [tagTypesValue.CHAPTER],
    }),

    // Delete Course Subject Chapter by Chapter ID
    deleteCycleSubjectChapter: builder.mutation({
      query: (chapterId) => ({
        url: `/cycle/subject/chapter/${chapterId}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypesValue.CHAPTER],
    }),
  }),
});

export const {
  useGetChaptersBySubjectIdQuery,
  useGetChaptersByCycleSubjectIdQuery,
  useGetCycleSubjectChaptersQuery,
  useUpdateCycleSubjectChapterMutation,
  useDeleteCycleSubjectChapterMutation,
} = chapterApiServices;

export default chapterApiServices;
