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
  }),
});

export const { useGetCourseByIdQuery } = courseApiServices;

export default courseApiServices;
