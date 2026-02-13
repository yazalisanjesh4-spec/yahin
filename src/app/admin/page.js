"use client";

import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function AdminHome() {
  return (
    <AdminGuard>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Admin Dashboard
        </h1>

        <div className="space-y-4">
          <Link
            href="/admin/orders"
            className="block bg-white border rounded-lg p-4 hover:border-green-600"
          >
            <h2 className="font-semibold">Manage Orders</h2>
            <p className="text-sm text-gray-500">
              View and update order status
            </p>
          </Link>

          <Link
            href="/admin/products"
            className="block bg-white border rounded-lg p-4 hover:border-green-600"
          >
            <h2 className="font-semibold">Manage Products</h2>
            <p className="text-sm text-gray-500">
              Add, view, and remove products
            </p>
          </Link>
        </div>
      </div>
    </AdminGuard>
  );
}