import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import PizzaOfTheDay from "../PizzaOfTheDay";
import Header from "../Header";

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        {/* <> React Fragment = mirip div sebagai pembungkus (wrapper) */}
          <div>
            <Header />
            <Outlet />
            <PizzaOfTheDay />
          </div>
        <TanStackRouterDevtools />
      </>
    );
  },
});
