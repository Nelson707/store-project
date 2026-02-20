import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Layout from "../component/layout";
import {
    X,
    Filter,
    Search,
    Package,
    Grid,
    Tag,
    Eye,
    Edit,
    Trash2,
    AlertCircle,
    ChevronDown,
    ChevronUp
} from "lucide-react";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchField, setSearchField] = useState("all");
    const [showSearchFilters, setShowSearchFilters] = useState(false);
    const [searchResultsCount, setSearchResultsCount] = useState(0);

    const fetchProducts = () => {
        setLoading(true);
        api.get("/products")
            .then(res => {
                setProducts(res.data);
                setFilteredProducts(res.data);
                console.log("Products", res.data)
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    };

    const fetchCategories = () => {
        api.get("/categories")
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Memoized search and filter function
    const applyFilters = useMemo(() => {
        let result = products;

        // Apply category filter
        if (selectedCategory) {
            result = result.filter(
                product => product.category?.id === selectedCategory.id
            );
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();

            result = result.filter(product => {
                switch (searchField) {
                    case "name":
                        return product.name?.toLowerCase().includes(query);

                    case "brand":
                        return product.brand?.toLowerCase().includes(query);

                    case "description":
                        return product.description?.toLowerCase().includes(query);

                    case "all":
                    default:
                        return (
                            product.name?.toLowerCase().includes(query) ||
                            product.brand?.toLowerCase().includes(query) ||
                            product.description?.toLowerCase().includes(query) ||
                            product.category?.name?.toLowerCase().includes(query) ||
                            product.price?.toString().includes(query)
                        );
                }
            });
        }

        return result;
    }, [products, selectedCategory, searchQuery, searchField]);

    // Update filtered products when filters change
    useEffect(() => {
        const results = applyFilters;
        setFilteredProducts(results);
        setSearchResultsCount(results.length);
    }, [applyFilters]);

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

    const clearFilter = () => {
        setSelectedCategory(null);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const clearSearch = () => {
        setSearchQuery("");
        setSearchField("all");
    };

    const getStockStatus = (quantity) => {
        if (quantity > 20) return { label: 'In Stock', color: 'bg-green-100 text-green-800 border-green-200' };
        if (quantity > 0) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
        return { label: 'Out of Stock', color: 'bg-red-100 text-red-800 border-red-200' };
    };

    const highlightText = (text, query) => {
        if (!query || !text) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.toString().split(regex).map((part, i) =>
            regex.test(part) ? <mark key={i} className="bg-yellow-200 px-0.5 rounded">{part}</mark> : part
        );
    };

    return (
        <Layout title="Products" subtitle="Manage your product inventory">
            <div className="min-h-screen bg-gray-50 p-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Package className="h-6 w-6 text-blue-600" />
                            Products
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {selectedCategory
                                ? `Showing products in "${selectedCategory.name}"`
                                : `All products`
                            }
                            {searchQuery && ` • Search: "${searchQuery}"`}
                            <span className="ml-2 text-sm font-medium text-blue-600">
                                ({searchResultsCount} product{searchResultsCount !== 1 ? 's' : ''})
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                        {selectedCategory && (
                            <button
                                onClick={clearFilter}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                Clear Filter
                            </button>
                        )}
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                Clear Search
                            </button>
                        )}
                        <Link
                            to="/products/add"
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center gap-2 shadow-md"
                        >
                            <Package className="h-4 w-4" />
                            Add Product
                        </Link>
                    </div>
                </div>

                {/* Search Bar - Enhanced */}
                <div className="mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search products by name, brand, description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowSearchFilters(!showSearchFilters)}
                                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center gap-2 transition-colors"
                            >
                                <Filter className="h-5 w-5" />
                                Filters
                                {showSearchFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </button>

                            <select
                                value={searchField}
                                onChange={(e) => setSearchField(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                            >
                                <option value="all">All Fields</option>
                                <option value="name">Product Name</option>
                                <option value="brand">Brand</option>
                                <option value="description">Description</option>
                            </select>
                        </div>
                    </div>

                    {/* Advanced Search Filters */}
                    {showSearchFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Search Tips</label>
                                    <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                        <li>• Search by product name, brand, or description</li>
                                        <li>• Filter by category using tags above</li>
                                        <li>• Combine category and search filters</li>
                                    </ul>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Active Filters</label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {selectedCategory && (
                                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs">
                                                Category: {selectedCategory.name}
                                                <button onClick={clearFilter} className="ml-1 hover:text-blue-600">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        )}
                                        {searchField !== 'all' && (
                                            <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs">
                                                Searching in: {searchField}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Quick Stats</label>
                                    <div className="mt-2 text-sm">
                                        <p className="text-gray-700">Total Products: <span className="font-bold">{products.length}</span></p>
                                        <p className="text-gray-700">Filtered Results: <span className="font-bold text-blue-600">{searchResultsCount}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Category Filter Tags */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Grid className="h-5 w-5 text-gray-600" />
                        <h3 className="text-sm font-medium text-gray-700">Filter by Category</h3>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedCategory
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            All Products
                        </button>

                        {categories.map(category => {
                            const count = products.filter(p => p.category?.id === category.id).length;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${selectedCategory?.id === category.id
                                            ? 'bg-blue-100 text-blue-800 border-2 border-blue-500 shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                                        }`}
                                >
                                    <span>{category.name}</span>
                                    <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {searchQuery
                                    ? 'No products found'
                                    : selectedCategory
                                        ? 'No products in this category'
                                        : 'No products yet'
                                }
                            </h3>
                            <p className="text-gray-500 mb-6 max-w-md">
                                {searchQuery
                                    ? `No products match "${searchQuery}". Try different keywords or clear filters.`
                                    : selectedCategory
                                        ? 'There are no products available in the selected category.'
                                        : 'Get started by adding your first product to the inventory.'
                                }
                            </p>
                            <div className="flex gap-3">
                                {(searchQuery || selectedCategory) && (
                                    <button
                                        onClick={() => {
                                            clearSearch();
                                            clearFilter();
                                        }}
                                        className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                                    >
                                        Clear All Filters
                                    </button>
                                )}
                                <Link
                                    to="/products/add"
                                    className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium"
                                >
                                    Add Product
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                Product
                                                {searchField === 'name' && <Search className="h-3 w-3 text-blue-600" />}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                Category
                                                {searchField === 'category' && <Search className="h-3 w-3 text-blue-600" />}
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-1">
                                                Price
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredProducts.map(p => {
                                        const stockStatus = getStockStatus(p.stockQuantity || 0);
                                        return (
                                            <tr
                                                key={p.id}
                                                className="hover:bg-gray-50 transition-colors group"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group-hover:border-blue-400 transition-colors">
                                                        <img
                                                            src={`/images/${p.imageFileName}`}
                                                            alt={p.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://via.placeholder.com/150?text=No+Image";
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {searchQuery ? highlightText(p.name, searchQuery) : p.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Tag className="h-3 w-3" />
                                                            {searchQuery ? highlightText(p.brand || 'No brand', searchQuery) : (p.brand || 'No brand')}
                                                        </div>
                                                        {p.description && searchQuery && (
                                                            <div className="text-xs text-gray-500 mt-1 line-clamp-1">
                                                                {highlightText(p.description, searchQuery)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {p.category ? (
                                                        <button
                                                            onClick={() => handleCategoryClick(p.category)}
                                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                                                        >
                                                            {searchQuery ? highlightText(p.category.name, searchQuery) : p.category.name}
                                                        </button>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">Uncategorized</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-medium text-gray-900">
                                                        KES {p.price?.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                                                        {stockStatus.label}
                                                        <span className="ml-1 font-bold">{p.stockQuantity || 0}</span>
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            to={`/products/view/${p.id}`}
                                                            className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                        <Link
                                                            to={`/products/edit/${p.id}`}
                                                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                            title="Edit Product"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(p.id)}
                                                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                                                            title="Delete Product"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Results Footer */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="mt-6 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                <Package className="h-4 w-4 text-blue-600" />
                                Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> of{' '}
                                <span className="font-bold text-gray-900">{products.length}</span> products
                                {selectedCategory && ` in "${selectedCategory.name}"`}
                                {searchQuery && ` matching "${searchQuery}"`}
                            </div>
                            <div className="flex items-center gap-4">
                                {selectedCategory && (
                                    <button
                                        onClick={clearFilter}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear category filter
                                    </button>
                                )}
                                {searchQuery && (
                                    <button
                                        onClick={clearSearch}
                                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear search
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}