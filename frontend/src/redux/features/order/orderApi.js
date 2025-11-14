import { apiSlice } from "../../api/apiSlice";
import { set_client_secret } from "./orderSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const orderApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({

    // -------------------------------
    // 💳 Create Payment Intent
    // -------------------------------
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/order/create-payment-intent`,
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.clientSecret) {
            dispatch(set_client_secret(data.clientSecret));
          }
        } catch {}
      },
    }),

    // -------------------------------
    // 🧾 Save Order (User)
    // -------------------------------
    saveOrder: builder.mutation({
      query: (data) => ({
        url: `${BASE_URL}/order`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders", "UserOrders"],
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("couponInfo");
          localStorage.removeItem("cart_products");
          localStorage.removeItem("shipping_info");
        } catch {}
      },
    }),

    // -------------------------------
    // 🧍‍♂️ User Orders
    // -------------------------------
    getUserOrders: builder.query({
      query: () => `${BASE_URL}/user-order`,
      providesTags: ["UserOrders"],
      keepUnusedDataFor: 600,
    }),

    getUserOrderById: builder.query({
      query: (id) => `${BASE_URL}/user-order/${id}`,
      providesTags: (result, error, arg) => [{ type: "UserOrder", id: arg }],
      keepUnusedDataFor: 600,
    }),

    // -------------------------------
    // 🔥 Dashboard: Get All Orders
    // -------------------------------
    getAllOrders: builder.query({
      query: () => `${BASE_URL}/order`,
      transformResponse: (response) => response?.data || [],
      providesTags: ["AllOrders"],
    }),

    getOrderById: builder.query({
      query: (id) => `${BASE_URL}/order/${id}`,
      providesTags: (r, e, id) => [{ type: "Orders", id }],
    }),

    updateOrder: builder.mutation({
      query: ({ id, data }) => ({
        url: `${BASE_URL}/order/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (r, e, arg) => ["Orders", { type: "Orders", id: arg.id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `${BASE_URL}/order/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (r, e, arg) => ["Orders", { type: "Orders", id: arg.id }],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `${BASE_URL}/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),

  }),
});

export const {
  useCreatePaymentIntentMutation,
  useSaveOrderMutation, // ⚡️ اینجا نام endpoint اصلاح شد

  useGetUserOrdersQuery,
  useGetUserOrderByIdQuery,

  useGetAllOrdersQuery,
  useGetOrderByIdQuery,

  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
