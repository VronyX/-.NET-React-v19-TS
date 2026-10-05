import { Provider } from "react-redux";
import { routeTree } from "./routeTree.gen";
import { store } from "./store";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./index.css";

const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


const App = () => {
  return (
    <StrictMode>
      <Provider store={store}>
          <RouterProvider router={router} />
      </Provider>
    </StrictMode>
  );
};

//  Kode di bawah ini digunakan untuk merender elemen React yang dibuat oleh fungsi App ke dalam DOM.
const container = document.getElementById("root");
if (!container){
  throw new Error("No container to render to");
}
const root = createRoot(container);
root.render(<App />);
