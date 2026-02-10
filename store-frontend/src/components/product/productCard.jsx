import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString("en-KE", {
            minimumFractionDigits: 0,
        })}`;

    const goToDetails = () => {
        navigate(`/productDetails/${product.id}`);
    };

    return (
        <div
            onClick={goToDetails}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden cursor-pointer"
        >
            {/* Image */}
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                    src={`http://localhost:8080/images/${product.imageFileName}`}
                    alt={product.name}
                    className="object-cover h-full w-full"
                    onError={(e) => {
                        e.target.src = "/placeholder.png";
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.name}
                </h3>

                <p className="text-sm text-gray-500">
                    {product.brand} • {product.category?.name}
                </p>

                <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between pt-3">
                    <span className="text-xl font-bold text-gray-900">
                        {formatKES(product.price)}
                    </span>

                    {/* Optional explicit button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // prevent card click bubbling
                            goToDetails();
                        }}
                        className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    >
                        View
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
