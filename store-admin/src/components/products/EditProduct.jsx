import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { updateProduct } from "../../api/products";
import { toast } from "react-toastify";
import Layout from "../component/layout";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: "",
        brand: "",
        price: "",
        description: "",
        categoryId: "",
        imageFile: null,
    });

    useEffect(() => {
        api.get("/categories").then(res => setCategories(res.data));
        api.get(`/products`).then(res => {
            const product = res.data.find(p => p.id === parseInt(id));
            if (product) {
                setForm({
                    name: product.name,
                    brand: product.brand,
                    price: product.price,
                    description: product.description,
                    categoryId: product.category.id,
                    imageFile: null,
                });
            }
        });
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const fd = new FormData();

        // Append all fields (same as your add page)
        fd.append('name', form.name);
        fd.append('brand', form.brand);
        fd.append('price', form.price.toString());
        fd.append('description', form.description || '');
        fd.append('categoryId', form.categoryId.toString());

        // Only append image if exists (optional for edit)
        if (form.imageFile) {
            fd.append('imageFile', form.imageFile);
        }

        // DEBUG: Show what's in FormData
        console.log('FormData entries for edit:');
        for (let [key, value] of fd.entries()) {
            console.log(key, value);
        }

        try {
            // USE THE updateProduct FUNCTION (not api.put directly)
            await updateProduct(id, fd);
            toast.success("Product updated successfully");
            navigate("/products");
        } catch (err) {
            console.error('Edit error:', err.response || err);
            toast.error(err.response?.data?.message || "Failed to update product");
        }
    };

    return (
        <Layout title="Products" subtitle="Edit product">
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-xl bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-semibold mb-6 text-gray-800">Edit Product</h1>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Brand */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <input
                                name="brand"
                                value={form.brand}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                rows="4"
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        {/* Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                            <input
                                type="file"
                                name="imageFile"
                                onChange={handleChange}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                        </div>
                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate("/products")}
                                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                Update Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
