import { useDebugValue } from "react";
import { useGetPizzaOfTheDayQuery } from "./api/pizzaApi";

export const usePizzaOfTheDay = () => {
  const { data: pizzaOfTheDay} = useGetPizzaOfTheDayQuery();

  useDebugValue(pizzaOfTheDay ? `${pizzaOfTheDay.name}` : "Loading...");

  return pizzaOfTheDay ?? null;
};
