import { createBrowserRouter } from "react-router-dom";
import CategoryList from "../components/categories/CategoryList";
import AddCategory from "../components/categories/AddCategory";
import Dashboard from "../components/dashboard/dashboard";
import Products from "../components/products/Products";
import AddProduct from "../components/products/AddProduct";
import EditProduct from "../components/products/EditProduct";
import ViewProduct from "../components/products/viewProduct";
import Orders from "../components/orders/orders";
import Users from "../components/users/users";
import POSHome from "../components/pos/posHome";
import Analytics from "../components/analytics/analytics";
import Settings from "../components/settings/settings";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/categories",
        element: <CategoryList />,
    },
    {
        path: "/categories/add",
        element: <AddCategory />,
    },
    {
        path: "/products",
        element: <Products />,
    },
    {
        path: "/products/add",
        element: <AddProduct />,
    },
    {
        path: "/products/edit/:id",
        element: <EditProduct />,
    },
    {
        path: "/products/view/:id",
        element: <ViewProduct />,
    },
    {
        path: "/orders",
        element: <Orders />,
    },
    {
        path: "/users",
        element: <Users />,
    },
    {
        path: "/pos",
        element: <POSHome />,
    },
    {
        path: "/analytics",
        element: <Analytics />,
    },
    {
        path: "/settings",
        element: <Settings />,
    },
]);