import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import CartDrawer from "./components/cartdrawer/cartdrawer.jsx";

function App() {
  return (
    <>
      <CartProvider>
      <CartDrawer />
      <RouterProvider router={router} />
      </CartProvider>
    </>
  );
}

export default App;
