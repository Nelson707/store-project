import React, { useEffect } from "react";
import { useCart } from "../../context/CartContext";

const formatKES = (amount) => `KES ${amount.toLocaleString("en-KE")}`;

export default function CartDrawer() {
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        incrementQuantity,
        decrementQuantity,
        removeFromCart,
        totalItems,
        totalPrice,
    } = useCart();

    // Close on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") setIsCartOpen(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [setIsCartOpen]);

    // Prevent body scroll when open
    useEffect(() => {
        document.body.style.overflow = isCartOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isCartOpen]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
                    isCartOpen ? "opacity-40 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
                    isCartOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
                        {totalItems > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gray-900 rounded-full">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                        aria-label="Close cart"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-sm">Your cart is empty</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-4 text-sm text-gray-900 underline underline-offset-2 hover:no-underline transition-all"
                            >
                                Continue shopping
                            </button>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 space-y-1">
                            {cartItems.map((item) => (
                                <li key={item.id} className="py-4 flex items-start gap-4">
                                    {/* Product image */}
                                    <div className="w-18 h-18 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden" style={{ width: 72, height: 72 }}>
                                        <img
                                            src={`http://localhost:8080/images/${item.imageFileName}`}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{item.brand}</p>
                                        <p className="text-sm font-semibold text-gray-900 mt-1">
                                            {formatKES(item.price * item.quantity)}
                                        </p>

                                        {/* Quantity controls */}
                                        <div className="flex items-center mt-2 space-x-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                <button
                                                    onClick={() => decrementQuantity(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-100 focus:outline-none"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                                    </svg>
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium text-gray-900 select-none">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => incrementQuantity(item.id)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-100 focus:outline-none"
                                                    aria-label="Increase quantity"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-gray-300 hover:text-red-400 transition-colors duration-150 ml-1"
                                                aria-label="Remove item"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                            <span className="text-base font-semibold text-gray-900">{formatKES(totalPrice)}</span>
                        </div>
                        <p className="text-xs text-gray-400">Shipping and taxes calculated at checkout</p>
                        <button className="w-full py-3.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900">
                            Checkout → {formatKES(totalPrice)}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}