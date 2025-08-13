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

    studentSignUp: builder.mutation({
      query: (data) => ({
        url: "/signup",
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

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/forget-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypesValue.AUTH],
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/reset-password",
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
  useStudentSignUpMutation,
  useVerifyLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useLogOutMutation,
  useResetPasswordMutation,
} = authApiServices;
export default authApiServices;
