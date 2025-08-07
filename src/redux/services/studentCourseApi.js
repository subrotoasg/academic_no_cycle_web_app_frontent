import baseApi from "./baseApi";
import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import { tagTypesValue } from "../tagTypes";

const studentCourseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyCourses: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator("/student/my-courses", queryParams);
        return {
          url,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map((course) => ({
                type: tagTypesValue.MYCOURSES,
                id: course.id,
              })),
              { type: tagTypesValue.MYCOURSES, id: "MY_COURSES" },
            ]
          : [{ type: tagTypesValue.MYCOURSES, id: "MY_COURSES" }],
    }),

    redeemCourse: builder.mutation({
      query: (accessCode) => ({
        url: "/student/course/redeem",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ accessCode }).toString(),
      }),
      invalidatesTags: [{ type: tagTypesValue.MYCOURSES, id: "MY_COURSES" }],
    }),
  }),
});

export const { useGetMyCoursesQuery, useRedeemCourseMutation } =
  studentCourseApi;

export default studentCourseApi;
