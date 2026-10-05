import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PastOrder, PastOrderDetail, Pizza } from "../APIResponsesTypes";
import type { CartItem } from "../cartSlice";

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["PastOrders"],
  endpoints: (build) => ({
    getPizzas: build.query<Pizza[], void>({
      query: () => "pizzas",
    }),
    getPizzaOfTheDay: build.query<Pizza, void>({
      query: () => "pizza-of-the-day",
    }),
    getPastOrder: build.query<PastOrderDetail, number>({
      query: (order) => `past-order/${order}`,
      keepUnusedDataFor: 24 * 60 * 60, // one day, in seconds
    }),
    getPastOrders: build.query<PastOrder[], { page: number }>({
      query: ({ page }) => `past-orders?page=${page}`,
      providesTags: ["PastOrders"],
      keepUnusedDataFor: 30 * 60,
    }),
    placeOrder: build.mutation<unknown, CartItem[]>({
      query: (cart) => ({
        url: "order",
        method: "POST",
        body: { cart },
      }),
      invalidatesTags: ["PastOrders"],
    }),
    placeContact: build.mutation<unknown, ContactMessage>({
      query: (contact) => ({
        url: "contact",
        method: "POST",
        body: contact,
      }),
    }),
  }),
});

export const {
  useGetPizzasQuery,
  useGetPizzaOfTheDayQuery,
  useGetPastOrderQuery,
  useGetPastOrdersQuery,
  usePlaceOrderMutation,
  usePlaceContactMutation,
} = pizzaApi;
