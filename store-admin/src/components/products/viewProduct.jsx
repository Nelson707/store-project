import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Layout from "../component/layout";
import {
    ArrowLeft,
    Edit,
    Trash2,
    Package,
    Tag,
    DollarSign,
    BarChart,
    Calendar,
    FileText,
    Layers,
    Hash,
    CheckCircle,
    XCircle
} from "lucide-react";

export default function ViewProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        fetchProduct();
        fetchRelatedProducts();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (err) {
            toast.error("Failed to load product details");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedProducts = async () => {
        try {
            const response = await api.get(`/products?categoryId=${product?.category?.id}&limit=4`);
            setRelatedProducts(response.data.filter(p => p.id !== parseInt(id)));
        } catch (err) {
            console.error("Failed to load related products", err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

        try {
            await api.delete(`/products/${id}`);
            toast.success("Product deleted successfully");
            navigate("/products");
        } catch (err) {
            toast.error("Failed to delete product");
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Layout title="Loading..." subtitle="Please wait">
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    if (!product) {
        return (
            <Layout title="Product Not Found" subtitle="The requested product does not exist">
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                    <Package className="h-24 w-24 text-gray-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Product Not Found</h2>
                    <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
                    <Link to="/products" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Products
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title="Product Details" subtitle="View and manage product information">
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Products
                            </Link>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
                        <p className="text-gray-500">Product ID: {product.id}</p>
                    </div>

                    <div className="flex gap-3">
                        <Link
                            to={`/products/edit/${product.id}`}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Product
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Product Image */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                                <img
                                    src={`/images/${product.imageFileName}`}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">Stock Status</span>
                                    {product.stockQuantity > 0 ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4" />
                                            In Stock ({product.stockQuantity})
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1">
                                            <XCircle className="h-4 w-4" />
                                            Out of Stock
                                        </span>
                                    )}
                                </div>

                                {product.sku && (
                                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <span className="text-gray-600">SKU</span>
                                        <span className="font-medium">{product.sku}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-blue-600" />
                                    Related Products
                                </h3>
                                <div className="space-y-3">
                                    {relatedProducts.map(related => (
                                        <Link
                                            key={related.id}
                                            to={`/products/view/${related.id}`}
                                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <img
                                                src={`/images/${related.imageFileName}`}
                                                alt={related.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-medium text-sm">{related.name}</p>
                                                <p className="text-sm text-gray-500">KES {related.price}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Product Details */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-4 border-b">Product Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                        <Package className="h-5 w-5 text-blue-600" />
                                        Basic Information
                                    </h3>

                                    <div>
                                        <label className="text-sm text-gray-500">Product Name</label>
                                        <p className="font-medium">{product.name}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">Brand</label>
                                        <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                            <Tag className="h-4 w-4 mr-1" />
                                            {product.brand}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-500">Category</label>
                                        <div className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                                            <Layers className="h-4 w-4 mr-1" />
                                            {product.category?.name}
                                        </div>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-700 flex items-center gap-2">
                                        <DollarSign className="h-5 w-5 text-green-600" />
                                        Pricing & Stock
                                    </h3>

                                    <div>
                                        <label className="text-sm text-gray-500">Price</label>
                                        <p className="text-2xl font-bold text-gray-900">KES {product.price.toLocaleString()}</p>
                                    </div>

                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <div>
                                            <label className="text-sm text-gray-500">Original Price</label>
                                            <p className="text-lg text-gray-500 line-through">KES {product.originalPrice.toLocaleString()}</p>
                                            <p className="text-sm text-red-600">
                                                Save KES {(product.originalPrice - product.price).toLocaleString()}
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-sm text-gray-500">Stock Quantity</label>
                                        <p className={`text-lg font-medium ${product.stockQuantity > 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {product.stockQuantity} units
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {product.description && (
                                <div className="mt-8 pt-6 border-t">
                                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-gray-600" />
                                        Description
                                    </h3>
                                    <div className="prose max-w-none">
                                        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* Specifications */}
                            {product.specifications && (
                                <div className="mt-8 pt-6 border-t">
                                    <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                        <BarChart className="h-5 w-5 text-gray-600" />
                                        Specifications
                                    </h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                                            {product.specifications}
                                        </pre>
                                    </div>
                                </div>
                            )}

                            {/* Meta Information */}
                            <div className="mt-8 pt-6 border-t">
                                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                    <Hash className="h-5 w-5 text-gray-600" />
                                    Meta Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <label className="text-sm text-gray-500 block mb-1">Created</label>
                                        <p className="font-medium flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(product.createdAt || new Date().toISOString())}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <label className="text-sm text-gray-500 block mb-1">Last Updated</label>
                                        <p className="font-medium flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {formatDate(product.updatedAt || new Date().toISOString())}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <label className="text-sm text-gray-500 block mb-1">Status</label>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.isActive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Views Today</p>
                                        <p className="text-2xl font-bold text-gray-900">0</p>
                                    </div>
                                    <BarChart className="h-8 w-8 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Orders This Month</p>
                                        <p className="text-2xl font-bold text-gray-900">0</p>
                                    </div>
                                    <Package className="h-8 w-8 text-green-500" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Revenue Generated</p>
                                        <p className="text-2xl font-bold text-gray-900">KES 0</p>
                                    </div>
                                    <DollarSign className="h-8 w-8 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}