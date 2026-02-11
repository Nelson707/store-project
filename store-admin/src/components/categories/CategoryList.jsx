import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories, deleteCategory } from "../../api/category";
import { toast } from "react-toastify";
import Layout from "../component/layout";
import {
  PlusCircle,
  Grid,
  Tag,
  Trash2,
  Layers,
  AlertCircle,
  Search,
  X,
  FolderOpen,
} from "lucide-react";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setFilteredCategories(data);
    } catch (err) {
      setError("Failed to fetch categories");
      toast.error("Failed to load categories");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(query) ||
        cat.id?.toString().includes(query)
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery, categories]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category? Products in this category may become uncategorized.")) return;

    setDeleteLoading(id);
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    } finally {
      setDeleteLoading(null);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Layout title="Categories" subtitle="Organize and manage product categories">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Grid className="h-5 w-5 text-white" />
                </div>
                Categories
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Layers className="h-4 w-4" />
                {filteredCategories.length} {filteredCategories.length === 1 ? 'category' : 'categories'} total
                {searchQuery && ` • Search: "${searchQuery}"`}
              </p>
            </div>

            <Link
              to="/categories/add"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all flex items-center gap-2 shadow-md font-medium"
            >
              <PlusCircle className="h-5 w-5" />
              Add Category
            </Link>
          </div>

          {/* Search Bar */}
          <div className="mb-6 bg-white rounded-xl shadow-md p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search categories by name or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
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

            </div>
          </div>

          {/* Categories Grid/Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Categories</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                  onClick={fetchCategories}
                  className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                  <FolderOpen className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchQuery ? 'No categories found' : 'No categories yet'}
                </h3>
                <p className="text-gray-500 mb-8 max-w-md">
                  {searchQuery
                    ? `No categories match "${searchQuery}". Try a different search term.`
                    : 'Get started by creating your first product category.'
                  }
                </p>
                {searchQuery ? (
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-medium flex items-center gap-2"
                  >
                    <X className="h-5 w-5" />
                    Clear Search
                  </button>
                ) : (
                  <Link
                    to="/categories/add"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 font-medium flex items-center gap-2 shadow-md"
                  >
                    <PlusCircle className="h-5 w-5" />
                    Create First Category
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Category Name
                        </div>
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCategories.map((cat, index) => (
                      <tr
                        key={cat.id}
                        className="hover:bg-gray-50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center">
                              <Tag className="h-5 w-5 text-green-700" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-lg">
                                {searchQuery ? (
                                  highlightText(cat.name, searchQuery)
                                ) : (
                                  cat.name
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                Created {new Date().toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleDelete(cat.id)}
                            disabled={deleteLoading === cat.id}
                            className="p-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-red-200"
                            title="Delete Category"
                          >
                            {deleteLoading === cat.id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-700"></div>
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Summary Footer */}
          {!loading && filteredCategories.length > 0 && (
            <div className="mt-6 bg-white rounded-xl shadow-sm p-5 border border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FolderOpen className="h-5 w-5 text-green-600" />
                  Showing <span className="font-bold text-gray-900">{filteredCategories.length}</span> of{' '}
                  <span className="font-bold text-gray-900">{categories.length}</span> categories
                  {searchQuery && ` matching "${searchQuery}"`}
                </div>
                <div className="flex items-center gap-4">
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="text-sm text-green-600 hover:text-green-800 flex items-center gap-1 font-medium"
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
      </div>
    </Layout>
  );
};

// Helper function to highlight search text
const highlightText = (text, query) => {
  if (!query || !text) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.toString().split(regex).map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 px-0.5 rounded">
        {part}
      </mark>
    ) : (
      part
    )
  );
};

export default CategoryList;