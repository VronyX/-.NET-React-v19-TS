import { renderHook, waitFor } from "@testing-library/react";
import { expect, test, beforeEach, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { pizzaApi } from "../api/pizzaApi";
import { usePizzaOfTheDay } from "../usePizzaOfTheDay";
import createFetchMock from "vitest-fetch-mock";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

beforeEach(() => {
  fetchMocker.resetMocks();
});

function makeStore() {
  return configureStore({
    reducer: {
      [pizzaApi.reducerPath]: pizzaApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pizzaApi.middleware),
  });
}

function createWrapper() {
  const store = makeStore();
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
}

const testPizza = {
  id: "calabrese",
  name: "The Calabrese Pizza",
  category: "Supreme",
  description:
    "Salami, Pancetta, Tomatoes, Red Onions, Friggitello Peppers, Garlic",
  image: "/public/pizzas/calabrese.webp",
  sizes: { S: 12.25, M: 16.25, L: 20.25 },
};

test("to call the API and give back the pizza of the day", async () => {
  fetchMocker.mockResponseOnce(JSON.stringify(testPizza));
  const { result } = renderHook(() => usePizzaOfTheDay(), {
    wrapper: createWrapper(),
  });

  expect(result.current).toBeNull();

  await waitFor(() => {
    expect(result.current).toEqual(testPizza);
  });

  const requests = fetchMocker.requests();
  expect(requests[0].url).toBe("/api/pizza-of-the-day");
});
