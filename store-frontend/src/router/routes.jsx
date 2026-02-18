import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./routeLayout";
import Login from "../authentication/login";
import Register from "../authentication/register";
import Home from "../pages/dashboard/home";
import Products from "../pages/products/products";
import ProductDetails from "../pages/products/productDetails";
import Orders from "../pages/orders/orders";
import OrderConfirmation from "../pages/orders/orderConfirmation";
import Checkout from "../pages/checkout/checkout";
import Settings from "../pages/settings/settings";




export const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
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
            {
                path: "/order-confirmation",
                element: <OrderConfirmation />,
            },
            {
                path: "/checkout",
                element: <Checkout />,
            },
            {
                path: "/settings",
                element: <Settings />,
            },
        ]
    }
]);