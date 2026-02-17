import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import api from "../../api/axios";
import { toastify } from "../../utils/toast";
import ProductGrid from "../products/productGrid";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            if (response.status === 200) {
                setProducts(response.data.slice(0, 4));
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
        <Layout title="Welcome to Store" subtitle="Discover our latest products">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

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

                {/* ── Category Pills (from API) ── */}
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

                {/* ── Latest Products ── */}
                <section id="products" className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Latest Products</h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
                            </p>
                        </div>
                    </div>

                    {!loading && filtered.length === 0 ? (
                        <div className="text-center py-20 space-y-2">
                            <p className="text-4xl">🔍</p>
                            <p className="text-lg font-medium text-gray-600">No products found</p>
                            <p className="text-sm text-gray-400">Try a different keyword or category</p>
                            <button
                                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                                className="mt-4 px-5 py-2.5 text-sm bg-gray-950 text-white rounded-xl hover:bg-gray-800 transition"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <ProductGrid products={filtered} loading={loading} />
                    )}
                </section>

                {/* ── Newsletter ── */}
                <div className="rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white px-8 py-12 text-center space-y-4">
                    <h3 className="text-2xl font-bold">Get deals before they're gone</h3>
                    <p className="text-indigo-200 text-sm max-w-md mx-auto">
                        Subscribe and be the first to know about flash sales, new arrivals, and exclusive discounts.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3 rounded-xl text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="px-6 py-3 bg-white text-indigo-700 text-sm font-semibold rounded-xl hover:bg-indigo-50 transition-colors">
                            Subscribe
                        </button>
                    </div>
                </div>

            </div>
        </Layout>
    );
}