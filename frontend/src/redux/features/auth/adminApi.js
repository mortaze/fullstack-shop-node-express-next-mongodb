import { apiSlice } from "@/redux/api/apiSlice";
import { adminLoggedIn } from "./adminSlice";
import Cookies from "js-cookie";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const adminAuthApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // login
    loginAdmin: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/admin/login`,
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          Cookies.set(
            "adminInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              admin: result.data.data.admin,
            }),
            { expires: 0.5 }
          );

          dispatch(
            adminLoggedIn({
              accessToken: result.data.data.token,
              admin: result.data.data.admin,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),

    // get me
    getAdmin: builder.query({
      query: () => `${BASE_URL}/admin/me`,

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            adminLoggedIn({
              admin: result.data,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),

    // reset password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/admin/forget-password`,
        method: "PATCH",
        body: data,
      }),
    }),

    // confirm forgot password
    confirmForgotPassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/admin/confirm-forget-password`,
        method: "PATCH",
        body: data,
      }),
    }),

    // change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/admin/change-password`,
        method: "PATCH",
        body: data,
      }),
    }),

    // update profile
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BASE_URL}/admin/update-admin/${id}`,
        method: "PUT",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          Cookies.set(
            "adminInfo",
            JSON.stringify({
              accessToken: result.data.data.token,
              admin: result.data.data.admin,
            }),
            { expires: 0.5 }
          );

          dispatch(
            adminLoggedIn({
              accessToken: result.data.data.token,
              admin: result.data.data.admin,
            })
          );
        } catch (err) {
          // do nothing
        }
      },
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useGetAdminQuery,
  useResetPasswordMutation,
  useConfirmForgotPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = adminAuthApi;
