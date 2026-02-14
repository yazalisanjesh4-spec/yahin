"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function formatDate(value) {
  if (!value) return "—";
  if (value.seconds) {
    return new Date(value.seconds * 1000).toLocaleString("en-IN");
  }
  return new Date(value).toLocaleString("en-IN");
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubOrders = onSnapshot(
        q,
        (snapshot) => {
          setOrders(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );

      return () => unsubOrders();
    });

    return () => unsubAuth();
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        My orders 👜
      </h1>

      {loading && (
        <p className="text-gray-500">Loading orders…</p>
      )}

      {!loading && orders.length === 0 && (
        <p className="text-gray-500">
          You haven’t placed any orders yet.
        </p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-xl rounded-2xl p-4"
          >
            <p className="text-sm text-gray-500">
              Order ID: {order.id}
            </p>
            <p className="text-sm text-gray-500">
              Placed at: {formatDate(order.createdAt)}
            </p>
<div className="mt-3 space-y-3">
  {order.items.map((item) => (
    <div
      key={item.id}
      className="flex items-center gap-3 border rounded p-2"
    >
      {/* Product Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-14 h-14 object-cover rounded"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/80x80?text=No+Image";
        }}
      />

      {/* Product Info */}
      <div className="flex-1 text-sm">
        <p className="font-medium">
          {item.title}
        </p>
        <p className="text-gray-500">
          Size: {item.size}
        </p>
      </div>

      {/* Price */}
      <div className="font-semibold text-sm">
        ₹{item.price}
      </div>
    </div>
  ))}
</div>
            <div className="flex justify-between items-center mt-4">
              <strong>Total: ₹{order.totalAmount}</strong>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded">
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}