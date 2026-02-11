import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../api/category";
import { toast } from "react-toastify";
import Layout from "../component/layout";
import {
    ArrowLeft,
    PlusCircle,
    Tag,
    XCircle
} from "lucide-react";

const AddCategory = () => {
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await createCategory({ name: name.trim() });
            toast.success("Category created successfully!");
            navigate("/categories");
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Failed to create category";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout title="Add Category" subtitle="Create a new product category">
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <button
                                onClick={() => navigate("/categories")}
                                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Categories
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Add New Category</h1>
                        </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Category Name Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-green-600" />
                                    Category Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g., Electronics, Clothing, Books..."
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all
                                            ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'}`}
                                        value={name}
                                        onChange={(e) => {
                                            setName(e.target.value);
                                            if (error) setError("");
                                        }}
                                        autoFocus
                                    />
                                </div>
                                {error && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        <XCircle className="h-4 w-4" />
                                        {error}
                                    </p>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => navigate("/categories")}
                                    className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !name.trim()}
                                    className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle className="h-4 w-4" />
                                            Create Category
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddCategory;