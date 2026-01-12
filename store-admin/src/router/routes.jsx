import { createBrowserRouter } from "react-router-dom";
import CategoryList from "../components/categories/CategoryList";
import AddCategory from "../components/categories/AddCategory";
import Dashboard from "../components/dashboard/dashboard";
import Products from "../components/products/Products";
import AddProduct from "../components/products/AddProduct";
import EditProduct from "../components/products/EditProduct";



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
        path: "/products/edit",
        element: <EditProduct />,
    },
]);