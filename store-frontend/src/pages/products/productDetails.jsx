import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../components/layout/layout";
import api from "../../api/axios";
import { toastify } from "../../utils/toast";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addedAnimation, setAddedAnimation] = useState(false);

    const { addToCart, incrementQuantity, decrementQuantity, cartItems, setIsCartOpen } = useCart();

    const cartItem = cartItems.find((item) => item.id === product?.id);

    const formatKES = (amount) => `KES ${amount.toLocaleString("en-KE")}`;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error(error);
                toastify("Failed to load product", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        setAddedAnimation(true);
        setTimeout(() => setAddedAnimation(false), 600);
    };

    if (loading) {
        return (
            <Layout title="Loading...">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading product details...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout title="Product not found">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Product Not Found</h2>
                        <p className="text-gray-500">The product you're looking for doesn't exist.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={product.name} subtitle={product.category?.name}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                <nav className="flex items-center text-sm text-gray-500 mb-8">
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center hover:text-gray-700 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Products
                    </button>
                    <span className="mx-2">/</span>
                    <span className="text-gray-400">{product.category?.name}</span>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

                    {/* Image Section */}
                    <div className="bg-gray-100 rounded-xl overflow-hidden">
                        <img
                            src={`http://localhost:8080/images/${product.imageFileName}`}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div className="space-y-3">
                            <div className="inline-block">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                                    {product.category?.name || "Uncategorized"}
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-light text-gray-900 tracking-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-center space-x-2">
                                <span className="text-3xl font-semibold text-gray-900">
                                    {formatKES(product.price)}
                                </span>
                            </div>
                        </div>

                        {/* Brand & Details */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">Brand:</span>
                                    <span className="font-medium text-gray-900">{product.brand}</span>
                                </div>
                                <div className="w-px h-4 bg-gray-300"></div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-gray-500">In Stock</span>
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                </div>
                            </div>

                            <div className="pt-2">
                                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        {/* Specifications */}
                        <div className="pt-4">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Specifications</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">SKU</span>
                                        <span className="font-medium">{product.stockQuantity}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Condition</span>
                                        <span className="font-medium">New</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-8 space-y-4">
                            <div className="flex space-x-4">
                                {/* Cart quantity controls — shown when item is already in cart */}
                                {cartItem ? (
                                    <div className="flex-1 flex items-center">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => decrementQuantity(product.id)}
                                                className="w-11 h-11 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-none"
                                                aria-label="Decrease quantity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-12 text-center text-base font-semibold text-gray-900 select-none">
                                                {cartItem.quantity}
                                            </span>
                                            <button
                                                onClick={() => incrementQuantity(product.id)}
                                                className="w-11 h-11 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors duration-100 focus:outline-none"
                                                aria-label="Increase quantity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setIsCartOpen(true)}
                                            className="ml-4 text-sm text-gray-600 underline underline-offset-2 hover:text-gray-900 transition-colors duration-150 whitespace-nowrap"
                                        >
                                            View cart
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        className={`flex-1 px-8 py-3.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 ${addedAnimation ? "scale-95 bg-gray-700" : ""
                                            }`}
                                    >
                                        {addedAnimation ? "Added ✓" : "Add to Cart"}
                                    </button>
                                )}

                                {/* Wishlist button */}
                                <button className="px-5 py-3.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}