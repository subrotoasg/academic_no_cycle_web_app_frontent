import { tagTypesValue } from "../tagTypes";
import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const courseApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Course By ID
    getCourseById: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}`,
        method: "GET",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
      providesTags: (result, error, courseId) => [
        { type: "course", id: courseId },
      ],
    }),

    getAllCourse: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator("/course", queryParams);
        return {
          url,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((course) => ({
                type: tagTypesValue.COURSE,
                id: course.id,
              })),
              { type: tagTypesValue.COURSE, id: "LIST" },
            ]
          : [{ type: tagTypesValue.COURSE, id: "LIST" }],
    }),
    getArchivedCourseById: builder.query({
      query: (courseId) => ({
        url: `/course/get-all/archieve-courses/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        { type: tagTypesValue.COURSE, id: courseId },
      ],
    }),
    getArchivedCycleById: builder.query({
      query: (cycleId) => ({
        url: `/cycle/get-all/archive-cycles/${cycleId}`,
        method: "GET",
      }),
      providesTags: (result, error, cycleId) => [
        { type: tagTypesValue.COURSE, id: cycleId },
      ],
    }),
  }),
});

export const {
  useGetCourseByIdQuery,
  useGetAllCourseQuery,
  useGetArchivedCourseByIdQuery,
  useGetArchivedCycleByIdQuery,
} = courseApiServices;

export default courseApiServices;
