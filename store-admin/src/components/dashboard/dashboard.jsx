import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="container mx-auto mt-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <h1 className="text-3xl font-bold text-blue-600">Tailwind is working!</h1>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Categories Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Categories</h2>
                    <p className="text-gray-600 mb-4">View, add, edit, and delete categories.</p>
                    <Link
                        to="/categories"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Manage Categories
                    </Link>
                </div>

                {/* Products Card */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Products</h2>
                    <p className="text-gray-600 mb-4">View, add, edit, and delete products.</p>
                    <Link
                        to="/products"
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Manage Products
                    </Link>
                </div>

                {/* Reports Placeholder */}
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-2">Reports</h2>
                    <p className="text-gray-600 mb-4">Generate reports and analytics.</p>
                    <button
                        className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                        disabled
                    >
                        Coming Soon
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
