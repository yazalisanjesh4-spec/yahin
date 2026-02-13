"use client";

import Link from "next/link";

export default function OrderConfirmationPage() {
  return (
    <div className="max-w-xl mx-auto text-center py-20">
      <h1 className="text-2xl font-bold mb-4">
        Order placed 🎉
      </h1>

      <p className="text-gray-600 mb-4">
        We have received your payment request.
        Your order is being verified and will be confirmed shortly.
      </p>

      <p className="text-sm text-gray-500 mb-6">
        Delivery will be arranged after payment confirmation.
      </p>

      <Link
        href="/"
        className="text-green-600 font-semibold"
      >
        Continue shopping →
      </Link>
    </div>
  );
}