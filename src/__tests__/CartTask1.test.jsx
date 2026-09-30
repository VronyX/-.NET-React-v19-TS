import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import Cart from "../Cart";

afterEach(cleanup);

test("total is zero when cart is empty", () => {
  const screen = render(<Cart cart={[]} checkout={() => {}} />);

  const total = screen.getByText("Total: $0.00");
  expect(total).toBeDefined();

  const items = screen.queryAllByRole("listitem");
  expect(items.length).toBe(0);
});

test("show items and calculate total correctly", () => {
  const dummyCart = [
    {
      pizza: {
        name: "Pepperoni Pizza",
        sizes: { S: 10, M: 15, L: 20 },
      },
      size: "M",
      price: "$15.00",
    },
    {
      pizza: {
        name: "Hawaiian Pizza",
        sizes: { S: 12, M: 16, L: 22 },
      },
      size: "S",
      price: "$12.00",
    },
  ];

  const screen = render(<Cart cart={dummyCart} checkout={() => {}} />);

  expect(screen.getByText("Pepperoni Pizza")).toBeDefined();
  expect(screen.getByText("Hawaiian Pizza")).toBeDefined();

  expect(screen.getByText("M")).toBeDefined();
  expect(screen.getByText("S")).toBeDefined();

  const items = screen.getAllByRole("listitem");
  expect(items.length).toBe(2);

  expect(screen.getByText("Total: $27.00")).toBeDefined();
});