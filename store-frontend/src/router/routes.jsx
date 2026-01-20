import { createBrowserRouter } from "react-router-dom";
import Login from "../authentication/login";
import Register from "../authentication/register";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);