import { tagTypesValue } from "../tagTypes";
import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const CourseCycleApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Course cycle
    getAllCourseCycle: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator(`/cycle`, queryParams);
        return {
          url,
          method: "GET",
        };
      },
      providesTags: [tagTypesValue.COURSE_CYCLE],
    }),

    // Get get All Course Cycle Based On CourseId
    getAllCourseCycleBasedOnCourseId: builder.query({
      query: (id) => ({
        url: `/cycle/course/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.COURSE_CYCLE],
    }),

    // // Join Course cycle
    // joinCourseCycle: builder.query({
    //   query: (content) => ({
    //     url: `/cycle/${content.id}`,
    //     method: "GET",
    //   }),
    //   providesTags: [tagTypesValue.COURSE_CYCLE],
    // }),

    // // create Course cycle
    // createCourseCycle: builder.mutation({
    //   query: (formData) => ({
    //     url: `/cycle`,
    //     method: "POST",
    //     body: formData,
    //   }),
    //   invalidatesTags: [tagTypesValue.COURSE_CYCLE],
    // }),

    // // Update Course cycle
    // updateCourseCycle: builder.mutation({
    //   query: ({ id, formData }) => ({
    //     url: `/cycle/${id}`,
    //     method: "PATCH",
    //     body: formData,
    //   }),
    //   invalidatesTags: [tagTypesValue.COURSE_CYCLE],
    // }),
    // // Delete Course cycle
    // deleteCourseCycle: builder.mutation({
    //   query: (id) => ({
    //     url: `/cycle/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: [tagTypesValue.COURSE_CYCLE],
    // }),
    // // uploadClasss Course cycle
    // uploadingCourseCycle: builder.query({
    //   query: (params) => ({
    //     url: `/cycle/uploading/${params?.subjectChapterId}`,
    //     method: "GET",
    //   }),
    //   providesTags: [tagTypesValue.UPLOADINGCLASS],
    // }),
  }),
});

export const {
  useGetAllCourseCycleQuery,
  useGetAllCourseCycleBasedOnCourseIdQuery,
} = CourseCycleApiServices;

export default CourseCycleApiServices;
