import { Link } from "@tanstack/react-router";
import { useContext } from "react";
import { CartContext } from "./contexts";

export default function Header() {
  const [cart] = useContext(CartContext);
  return (
    <nav className="w-full grid border-b border-[#ccc] grid-cols-[repeat(5,auto)]">
      <Link
        className="col-span-3 col-start-2 flex items-center justify-center"
        to={"/"}
      >
        <h1 className="h-27.5 border-b border-[#ccc] py-5 content-[url(/public/padre_gino.svg)]">
          Padre Gino's PizzaPadre Gino's Pizza
        </h1>
        <div className="col-start-5 flex items-center justify-center text-[40px]">
          🛒
          <span className="relative -top-4.25 -left-4.25 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[18px] text-white">
            {cart.length}
          </span>
        </div>
      </Link>
    </nav>
  );
}
