import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Layout from "../component/layout";

export default function Products() {
    const [products, setProducts] = useState([]);

    const fetchProducts = () => {
        api.get("/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted successfully");
            fetchProducts();
        } catch (err) {
            toast.error("Failed to delete product");
        }
    };

    return (
        <Layout title="Products" subtitle="Manage your product inventory">
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Products</h1>
                    <Link to="/products/add" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Add Product
                    </Link>
                </div>

                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Image</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Brand</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Price</th>
                                <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td className="px-4 py-2">
                                        <img
                                            src={`/images/${p.imageFileName}`}
                                            alt={p.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{p.name}</td>
                                    <td className="px-4 py-2">{p.brand}</td>
                                    <td className="px-4 py-2">{p.category?.name}</td>
                                    <td className="px-4 py-2">Kes: {p.price}</td>
                                    <td className="px-4 py-2 text-center flex gap-2 justify-center">
                                        <Link
                                            to={`/products/edit/${p.id}`}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}
