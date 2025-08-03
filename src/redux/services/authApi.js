import { tagTypesValue } from "../tagTypes";
import baseApi from "./baseApi";

const authApiServices = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    //User Login
    userLogin: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypesValue.AUTH],
    }),

    verifyLogin: builder.mutation({
      query: (data) => ({
        url: "/verify-login",
        method: "POST",
        body: { passOrOtp: data.otpValue },
      }),
      invalidatesTags: [tagTypesValue.AUTH],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/change-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypesValue.AUTH],
    }),
    logOut: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
        body: {},
      }),
      invalidatesTags: [tagTypesValue.AUTH],
    }),
  }),
});

export const {
  useUserLoginMutation,
  useVerifyLoginMutation,
  useChangePasswordMutation,
  useLogOutMutation,
} = authApiServices;
export default authApiServices;
