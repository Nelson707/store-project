import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/routes.jsx";

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
