import { createBrowserRouter } from "react-router-dom";
import Login from "../authentication/login";
import Register from "../authentication/register";
import Home from "../pages/dashboard/home";



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
]);