import { useContext, useEffect, useState } from "react";
import { CartContext } from "../contexts";
import Cart from "../Cart";
import Pizza from "../Pizza";
import type { Pizza as PizzaType, PizzaSize } from "../APIResponsesTypes";
import { createLazyFileRoute } from "@tanstack/react-router";

// shared by the three size radios: the label is the visible "card", the input is visually hidden
const sizeLabelClass =
  "mx-3.75 mb-2.5 inline-flex h-20 w-20 cursor-pointer items-center justify-center rounded-[5px] border border-[#999] bg-border text-[#999] peer-checked:bg-white peer-checked:text-[#333] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary";

const intl = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const Route = createLazyFileRoute("/order")({
  component: Order,
});

function Order() {
  const [pizzaTypes, setPizzaTypes] = useState<PizzaType[]>([]);
  const [pizzaType, setPizzaType] = useState("pepperoni");
  const [pizzaSize, setPizzaSize] = useState<PizzaSize>("M");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useContext(CartContext);

  let price: string | undefined;
  let selectedPizza: PizzaType | undefined;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = selectedPizza
      ? intl.format(selectedPizza.sizes[pizzaSize])
      : undefined;
  }

  useEffect(() => {
    void fetchPizzaTypes();
  }, []);

  async function fetchPizzaTypes() {
    const pizzasRes = await fetch("/api/pizzas");
    const pizzasJson = (await pizzasRes.json()) as PizzaType[];
    setPizzaTypes(pizzasJson);
    setLoading(false);
  }

  async function checkout() {
    setLoading(true);

    await fetch("/api/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart,
      }),
    });

    setCart([]);
    setLoading(false);
  }

  return (
    <div className="w-full ml-[5%]">
      <h2>Create Order</h2>
      <form
        className="flex justify-between"
        onSubmit={(e) => {
          e.preventDefault();
          if (!selectedPizza || !price) {
            return;
          }
          setCart([...cart, { pizza: selectedPizza, size: pizzaSize, price }]);
        }}
      >
        <div className="my-2.5 w-full border-r border-border p-3.75 text-center">
          <div className="my-2.5 text-center">
            <label
              className="mb-2.5 block text-[20px] text-secondary"
              htmlFor="pizza-type"
            >
              Pizza Type
            </label>
            <select
              className="form-select mb-7.5 block w-full py-1.25 pl-1.25 text-[16px]"
              onChange={(e) => setPizzaType(e.target.value)}
              name="pizza-type"
              value={pizzaType}
            >
              {pizzaTypes.map((pizza) => (
                <option key={pizza.id} value={pizza.id}>
                  {pizza.name}
                </option>
              ))}
            </select>
          </div>
          <div className="my-2.5 text-center">
            <label
              className="mb-2.5 block text-[20px] text-secondary"
              htmlFor="pizza-size"
            >
              Pizza Size
            </label>
            <div className="my-2.5 text-center">
              <span>
                <input
                  className="peer sr-only"
                  onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                  checked={pizzaSize === "S"}
                  type="radio"
                  name="pizza-size"
                  value="S"
                  id="pizza-s"
                />
                <label className={sizeLabelClass} htmlFor="pizza-s">
                  Small
                </label>
              </span>
              <span>
                <input
                  className="peer sr-only"
                  onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                  checked={pizzaSize === "M"}
                  type="radio"
                  name="pizza-size"
                  value="M"
                  id="pizza-m"
                />
                <label className={sizeLabelClass} htmlFor="pizza-m">
                  Medium
                </label>
              </span>
              <span>
                <input
                  className="peer sr-only"
                  onChange={(e) => setPizzaSize(e.target.value as PizzaSize)}
                  checked={pizzaSize === "L"}
                  type="radio"
                  name="pizza-size"
                  value="L"
                  id="pizza-l"
                />
                <label className={sizeLabelClass} htmlFor="pizza-l">
                  Large
                </label>
              </span>
            </div>
          </div>
          <button
            className="btn"
            type="submit"
          >
            Add to Cart
          </button>
        </div>
        {loading || !selectedPizza ? (
          <h3>Loading...</h3>
        ) : (
          <div className="my-2.5 ml-6.25 w-full p-3.75 text-center">
            <Pizza
              name={selectedPizza.name}
              description={selectedPizza.description}
              image={selectedPizza.image}
            />
            <p>{price}</p>
          </div>
        )}
      </form>
      {loading ? (
        <h2>LOADING …</h2>
      ) : (
        <Cart checkout={() => void checkout()} cart={cart} />
      )}
    </div>
  );
}
