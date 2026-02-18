import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const formatKES = (amount) => `KES ${Number(amount).toLocaleString("en-KE")}`;

export default function CartSidebar() {
    const navigate = useNavigate();
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

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate("/checkout");
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isCartOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                    <div className="flex items-center space-x-2">
                        <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
                        {totalItems > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-xs font-medium">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="Close cart"
                    >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-16">
                            <div className="text-6xl mb-4">🛒</div>
                            <p className="text-gray-500 font-medium">Your cart is empty</p>
                            <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="mt-6 px-5 py-2.5 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onIncrement={() => incrementQuantity(item.id)}
                                onDecrement={() => decrementQuantity(item.id)}
                                onRemove={() => removeFromCart(item.id)}
                            />
                        ))
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-white">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">Subtotal</span>
                            <span className="text-base font-semibold text-gray-900">
                                {formatKES(totalPrice)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400">
                            Shipping & taxes calculated at checkout
                        </p>
                        <button
                            onClick={handleCheckout}
                            className="w-full py-3.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        >
                            Proceed to Checkout
                        </button>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="w-full py-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors text-center"
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    return (
        <div className="flex gap-4 py-3 border-b border-gray-50 last:border-0">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                    src={`http://localhost:8080/images/${item.imageFileName}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <p className="text-sm font-medium text-gray-900 truncate pr-2">{item.name}</p>
                    <button
                        onClick={onRemove}
                        className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove item"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                    {formatKES(item.price)}
                </p>

                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                            onClick={onDecrement}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="w-8 text-center text-sm font-medium text-gray-900">
                            {item.quantity}
                        </span>
                        <button
                            onClick={onIncrement}
                            className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                        {formatKES(item.price * item.quantity)}
                    </span>
                </div>
            </div>
        </div>
    );
}