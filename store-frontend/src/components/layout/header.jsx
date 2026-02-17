import React from 'react';
import { useCart } from '../../context/CartContext';

const Header = ({
    title = 'Dashboard',
    subtitle = "Welcome back! Here's what's happening today.",
    timeRange,
    sidebarCollapsed,
}) => {
    const { totalItems, setIsCartOpen } = useCart();

    return (
        <header
            className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 z-20"
            style={{ marginLeft: sidebarCollapsed ? '5rem' : '16rem' }}
        >
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    </div>

                    {/* Cart Button */}
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative p-2.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
                        aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ''}`}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.75}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>

                        {/* Badge */}
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-gray-900 rounded-full leading-none">
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;