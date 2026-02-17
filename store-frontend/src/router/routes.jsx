import { createBrowserRouter } from "react-router-dom";
import Login from "../authentication/login";
import Register from "../authentication/register";
import Home from "../pages/dashboard/home";
import Products from "../pages/products/products";
import ProductDetails from "../pages/products/productDetails";
import Orders from "../components/orders/orders";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/products",
        element: <Products />,
    },
    {
        path: "/productDetails/:id",
        element: <ProductDetails />,
    },
    {
        path: "/orders",
        element: <Orders />,
    },
]);