import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategory } from "../../api/category";
import { toast } from "react-toastify";


const AddCategory = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        await createCategory({ name });
        toast.success("Category created successfully");
        navigate("/categories");
    };



    return (
        <div className="container mx-auto mt-10 px-4 max-w-lg">
            <h2 className="text-2xl font-bold mb-6">Add Category</h2>
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                    <label className="block mb-2 font-medium">Category Name</label>
                    <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    {error && <p className="text-red-600 mt-1">{error}</p>}
                </div>
                <div className="flex space-x-3">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                        onClick={() => navigate("/categories")}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
