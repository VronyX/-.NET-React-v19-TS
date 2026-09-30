import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import type { Pizza } from "../APIResponsesTypes";
import type { CartItem } from "../contexts";
import Cart from "../Cart";

afterEach(cleanup);

const testPizzaPepperoni: Pizza = {
  id: "pepperoni",
  name: "The Pepperoni Pizza",
  category: "Classic",
  description: "Mozzarella, Pepperoni",
  image: "/public/pizzas/pepperoni.webp",
  sizes: { S: 9.75, M: 12.5, L: 15.25 },
};

const testPizzaHawaiian: Pizza = {
  id: "hawaiian",
  name: "The Hawaiian Pizza",
  category: "Classic",
  description: "Sliced Ham, Pineapple, Mozzarella Cheese",
  image: "/public/pizzas/hawaiian.webp",
  sizes: { S: 14.5, M: 16.5, L: 19.5 },
};

const dummyCart: CartItem[] = [
  {
    pizza: testPizzaPepperoni,
    size: "M",
    price: "$12.50",
  },
  {
    pizza: testPizzaHawaiian,
    size: "S",
    price: "$14.50",
  },
];

test("total is zero when cart is empty", () => {
  const screen = render(<Cart cart={[]} checkout={() => {}} />);

  const total = screen.getByText("Total: $0.00");
  expect(total).toBeDefined();

  const items = screen.queryAllByRole("listitem");
  expect(items.length).toBe(0);
});

test("show items and calculate total correctly", () => {
  const screen = render(<Cart cart={dummyCart} checkout={() => {}} />);

  expect(screen.getByText(/pepperoni pizza/i)).toBeDefined();
  expect(screen.getByText(/hawaiian pizza/i)).toBeDefined();

  expect(screen.getByText("M")).toBeDefined();
  expect(screen.getByText("S")).toBeDefined();

  const items = screen.getAllByRole("listitem");
  expect(items.length).toBe(2);

  expect(screen.getByText("Total: $27.00")).toBeDefined();
});