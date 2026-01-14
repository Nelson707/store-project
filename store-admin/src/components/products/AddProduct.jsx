import { useEffect, useState } from "react";
import { createProduct } from "../../api/products";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Layout from "../component/layout";

export default function AddProduct() {
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
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData
        const fd = new FormData();

        // Append all fields - ensure proper values
        fd.append('name', form.name);
        fd.append('brand', form.brand || ''); // Send empty string if undefined
        fd.append('price', form.price);
        fd.append('description', form.description || '');

        // IMPORTANT: Convert categoryId to number
        if (form.categoryId) {
            fd.append('categoryId', parseInt(form.categoryId, 10));
        }

        // Append image if exists
        if (form.imageFile) {
            fd.append('imageFile', form.imageFile);
        }

        console.log('FormData entries:'); // Debug log
        for (let [key, value] of fd.entries()) {
            console.log(key, value);
        }

        try {
            await createProduct(fd);
            toast.success("Product created successfully");
            navigate("/products");
        } catch (err) {
            console.error('Error details:', err); // Add this for debugging
            toast.error(err.response?.data?.message || "Failed to create product");
        }
    };

    return (
        <Layout title="Products" subtitle="Add a new product">
            <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded-lg p-6">
                <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        placeholder="Product name"
                        className="w-full border rounded px-3 py-2"
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="brand"
                        placeholder="Brand"
                        className="w-full border rounded px-3 py-2"
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        className="w-full border rounded px-3 py-2"
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="categoryId"
                        className="w-full border rounded px-3 py-2"
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select category</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    <textarea
                        name="description"
                        placeholder="Description"
                        className="w-full border rounded px-3 py-2"
                        onChange={handleChange}
                    />

                    <input
                        type="file"
                        name="imageFile"
                        className="w-full"
                        onChange={handleChange}
                        required
                    />

                    <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
                        Save Product
                    </button>
                </form>
            </div>
        </Layout>
    );
}
