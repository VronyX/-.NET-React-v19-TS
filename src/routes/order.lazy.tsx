import { createLazyFileRoute } from "@tanstack/react-router";
import Cart from "../Cart";
import Pizza from "../Pizza";
import type { Pizza as PizzaType, PizzaSize } from "../APIResponsesTypes";
import { useAppDispatch, useAppSelector } from "../hooks";
import { addToCart, clearCart, selectCartItems } from "../cartSlice";
import {
  setPizzaType,
  setPizzaSize,
  selectPizzaType,
  selectPizzaSize,
} from "../orderSlice";
import { useGetPizzasQuery, usePlaceOrderMutation } from "../api/pizzaApi";

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
  const { data: pizzaTypes = [], isLoading: isLoadingPizzas } =
    useGetPizzasQuery();
  const [placeOrder, { isLoading: isPlacingOrder }] = usePlaceOrderMutation();
  const loading = isLoadingPizzas || isPlacingOrder;
  const pizzaType = useAppSelector(selectPizzaType);
  const pizzaSize = useAppSelector(selectPizzaSize);
  const cart = useAppSelector(selectCartItems);
  const dispatch = useAppDispatch();

  let price: string | undefined;
  let selectedPizza: PizzaType | undefined;
  if (!loading) {
    selectedPizza = pizzaTypes.find((pizza) => pizzaType === pizza.id);
    price = selectedPizza
      ? intl.format(selectedPizza.sizes[pizzaSize])
      : undefined;
  }

  async function checkout() {
    await placeOrder(cart);
    dispatch(clearCart());
  }

  return (
    <div className="mx-auto grid max-w-325 grid-cols-1 gap-7.5 max-w-175 my-30 mx-auto lg:grid-cols-[2fr_1fr]">
      <div className="w-full lg:ml-[5%]">
        <h2>Create Order</h2>
        <form
          className="flex flex-col md:flex-row md:justify-between"
          onSubmit={(e) => {
            e.preventDefault();
            if (!selectedPizza || !price) {
              return;
            }
            dispatch(
              addToCart({ pizza: selectedPizza, size: pizzaSize, price }),
            );
          }}
        >
          <div className="my-2.5 w-full border-b border-border p-3.75 text-center md:border-r md:border-b-0">
            <div className="my-2.5 text-center">
              <label
                className="mb-2.5 block text-[20px] text-secondary"
                htmlFor="pizza-type"
              >
                Pizza Type
              </label>
              <select
                className="form-select mb-7.5 block w-full py-1.25 pl-1.25 text-[16px]"
                onChange={(e) => dispatch(setPizzaType(e.target.value))}
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
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
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
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
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
                    onChange={(e) =>
                      dispatch(setPizzaSize(e.target.value as PizzaSize))
                    }
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
            <button className="btn" type="submit">
              Add to Cart
            </button>
          </div>
          {loading || !selectedPizza ? (
            <h3>Loading...</h3>
          ) : (
            <div className="my-2.5 w-full p-3.75 text-center md:ml-6.25">
              <Pizza
                name={selectedPizza.name}
                description={selectedPizza.description}
                image={selectedPizza.image}
              />
              <p>{price}</p>
            </div>
          )}
        </form>
      </div>
      {loading ? (
        <h2>LOADING …</h2>
      ) : (
        <Cart checkout={() => void checkout()} cart={cart} />
      )}
    </div>
  );
}
