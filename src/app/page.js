"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      }
    );

    return () => unsub();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        Available near you
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="bg-white border rounded-lg p-4"
          >
            <img
              src={product.imageUrl}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="font-semibold mt-2">
              {product.title}
            </h3>
            <p className="text-sm text-gray-500">
              Size: {product.size}
            </p>
            <p className="font-bold mt-1">
              ₹{product.price}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}