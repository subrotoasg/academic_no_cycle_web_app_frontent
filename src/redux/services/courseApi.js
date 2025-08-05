import { tagTypesValue } from "../tagTypes";
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
      query: () => ({
        url: `/course`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? result.data.map((course) => ({
              type: tagTypesValue.COURSE,
              id: course.id,
            }))
          : [{ type: tagTypesValue.COURSE, id: "LIST" }],
    }),
  }),
});

export const { useGetCourseByIdQuery, useGetAllCourseQuery } =
  courseApiServices;

export default courseApiServices;
