import ProductCard from "../../components/product/productCard";

export default function ProductGrid({ products, loading }) {
    if (loading) {
        return (
            <div className="text-center text-gray-500 py-10">
                Loading products...
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                No products available
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
