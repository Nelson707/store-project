import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { updateProduct } from "../../api/products";
import { toast } from "react-toastify";
import Layout from "../component/layout";
import {
    ArrowLeft,
    Upload,
    Package,
    Tag,
    DollarSign,
    Grid,
    FileText,
    Save,
    Image as ImageIcon,
    Layers,
    RefreshCw
} from "lucide-react";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [form, setForm] = useState({
        name: "",
        brand: "",
        price: "",
        stockQuantity: 0,
        description: "",
        categoryId: "",
        imageFile: null,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setFetchLoading(true);
                // Fetch categories
                const categoriesRes = await api.get("/categories");
                setCategories(categoriesRes.data);

                // Fetch product
                const productsRes = await api.get(`/products`);
                const product = productsRes.data.find(p => p.id === parseInt(id));

                if (product) {
                    setForm({
                        name: product.name || "",
                        brand: product.brand || "",
                        price: product.price || "",
                        stockQuantity: product.stockQuantity || 0,
                        description: product.description || "",
                        categoryId: product.category?.id || "",
                        imageFile: null,
                    });

                    // Set current image path
                    if (product.imageFileName) {
                        setCurrentImage(`/images/${product.imageFileName}`);
                    }
                } else {
                    toast.error("Product not found");
                    navigate("/products");
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                toast.error("Failed to load product details");
                navigate("/products");
            } finally {
                setFetchLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

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
                setCurrentImage(null); // Clear current image when new one is selected
            };
            reader.readAsDataURL(file);
        } else if (name === "stockQuantity") {
            // Ensure stockQuantity is an integer
            setForm(prev => ({
                ...prev,
                [name]: parseInt(value) || 0,
            }));
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

        // Validation
        if (form.stockQuantity < 0) {
            toast.error("Stock quantity cannot be negative");
            setLoading(false);
            return;
        }

        // Create FormData
        const fd = new FormData();

        // Append all fields
        fd.append('name', form.name.trim());
        fd.append('brand', form.brand?.trim() || '');
        fd.append('price', form.price.toString());
        fd.append('description', form.description?.trim() || '');
        fd.append('stockQuantity', parseInt(form.stockQuantity, 10));
        fd.append('categoryId', parseInt(form.categoryId, 10));

        // Only append image if a new one is selected
        if (form.imageFile) {
            fd.append('imageFile', form.imageFile);
        }

        // Debug log
        console.log('Updating product with data:');
        for (let [key, value] of fd.entries()) {
            console.log(key, value);
        }

        try {
            await updateProduct(id, fd);
            toast.success("Product updated successfully!");
            navigate("/products");
        } catch (err) {
            console.error('Edit error:', err.response || err);
            toast.error(err.response?.data?.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    const removeNewImage = () => {
        setForm(prev => ({ ...prev, imageFile: null }));
        setPreviewImage(null);
    };

    if (fetchLoading) {
        return (
            <Layout title="Edit Product" subtitle="Loading product details...">
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading product details...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Edit Product" subtitle="Update product information">
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <button
                                onClick={() => navigate("/products")}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Products
                            </button>
                            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
                            <p className="text-gray-600 mt-2">Update the details of your product</p>
                        </div>
                        <div className="hidden md:block">
                            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                <RefreshCw className="h-8 w-8 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Image Section */}
                                <div className="lg:col-span-1">
                                    <div className="space-y-6">
                                        {/* Current/New Image Display */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                                <ImageIcon className="h-5 w-5 text-blue-600" />
                                                Product Image
                                            </label>

                                            {previewImage ? (
                                                // New image preview
                                                <div className="relative">
                                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-blue-500 shadow-lg">
                                                        <img
                                                            src={previewImage}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                            New
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={removeNewImage}
                                                        className="absolute top-3 right-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors shadow-lg"
                                                    >
                                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ) : currentImage ? (
                                                // Current product image
                                                <div className="relative">
                                                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-md">
                                                        <img
                                                            src={currentImage}
                                                            alt="Current product"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                                                        Current
                                                    </div>
                                                </div>
                                            ) : (
                                                // No image placeholder
                                                <div className="aspect-square rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-6">
                                                    <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-500 text-center">No image available</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Upload New Image Button */}
                                        <div>
                                            <label className="flex items-center justify-center w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer transition-colors border-2 border-dashed border-gray-300 hover:border-blue-400">
                                                <Upload className="h-5 w-5 text-gray-600 mr-2" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {currentImage ? 'Change Image' : 'Upload Image'}
                                                </span>
                                                <input
                                                    type="file"
                                                    name="imageFile"
                                                    className="hidden"
                                                    onChange={handleChange}
                                                    accept="image/*"
                                                />
                                            </label>
                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                PNG, JPG, GIF up to 10MB
                                            </p>
                                        </div>

                                        {/* Stock Status Card */}
                                        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
                                            <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                                                <Layers className="h-5 w-5 text-indigo-600" />
                                                Stock Status
                                            </h3>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Current Quantity</span>
                                                    <span className="font-bold text-lg text-gray-900">{form.stockQuantity || 0}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-gray-600">Status</span>
                                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${form.stockQuantity > 20
                                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                                            : form.stockQuantity > 0
                                                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                                                : 'bg-red-100 text-red-800 border border-red-200'
                                                        }`}>
                                                        {form.stockQuantity > 20
                                                            ? '● In Stock'
                                                            : form.stockQuantity > 0
                                                                ? '● Low Stock'
                                                                : '● Out of Stock'}
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
                                                Product Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                placeholder="Enter product name"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                                                    value={form.brand}
                                                    onChange={handleChange}
                                                    placeholder="Enter brand name"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                                />
                                            </div>

                                            {/* Price */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <DollarSign className="h-5 w-5 text-purple-600" />
                                                    Price (KES) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <span className="text-gray-500">KES</span>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        name="price"
                                                        value={form.price}
                                                        onChange={handleChange}
                                                        placeholder="0.00"
                                                        min="0"
                                                        step="0.01"
                                                        className="w-full pl-14 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <Grid className="h-5 w-5 text-orange-600" />
                                                    Category <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name="categoryId"
                                                        value={form.categoryId}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all appearance-none bg-white"
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                    <Layers className="h-5 w-5 text-indigo-600" />
                                                    Stock Quantity <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    name="stockQuantity"
                                                    value={form.stockQuantity}
                                                    onChange={handleChange}
                                                    placeholder="Enter quantity"
                                                    min="0"
                                                    step="1"
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                                    required
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Update current stock level
                                                </p>
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
                                                value={form.description}
                                                onChange={handleChange}
                                                placeholder="Enter product description..."
                                                rows="5"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                            />
                                            <p className="text-sm text-gray-500 mt-2">
                                                Update the product description, features, and specifications.
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
                                                        Updating Product...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Save className="h-5 w-5" />
                                                        Update Product
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Tips Card */}
                    <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-sm text-gray-900">Editing Tips</p>
                                <p className="text-sm text-gray-600">
                                    • Leave image empty to keep the current product image<br />
                                    • Stock quantity updates will affect inventory tracking<br />
                                    • All changes are saved immediately when you click update
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}