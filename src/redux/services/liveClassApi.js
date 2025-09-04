import { tagTypesValue } from "../tagTypes";
import { quearyUrlGenerator } from "../utilities/quearyParamsGenerator";
import baseApi from "./baseApi";

const liveClassApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get All Live Class
    getAllLiveClass: builder.query({
      query: (queryParams) => {
        const url = quearyUrlGenerator(`/live-class`, queryParams);
        return {
          url,
          method: "GET",
        };
      },
      providesTags: [tagTypesValue.LIVE_CLASS],
    }),

    // Get Single Live Class
    getSingleLiveClass: builder.query({
      query: (id) => ({
        url: `/live-class/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.LIVE_CLASS],
    }),

    // Join Live class
    joinLiveClass: builder.query({
      query: (content) => ({
        url: `/live-class/join/class/${content.id}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.LIVE_CLASS],
    }),

    // create Live class
    createLiveClass: builder.mutation({
      query: (formData) => ({
        url: `/live-class`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [tagTypesValue.LIVE_CLASS],
    }),

    // Update Live class
    updateLiveClass: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/live-class/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: [tagTypesValue.LIVE_CLASS],
    }),
    // Delete Live Class
    deleteLiveClass: builder.mutation({
      query: (id) => ({
        url: `/live-class/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypesValue.LIVE_CLASS],
    }),
    // uploadClasss Live Class
    uploadingLiveClass: builder.query({
      query: (params) => ({
        url: `/live-class/uploading/${params?.subjectChapterId}`,
        method: "GET",
      }),
      providesTags: [tagTypesValue.UPLOADINGCLASS],
    }),
  }),
});

export const {
  useGetAllLiveClassQuery,
  useGetSingleLiveClassQuery,
  useJoinLiveClassQuery,
  useCreateLiveClassMutation,
  useUpdateLiveClassMutation,
  useDeleteLiveClassMutation,
  useUploadingLiveClassQuery,
} = liveClassApiServices;

export default liveClassApiServices;
