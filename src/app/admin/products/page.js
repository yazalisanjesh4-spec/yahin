"use client";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import AdminGuard from "@/components/AdminGuard";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    title: "",
    size: "",
    price: "",
    shopName: "",
    imageUrl: "",
  });

  useEffect(() => {
    const q = query(
      collection(db, "products"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  const addProduct = async () => {
    if (!form.title || !form.price || !form.imageUrl) {
      alert("Fill required fields");
      return;
    }

    await addDoc(collection(db, "products"), {
      title: form.title,
      size: form.size,
      price: Number(form.price),
      shopName: form.shopName,
      imageUrl: form.imageUrl,
      createdAt: new Date(),
    });

    setForm({
      title: "",
      size: "",
      price: "",
      shopName: "",
      imageUrl: "",
    });
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <AdminGuard>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Manage Products
        </h1>

        {/* Add Product */}
        <div className="bg-white border rounded-lg p-4 mb-8">
          <h2 className="font-semibold mb-4">
            Add New Product
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Title"
              className="border px-3 py-2 rounded"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <input
              placeholder="Size"
              className="border px-3 py-2 rounded"
              value={form.size}
              onChange={(e) =>
                setForm({ ...form, size: e.target.value })
              }
            />

            <input
              placeholder="Price"
              className="border px-3 py-2 rounded"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
            />

            <input
              placeholder="Shop Name"
              className="border px-3 py-2 rounded"
              value={form.shopName}
              onChange={(e) =>
                setForm({ ...form, shopName: e.target.value })
              }
            />

            <input
              placeholder="Image URL"
              className="border px-3 py-2 rounded md:col-span-2"
              value={form.imageUrl}
              onChange={(e) =>
                setForm({ ...form, imageUrl: e.target.value })
              }
            />
          </div>

          <button
            onClick={addProduct}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex justify-between items-center bg-white border rounded-lg p-4"
            >
              <div className="flex items-center">
                <img
                  src={product.imageUrl}
                  className="w-16 h-16 rounded object-cover"
                />
                <div className="ml-4">
                  <p className="font-semibold">
                    {product.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{product.price} — {product.shopName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => deleteProduct(product.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminGuard>
  );
}