import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext.jsx";

function App() {
  return (
    <>
      <CartProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
      </CartProvider>
    </>
  );
}

export default App;
