import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import api from "../../api/axios";
import { toastify } from "../../utils/toast";
import ProductCard from "../../components/product/productCard";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            if (response.status === 200) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error(error);
            toastify("Failed to load products", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/categories");
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.error(error);
            toastify("Failed to load categories", "error");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const filtered = products.filter((p) => {
        const matchSearch =
            p.name?.toLowerCase().includes(search.toLowerCase()) ||
            p.brand?.toLowerCase().includes(search.toLowerCase()) ||
            p.description?.toLowerCase().includes(search.toLowerCase());
        const matchCategory =
            activeCategory === "All" ||
            p.category?.name?.toLowerCase() === activeCategory.toLowerCase();
        return matchSearch && matchCategory;
    });

    return (
        <Layout title="Products" subtitle="Browse our latest products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

                {/* ── Search ── */}
                <div className="relative">
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        fill="none" stroke="currentColor" strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products, brands…"
                        className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* ── Category Pills ── */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveCategory("All")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === "All"
                                ? "bg-gray-950 text-white shadow-md"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                            }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === cat.name
                                    ? "bg-gray-950 text-white shadow-md"
                                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* ── Results header ── */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
                    </p>
                    {(search || activeCategory !== "All") && !loading && (
                        <button
                            onClick={() => { setSearch(""); setActiveCategory("All"); }}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* ── Product Grid ── */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                                <div className="h-52 bg-gray-100" />
                                <div className="p-4 space-y-3">
                                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-full" />
                                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                                    <div className="flex justify-between items-center pt-2">
                                        <div className="h-5 bg-gray-100 rounded w-1/3" />
                                        <div className="h-8 bg-gray-100 rounded-xl w-16" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 space-y-3">
                        <p className="text-4xl">🔍</p>
                        <p className="text-lg font-medium text-gray-600">No products found</p>
                        <p className="text-sm text-gray-400">Try a different keyword or category</p>
                        <button
                            onClick={() => { setSearch(""); setActiveCategory("All"); }}
                            className="mt-2 px-5 py-2.5 text-sm bg-gray-950 text-white rounded-xl hover:bg-gray-800 transition"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filtered.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

            </div>
        </Layout>
    );
}