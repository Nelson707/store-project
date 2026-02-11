import { useEffect, useState } from "react";
import { createProduct } from "../../api/products";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Layout from "../component/layout";
import {
    ArrowLeft,
    Upload,
    Package,
    Tag,
    DollarSign,
    Grid,
    FileText,
    PlusCircle,
    Image as ImageIcon
} from "lucide-react";

export default function AddProduct() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [form, setForm] = useState({
        name: "",
        brand: "",
        price: "",
        stockQuantity: "",
        description: "",
        categoryId: "",
        imageFile: null,
    });

    useEffect(() => {
        api.get("/categories").then(res => setCategories(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "imageFile" && files && files[0]) {
            const file = files[0];
            setForm(prev => ({
                ...prev,
                [name]: file,
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Create FormData
        const fd = new FormData();

        // Append all fields
        fd.append('name', form.name);
        fd.append('brand', form.brand || '');
        fd.append('price', form.price);
        fd.append('description', form.description || '');
        fd.append('stockQuantity', form.stockQuantity || '0');

        // Convert categoryId to number
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
            toast.success("Product created successfully!");
            navigate("/products");
        } catch (err) {
            console.error('Error details:', err);
            toast.error(err.response?.data?.message || "Failed to create product");
        } finally {
            setLoading(false);
        }
    };

    const removeImage = () => {
        setForm(prev => ({ ...prev, imageFile: null }));
        setPreviewImage(null);
    };

    return (
        <Layout title="Add Product" subtitle="Create a new product in your inventory">
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button
                                onClick={() => navigate("/products")}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Products
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
                            <p className="text-gray-600 mt-2">Fill in the details below to add a new product to your inventory</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <PlusCircle className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Image Upload */}
                                <div className="lg:col-span-1">
                                    <div className="space-y-6">
                                        {/* Image Upload Area */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                                <ImageIcon className="h-5 w-5 text-blue-600" />
                                                Product Image
                                            </label>

                                            {previewImage ? (
                                                <div className="relative">
                                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300">
                                                        <img
                                                            src={previewImage}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeImage}
                                                        className="absolute top-3 right-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="flex flex-col items-center justify-center w-full h-64 border-3 border-dashed border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                                        <p className="mb-2 text-sm text-gray-500">
                                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, GIF up to 10MB
                                                        </p>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        name="imageFile"
                                                        className="hidden"
                                                        onChange={handleChange}
                                                        accept="image/*"
                                                        required
                                                    />
                                                </label>
                                            )}
                                        </div>

                                        {/* Quick Stats Preview */}
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                                            <h3 className="font-medium text-gray-700 mb-3">Quick Preview</h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Name</span>
                                                    <span className="font-medium truncate max-w-[120px]">{form.name || "—"}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Price</span>
                                                    <span className="font-medium">
                                                        {form.price ? `KES ${parseInt(form.price).toLocaleString()}` : "—"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-gray-600">Category</span>
                                                    <span className="font-medium">
                                                        {categories.find(c => c.id == form.categoryId)?.name || "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Form Fields */}
                                <div className="lg:col-span-2">
                                    <div className="space-y-6">
                                        {/* Product Name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <Package className="h-5 w-5 text-blue-600" />
                                                Product Name
                                            </label>
                                            <input
                                                name="name"
                                                placeholder="Enter product name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Brand */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <Tag className="h-5 w-5 text-green-600" />
                                                    Brand
                                                </label>
                                                <input
                                                    name="brand"
                                                    placeholder="Enter brand name"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            {/* Price */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <DollarSign className="h-5 w-5 text-purple-600" />
                                                    Price (KES)
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500">KES</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <Grid className="h-5 w-5 text-orange-600" />
                                                    Category
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name="categoryId"
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none bg-white"
                                                        onChange={handleChange}
                                                        required
                                                    >
                                                        <option value="">Select a category</option>
                                                        {categories.map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Stock Quantity */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Stock Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    name="stockQuantity"
                                                    placeholder="Enter stock quantity"
                                                    min="0"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                <FileText className="h-5 w-5 text-gray-600" />
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                placeholder="Enter product description..."
                                                rows="5"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                                onChange={handleChange}
                                            />
                                            <p className="text-sm text-gray-500 mt-2">
                                                Describe your product in detail. Include features, specifications, and benefits.
                                            </p>
                                        </div>

                                        {/* Form Actions */}
                                        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                                            <button
                                                type="button"
                                                onClick={() => navigate("/products")}
                                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        Creating Product...
                                                    </>
                                                ) : (
                                                    <>
                                                        <PlusCircle className="h-5 w-5" />
                                                        Create Product
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </Layout>
    );
}