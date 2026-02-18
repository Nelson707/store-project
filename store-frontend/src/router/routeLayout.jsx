import React from "react";
import { Outlet } from "react-router-dom";
import CartSidebar from "../components/cartdrawer/cartdrawer";

// This wraps every route, so CartSidebar is always mounted
// and always inside the Router context — fixing the useNavigate() error.
export default function RootLayout() {
    return (
        <>
            <CartSidebar />
            <Outlet />
        </>
    );
}