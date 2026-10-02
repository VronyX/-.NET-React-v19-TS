import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { PastOrder, PastOrderDetail, Pizza } from "../APIResponsesTypes";

export const pizzaApi = createApi({
  reducerPath: "pizzaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
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
      keepUnusedDataFor: 30 * 60,
    }),
  }),
});

export const { useGetPizzasQuery, useGetPizzaOfTheDayQuery, useGetPastOrderQuery, useGetPastOrdersQuery } = pizzaApi;
