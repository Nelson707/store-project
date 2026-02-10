import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/layout";
import api from "../../api/axios";
import { toastify } from "../../utils/toast";
import ProductCard from "../../components/product/productCard";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            console.log("response", response);

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

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <Layout
            title="Products"
            subtitle="Browse our latest products"
        >
            <div className="max-w-7xl mx-auto px-4 py-6">
                {loading ? (
                    <div className="text-center text-gray-500">
                        Loading products...
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center text-gray-500">
                        No products available
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
