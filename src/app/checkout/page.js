"use client";

import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const router = useRouter();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price,
    0
  );

  // Cart empty guard
  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold">
          Your cart is empty
        </h2>
        <Link
          href="/"
          className="inline-block mt-6 text-green-600 font-semibold"
        >
          Go back to shopping →
        </Link>
      </div>
    );
  }

  const handlePaymentConfirm = async () => {
    const user = auth.currentUser;

    // Login check
    if (!user) {
      router.push("/login");
      return;
    }

    // Fetch user profile (phone + address)
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("Please enter delivery details");
      router.push("/address");
      return;
    }

    const userData = userSnap.data();

    // Create order in Firestore
    await addDoc(collection(db, "orders"), {
      userId: user.uid,
      userName: userData.name,
      userEmail: userData.email,
      phoneNumber: userData.phone,
      address: userData.address,

      items: cartItems,
      totalAmount,
      status: "Payment verification pending",
      createdAt: new Date(),
    });

    // Clear cart (localStorage)
    localStorage.removeItem("yahin_cart");

    router.push("/order-confirmation");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Checkout
      </h1>

      {/* ORDER SUMMARY */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <h2 className="font-semibold mb-4">
          Order Summary
        </h2>

        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between mb-3"
          >
            <div className="flex items-center">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-12 h-12 object-cover rounded mr-3"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/100x100?text=No+Image";
                }}
              />
              <div>
                <p className="text-sm font-medium">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500">
                  Size: {item.size}
                </p>
              </div>
            </div>

            <span className="text-sm font-semibold">
              ₹{item.price}
            </span>
          </div>
        ))}

        <div className="flex justify-between font-bold mt-4">
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Includes product & delivery charges
        </p>
      </div>

      {/* PAYMENT SECTION */}
      <div className="bg-white p-4 rounded-lg border">
        <h2 className="font-semibold mb-2">
          Pay using UPI
        </h2>

        <p className="text-sm text-gray-600 mb-4">
          Scan the QR code below and pay the exact amount.
          After payment, click “I have paid”.
        </p>

        {/* UPI QR */}
        <div className="flex justify-center mb-4">
          <img
            src="/upi-qr.png"
            alt="UPI QR Code"
            className="w-48 h-48 object-contain border rounded"
          />
        </div>

        <p className="text-sm text-center text-gray-700 mb-4">
          Pay <strong>₹{totalAmount}</strong> to{" "}
          <strong>Yahin</strong>
        </p>

        <button
          onClick={handlePaymentConfirm}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          I have paid
        </button>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Your order will be confirmed after payment verification.
        </p>
      </div>
    </div>
  );
}