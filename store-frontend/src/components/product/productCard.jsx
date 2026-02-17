// import React from "react";
// import { useNavigate } from "react-router-dom";

// const ProductCard = ({ product }) => {
//     const navigate = useNavigate();

//     const formatKES = (amount) =>
//         `KES ${amount.toLocaleString("en-KE", {
//             minimumFractionDigits: 0,
//         })}`;

//     const goToDetails = () => {
//         navigate(`/productDetails/${product.id}`);
//     };

//     return (
//         <div
//             onClick={goToDetails}
//             className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden cursor-pointer"
//         >
//             {/* Image */}
//             <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
//                 <img
//                     src={`http://localhost:8080/images/${product.imageFileName}`}
//                     alt={product.name}
//                     className="object-cover h-full w-full"
//                     onError={(e) => {
//                         e.target.src = "/placeholder.png";
//                     }}
//                 />
//             </div>

//             {/* Content */}
//             <div className="p-4 space-y-2">
//                 <h3 className="text-lg font-semibold text-gray-800 truncate">
//                     {product.name}
//                 </h3>

//                 <p className="text-sm text-gray-500">
//                     {product.brand} • {product.category?.name}
//                 </p>

//                 <p className="text-gray-600 text-sm line-clamp-2">
//                     {product.description}
//                 </p>

//                 <div className="flex items-center justify-between pt-3">
//                     <span className="text-xl font-bold text-gray-900">
//                         {formatKES(product.price)}
//                     </span>

//                     {/* Optional explicit button */}
//                     <button
//                         onClick={(e) => {
//                             e.stopPropagation(); // prevent card click bubbling
//                             goToDetails();
//                         }}
//                         className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800"
//                     >
//                         View
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;




import React from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const formatKES = (amount) =>
        `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;

    const goToDetails = () => {
        navigate(`/productDetails/${product.id}`);
    };

    // Simple "new" badge: show if product was added within the last 7 days
    const isNew =
        product.createdAt &&
        new Date() - new Date(product.createdAt) < 7 * 24 * 60 * 60 * 1000;

    return (
        <div
            onClick={goToDetails}
            className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
        >
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
                {isNew && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-indigo-600 text-white px-2.5 py-1 rounded-full shadow">
                        New
                    </span>
                )}
                {product.discount > 0 && (
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-rose-500 text-white px-2.5 py-1 rounded-full shadow">
                        -{product.discount}%
                    </span>
                )}
            </div>

          

            {/* Image */}
            <div className="relative h-52 bg-gray-50 overflow-hidden">
                <img
                    src={`http://localhost:8080/images/${product.imageFileName}`}
                    alt={product.name}
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                />
                {/* subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 gap-2">
                {/* Category + Brand */}
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide">
                    <span>{product.brand}</span>
                    {product.category?.name && (
                        <>
                            <span className="text-gray-200">•</span>
                            <span>{product.category.name}</span>
                        </>
                    )}
                </div>

                {/* Name */}
                <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-500 line-clamp-2 flex-1">
                    {product.description}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-100 pt-3 mt-auto flex items-center justify-between gap-2">
                    {/* Price */}
                    <div>
                        <p className="text-lg font-extrabold text-gray-950 leading-none">
                            {formatKES(product.price)}
                        </p>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <p className="text-xs text-gray-400 line-through mt-0.5">
                                {formatKES(product.originalPrice)}
                            </p>
                        )}
                    </div>

                    {/* CTA */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToDetails();
                        }}
                        className="shrink-0 px-4 py-2 text-xs font-semibold bg-gray-950 text-white rounded-xl hover:bg-indigo-600 transition-colors duration-200 flex items-center gap-1.5 shadow-sm"
                    >
                        View
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;