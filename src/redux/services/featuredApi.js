import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const featuredApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create Featured
    createFeatured: builder.mutation({
      query: (formData) => ({
        url: "/course/featured",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [{ type: "featured", id: "LIST" }],
    }),

    // Get Features By Course ID
    getFeaturesByCourseId: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator(
          `/course/featured/all/${queryParams.courseId}`,
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
              ...result.data.data.map((item) => ({
                type: "featured",
                id: item.id,
              })),
              { type: "featured", id: "LIST" },
            ]
          : [{ type: "featured", id: "LIST" }],
    }),

    // Update Featured
    updateFeatured: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/course/featured/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "featured", id },
        { type: "featured", id: "LIST" },
      ],
    }),

    // Delete Featured
    deleteFeatured: builder.mutation({
      query: (id) => ({
        url: `/course/featured/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "featured", id },
        { type: "featured", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateFeaturedMutation,
  useGetFeaturesByCourseIdQuery,
  useUpdateFeaturedMutation,
  useDeleteFeaturedMutation,
} = featuredApiServices;

export default featuredApiServices;
