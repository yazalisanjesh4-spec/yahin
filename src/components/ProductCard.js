import Link from "next/link";
  export default function ProductCard({ product }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden cursor-pointer hover:shadow-md transition">
        {/* Image */}
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
  src={product.imageUrl}
  alt={product.title}
  className="w-full h-full object-cover"
  onError={(e) => {
    e.target.src =
      "https://via.placeholder.com/400x300?text=No+Image";
  }}
/>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg">
            {product.title}
          </h3>

          <p className="text-sm text-gray-500">
            Size: {product.size}
          </p>

          <p className="text-sm text-gray-500">
            {product.shopName}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold text-lg">
              ₹{product.price}
            </span>

            <span className="text-xs text-green-600 font-semibold">
              Deliver in 2 hours
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}