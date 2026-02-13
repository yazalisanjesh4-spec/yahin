"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useCart } from "@/context/CartContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) {
        setProduct({ id: snap.id, ...snap.data() });
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <img
        src={product.imageUrl}
        className="w-full h-64 object-cover rounded"
      />
      <h1 className="text-2xl font-bold mt-4">
        {product.title}
      </h1>
      <p className="text-gray-500">
        Size: {product.size}
      </p>
      <p className="font-bold text-xl mt-2">
        ₹{product.price}
      </p>

      <button
        onClick={() => addToCart(product)}
        className="mt-4 w-full bg-green-600 text-white py-3 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}