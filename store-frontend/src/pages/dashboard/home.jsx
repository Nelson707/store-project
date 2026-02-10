import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import api from "../../api/axios";
import { toastify } from "../../utils/toast";
import ProductGrid from "../products/productGrid";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                if (response.status === 200) {
                    // show latest 4 products
                    setProducts(response.data.slice(0, 4));
                }
            } catch (error) {
                console.error(error);
                toastify("Failed to load products", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <Layout
            title="Welcome to Store"
            subtitle="Discover our latest products"
        >
            <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

                {/* Hero */}
                <div className="bg-gray-900 text-white rounded-xl p-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">
                        Shop Quality Products
                    </h1>
                    <p className="text-gray-300 max-w-xl">
                        Electronics, accessories and more — curated just for you.
                    </p>
                </div>

                {/* Latest Products */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">
                        Latest Products
                    </h2>
                    <ProductGrid products={products} loading={loading} />
                </section>

            </div>
        </Layout>
    );
}
