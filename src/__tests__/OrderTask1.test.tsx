import { render, screen, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import createFetchMock from "vitest-fetch-mock";
import { Route } from "../routes/order.lazy";
import { CartContext } from "../contexts";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

const mockPizzas = [
  {
    id: "pepperoni",
    name: "The Pepperoni Pizza",
    description: "Pepperoni & Cheese",
    image: "/pepperoni.jpg",
    sizes: { S: 10, M: 15, L: 20 },
  },
];

test("Add to cart button append item to cart", async () => {
  fetchMocker.mockResponse(JSON.stringify(mockPizzas));

  const setCartMock = vi.fn();
  const OrderRoute = Route.options.component;
  if (!OrderRoute) {
    throw new Error("order route has no component");
  }
  render(
    <CartContext.Provider value={[[], setCartMock]}>
      <OrderRoute />
    </CartContext.Provider>,
  );

  const pizzaOption = await screen.findByRole(
    "option",
    { name: "The Pepperoni Pizza" },
    { timeout: 5000 },
  );
  expect(pizzaOption).toBeDefined();

  const radioSmall = screen.getByLabelText("Small");
  fireEvent.click(radioSmall);

  const addToCartBtn = screen.getByRole("button", { name: "Add to Cart" });
  fireEvent.click(addToCartBtn);

  expect(setCartMock).toHaveBeenCalledWith([
    {
      pizza: mockPizzas[0],
      size: "S",
      price: "$10.00",
    },
  ]);
});
